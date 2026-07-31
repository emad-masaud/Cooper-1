import frappe
from frappe.core.doctype.user.user import generate_keys
def run_keys():
  # generate_keys returns the secret
  api_secret = generate_keys('Administrator')
  frappe.db.commit()
  user = frappe.get_doc('User', 'Administrator')
  print('API_KEY=' + user.api_key)
  print('API_SECRET=' + api_secret)
