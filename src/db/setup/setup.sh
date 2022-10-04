
echo 'start'
PGPASSWORD=admin psql -f create.sql -U postgres
PGPASSWORD=merega psql -d merega -f structure.sql -U merega
export PGCLIENTENCODING=utf-8
PGPASSWORD=merega psql -d merega -f data.sql -U merega
echo 'end'