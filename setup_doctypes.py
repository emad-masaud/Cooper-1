import frappe

def create_doctypes():
    print("Starting MeaMart DocTypes Creation...")

    # 1. Ad Category
    if not frappe.db.exists("DocType", "Ad Category"):
        doc = frappe.new_doc("DocType")
        doc.name = "Ad Category"
        doc.module = "Core"
        doc.custom = 1
        doc.autoname = "field:category_name"
        doc.fields = [
            {"fieldname": "category_name", "label": "Category Name", "fieldtype": "Data", "reqd": 1},
            {"fieldname": "slug", "label": "Slug", "fieldtype": "Data", "reqd": 1, "unique": 1},
            {"fieldname": "icon", "label": "Icon", "fieldtype": "Data"},
            {"fieldname": "parent_category", "label": "Parent Category", "fieldtype": "Link", "options": "Ad Category"},
            {"fieldname": "is_active", "label": "Is Active", "fieldtype": "Check", "default": "1"},
            {"fieldname": "sort_order", "label": "Sort Order", "fieldtype": "Int"}
        ]
        doc.insert(ignore_permissions=True)
        print("Created Ad Category")

    # 3. Classified Ad Image (Child DocType)
    if not frappe.db.exists("DocType", "Classified Ad Image"):
        doc = frappe.new_doc("DocType")
        doc.name = "Classified Ad Image"
        doc.module = "Core"
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
        doc.module = "Core"
        doc.custom = 1
        doc.autoname = "format:AD-{#####}"
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
            {"fieldname": "owner_whatsapp", "label": "Owner WhatsApp", "fieldtype": "Data"},
            {"fieldname": "status", "label": "Status", "fieldtype": "Select", "options": "Draft\nPublished\nExpired\nSold", "default": "Draft"},
            {"fieldname": "views_count", "label": "Views Count", "fieldtype": "Int", "default": "0", "read_only": 1},
            {"fieldname": "qr_code", "label": "QR Code", "fieldtype": "Attach Image", "read_only": 1},
            {"fieldname": "expires_on", "label": "Expires On", "fieldtype": "Date"},
            {"fieldname": "posted_by", "label": "Posted By", "fieldtype": "Link", "options": "User"}
        ]
        doc.insert(ignore_permissions=True)
        print("Created Classified Ad")

    # 4. Ad Lead
    if not frappe.db.exists("DocType", "Ad Lead"):
        doc = frappe.new_doc("DocType")
        doc.name = "Ad Lead"
        doc.module = "Core"
        doc.custom = 1
        doc.autoname = "format:LEAD-{#####}"
        doc.fields = [
            {"fieldname": "ad", "label": "Ad", "fieldtype": "Link", "options": "Classified Ad", "reqd": 1},
            {"fieldname": "visitor_name", "label": "Visitor Name", "fieldtype": "Data"},
            {"fieldname": "visitor_phone", "label": "Visitor Phone", "fieldtype": "Data"},
            {"fieldname": "source", "label": "Source", "fieldtype": "Select", "options": "Website\nWhatsApp\nChat"},
            {"fieldname": "status", "label": "Status", "fieldtype": "Select", "options": "New\nContacted\nConverted\nLost", "default": "New"},
            {"fieldname": "notes", "label": "Notes", "fieldtype": "Text"},
            {"fieldname": "chat_session_id", "label": "Chat Session ID", "fieldtype": "Data"}
        ]
        doc.insert(ignore_permissions=True)
        print("Created Ad Lead")

    frappe.db.commit()
    print("All DocTypes Created Successfully!")

create_doctypes()
