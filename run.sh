#!/bin/bash
cd /root/frappe_docker
docker cp /tmp/create_doctypes.py frappe_docker-backend-1:/home/frappe/frappe-bench/apps/meamart_core/meamart_core/create_doctypes.py
docker compose exec backend bench --site frontend execute meamart_core.create_doctypes.create_doctypes
