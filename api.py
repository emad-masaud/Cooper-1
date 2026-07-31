import frappe
import re

@frappe.whitelist(allow_guest=True)
def health():
    return {"status": "ok", "app": "meamart_core", "schema": "Classified Ad"}

@frappe.whitelist(allow_guest=True)
def categories():
    data = frappe.get_all(
        "Ad Category",
        filters={"is_active": 1},
        fields=["name", "category_name", "slug", "icon", "parent_category"]
    )
    return {"data": data}

@frappe.whitelist(allow_guest=True)
def listings(limit=20, offset=0, category_slug=None, city=None, featured_only=None, q=None):
    filters = {
        "status": "Published"
    }
    
    if category_slug:
        cat_name = frappe.get_value("Ad Category", {"slug": category_slug}, "name")
        if cat_name:
            filters["category"] = cat_name
        else:
            return {"data": [], "total_count": 0, "limit": limit, "offset": offset}
            
    if city:
        filters["city"] = city
        
    try:
        limit = int(limit)
        offset = int(offset)
    except ValueError:
        frappe.throw("Limit and offset must be integers")
        
    if limit > 100:
        limit = 100

    # Basic search
    or_filters = {}
    if q:
        or_filters = {
            "title": ["like", f"%{q}%"],
            "description": ["like", f"%{q}%"]
        }

    data = frappe.get_all(
        "Classified Ad",
        filters=filters,
        or_filters=or_filters,
        fields=["name", "title", "description", "category", "price", "city", "owner_name", "owner_whatsapp", "status", "views_count", "creation", "modified"],
        limit_start=offset,
        limit_page_length=limit,
        order_by="creation desc"
    )
    
    # Get primary image for each
    for doc in data:
        images = frappe.get_all("Classified Ad Image", filters={"parent": doc.name}, fields=["image", "is_primary"], order_by="is_primary desc, idx asc", limit=1)
        doc.cover_image = images[0].image if images else None
    
    total_count = frappe.db.count("Classified Ad", filters=filters)
    
    return {
        "data": data,
        "total_count": total_count,
        "limit": limit,
        "offset": offset
    }

@frappe.whitelist(allow_guest=True)
def listing_detail(slug):
    if not slug:
        frappe.throw("Slug/Name is required")
        
    listing = frappe.get_all(
        "Classified Ad",
        filters={"name": slug, "status": "Published"},
        fields=["*"],
        limit=1
    )
    
    if not listing:
        frappe.throw("Classified Ad not found or not published", frappe.DoesNotExistError)
        
    doc = listing[0]
    
    # Update view count
    frappe.db.set_value("Classified Ad", doc.name, "views_count", (doc.views_count or 0) + 1)
    
    # Get all images
    doc.images = frappe.get_all("Classified Ad Image", filters={"parent": doc.name}, fields=["image", "caption", "is_primary"], order_by="idx asc")
    
    # Nested category summary
    if doc.category:
        cat = frappe.get_all("Ad Category", filters={"name": doc.category}, fields=["category_name", "slug", "icon"], limit=1)
        doc.category_summary = cat[0] if cat else None
        
    return {"data": doc}

@frappe.whitelist(allow_guest=True)
def advertiser_detail(slug):
    return {"data": {}}

@frappe.whitelist(allow_guest=True)
def create_conversation_lead(visitor_name, source, visitor_phone=None, ad=None, notes=None, chat_session_id=None, _honeypot=None):
    request_ip = getattr(frappe.local, 'request_ip', 'unknown')
    
    cache_key = f"meamart_rate_limit_lead_{request_ip}"
    requests_count = frappe.cache().get_value(cache_key) or 0
    if int(requests_count) >= 5:
        frappe.throw("Too many requests.", exc=frappe.exceptions.TooManyRequestsError)
    frappe.cache().set_value(cache_key, int(requests_count) + 1, expires_in_sec=3600)
    
    if _honeypot:
        return {"success": True, "lead_id": "fake_success_ignore"}

    if not visitor_name or len(visitor_name.strip()) < 2:
        frappe.throw("A valid visitor_name is required")

    try:
        doc = frappe.get_doc({
            "doctype": "Ad Lead",
            "visitor_name": visitor_name,
            "visitor_phone": visitor_phone,
            "source": source,
            "ad": ad,
            "notes": notes,
            "chat_session_id": chat_session_id,
            "status": "New"
        })
        doc.insert(ignore_permissions=True)
        return {"success": True, "lead_id": doc.name}
    except Exception as e:
        frappe.throw(f"Error creating lead: {str(e)}")

