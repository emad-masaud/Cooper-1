import frappe

def create_doctypes():
    module = "MeaMart"
    
    # Ensure module exists
    if not frappe.db.exists("Module Def", module):
        doc = frappe.new_doc("Module Def")
        doc.module_name = module
        doc.app_name = "meamart_core" # Assume it goes into the existing app
        doc.insert(ignore_permissions=True)

    # 1. Ad Category
    if not frappe.db.exists("DocType", "Ad Category"):
        doc = frappe.new_doc("DocType")
        doc.name = "Ad Category"
        doc.module = module
        doc.custom = 1
        doc.fields = [
            {"fieldname": "category_name", "label": "Category Name", "fieldtype": "Data", "reqd": 1},
            {"fieldname": "slug", "label": "Slug", "fieldtype": "Data", "reqd": 1, "unique": 1},
            {"fieldname": "icon", "label": "Icon", "fieldtype": "Data"},
            {"fieldname": "parent_category", "label": "Parent Category", "fieldtype": "Link", "options": "Ad Category"},
            {"fieldname": "is_active", "label": "Is Active", "fieldtype": "Check", "default": "1"},
            {"fieldname": "sort_order", "label": "Sort Order", "fieldtype": "Int"}
        ]
        doc.append("permissions", {"role": "Guest", "read": 1})
        doc.append("permissions", {"role": "System Manager", "read": 1, "write": 1, "create": 1, "delete": 1})
        doc.insert(ignore_permissions=True)
        print("Created Ad Category")

    # 3. Classified Ad Image (Child Table)
    if not frappe.db.exists("DocType", "Classified Ad Image"):
        doc = frappe.new_doc("DocType")
        doc.name = "Classified Ad Image"
        doc.module = module
        doc.custom = 1
        doc.istable = 1
        doc.fields = [
            {"fieldname": "image", "label": "Image", "fieldtype": "Attach Image", "reqd": 1},
            {"fieldname": "is_primary", "label": "Is Primary", "fieldtype": "Check"},
            {"fieldname": "caption", "label": "Caption", "fieldtype": "Data"}
        ]
        doc.insert(ignore_permissions=True)
        print("Created Classified Ad Image")

    # 2. Classified Ad
    if not frappe.db.exists("DocType", "Classified Ad"):
        doc = frappe.new_doc("DocType")
        doc.name = "Classified Ad"
        doc.module = module
        doc.custom = 1
        doc.fields = [
            {"fieldname": "title", "label": "Title", "fieldtype": "Data", "reqd": 1},
            {"fieldname": "description", "label": "Description", "fieldtype": "Text Editor", "reqd": 1},
            {"fieldname": "category", "label": "Category", "fieldtype": "Link", "options": "Ad Category", "reqd": 1},
            {"fieldname": "price", "label": "Price", "fieldtype": "Currency"},
            {"fieldname": "price_negotiable", "label": "Price Negotiable", "fieldtype": "Check"},
            {"fieldname": "city", "label": "City", "fieldtype": "Data", "reqd": 1},
            {"fieldname": "region", "label": "Region", "fieldtype": "Data"},
            {"fieldname": "images", "label": "Images", "fieldtype": "Table", "options": "Classified Ad Image"},
            {"fieldname": "owner_name", "label": "Owner Name", "fieldtype": "Data"},
            {"fieldname": "owner_phone", "label": "Owner Phone", "fieldtype": "Data"},
            {"fieldname": "owner_whatsapp", "label": "Owner Whatsapp", "fieldtype": "Data"},
            {"fieldname": "status", "label": "Status", "fieldtype": "Select", "options": "Draft\nPublished\nExpired\nSold", "default": "Draft"},
            {"fieldname": "views_count", "label": "Views Count", "fieldtype": "Int", "default": "0", "read_only": 1},
            {"fieldname": "qr_code", "label": "QR Code", "fieldtype": "Attach Image", "read_only": 1},
            {"fieldname": "expires_on", "label": "Expires On", "fieldtype": "Date"},
            {"fieldname": "posted_by", "label": "Posted By", "fieldtype": "Link", "options": "User"}
        ]
        doc.append("permissions", {"role": "Guest", "read": 1})
        doc.append("permissions", {"role": "All", "read": 1, "write": 1, "create": 1})
        doc.append("permissions", {"role": "System Manager", "read": 1, "write": 1, "create": 1, "delete": 1})
        doc.insert(ignore_permissions=True)
        print("Created Classified Ad")

    # 4. Ad Lead
    if not frappe.db.exists("DocType", "Ad Lead"):
        doc = frappe.new_doc("DocType")
        doc.name = "Ad Lead"
        doc.module = module
        doc.custom = 1
        doc.fields = [
            {"fieldname": "ad", "label": "Ad", "fieldtype": "Link", "options": "Classified Ad", "reqd": 1},
            {"fieldname": "visitor_name", "label": "Visitor Name", "fieldtype": "Data"},
            {"fieldname": "visitor_phone", "label": "Visitor Phone", "fieldtype": "Data"},
            {"fieldname": "source", "label": "Source", "fieldtype": "Select", "options": "Website\nWhatsApp\nChat"},
            {"fieldname": "status", "label": "Status", "fieldtype": "Select", "options": "New\nContacted\nConverted\nLost", "default": "New"},
            {"fieldname": "notes", "label": "Notes", "fieldtype": "Text"},
            {"fieldname": "chat_session_id", "label": "Chat Session ID", "fieldtype": "Data"}
        ]
        doc.append("permissions", {"role": "System Manager", "read": 1, "write": 1, "create": 1, "delete": 1})
        doc.insert(ignore_permissions=True)
        print("Created Ad Lead")
    
    # Mock Data
    if not frappe.db.exists("Ad Category", "Electronics"):
        cat1 = frappe.new_doc("Ad Category")
        cat1.category_name = "Electronics"
        cat1.slug = "electronics"
        cat1.icon = "Laptop"
        cat1.insert(ignore_permissions=True)

    if not frappe.db.exists("Ad Category", "Vehicles"):
        cat2 = frappe.new_doc("Ad Category")
        cat2.category_name = "Vehicles"
        cat2.slug = "vehicles"
        cat2.icon = "Car"
        cat2.insert(ignore_permissions=True)
        
    if not frappe.db.exists("Classified Ad", {"title": "iPhone 15 Pro Max"}):
        ad1 = frappe.new_doc("Classified Ad")
        ad1.title = "iPhone 15 Pro Max"
        ad1.description = "Almost new iPhone 15 Pro Max. Clean condition."
        ad1.category = "Electronics"
        ad1.price = 4500
        ad1.city = "Riyadh"
        ad1.status = "Published"
        ad1.owner_name = "Ahmed"
        ad1.owner_whatsapp = "+966500000000"
        ad1.insert(ignore_permissions=True)
        
    if not frappe.db.exists("Classified Ad", {"title": "Toyota Camry 2023"}):
        ad2 = frappe.new_doc("Classified Ad")
        ad2.title = "Toyota Camry 2023"
        ad2.description = "Used Camry, good condition, 40k KM."
        ad2.category = "Vehicles"
        ad2.price = 90000
        ad2.city = "Jeddah"
        ad2.status = "Published"
        ad2.owner_name = "Saleh"
        ad2.owner_whatsapp = "+966500000001"
        ad2.insert(ignore_permissions=True)
        
    frappe.db.commit()
    print("Doctypes and mock data created.")

