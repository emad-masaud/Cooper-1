#!/bin/bash
docker compose exec backend bench --site frontend execute "
user = frappe.get_doc('User', 'Administrator')
user.generate_keys()
user.save()
frappe.db.commit()
print('API_KEY=' + user.api_key)
print('API_SECRET=' + user.api_secret)
"
