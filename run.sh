#!/bin/bash
docker exec -i frappe_docker-backend-1 bash -c "cd /home/frappe/frappe-bench && env/bin/python -c \"
import sys
import frappe
frappe.init(site='meamart.local')
frappe.connect()

code = open('/tmp/create_doctypes.py').read()
exec(code)
\""
