import frappe
frappe.init(site='frontend')
frappe.connect()
user = frappe.get_doc('User', 'Administrator')
keys = user.generate_keys()
frappe.db.commit()
data = frappe.db.get_value('User', 'Administrator', ['api_key', 'api_secret'], as_dict=True)
print(f"API_KEY={data['api_key']}")
print(f"API_SECRET={data['api_secret']}")
