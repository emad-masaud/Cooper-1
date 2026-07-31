import frappe
def run_keys():
  user = frappe.get_doc('User', 'Administrator')
  keys = user.generate_keys()
  frappe.db.commit()
  print('API_KEY=' + user.api_key)
  print('API_SECRET=' + keys[1])
