#!/bin/bash
cd /root/frappe_docker
docker cp /tmp/get_keys.py frappe_docker-backend-1:/home/frappe/frappe-bench/get_keys.py
docker compose exec backend env/bin/python get_keys.py
