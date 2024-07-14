Step 1 : Open Redis bash
docker exec -it kissan_se_sidhe-redis-1 bash


DB Migration Settings
step 1 npx db-migrate create create-users-table --sql-file
step 2 npx db-migrate up
step 3 npx db-migrate udown
