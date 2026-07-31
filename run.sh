#!/bin/bash
cd /root/frappe_docker
docker cp /tmp/api.py frappe_docker-backend-1:/home/frappe/frappe-bench/apps/meamart_core/meamart_core/api.py
docker compose restart backend
