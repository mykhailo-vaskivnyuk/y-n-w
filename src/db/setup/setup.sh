echo 'start'
export PGCLIENTENCODING=utf8
PGPASSWORD=admin psql -f create.sql -U postgres
PGPASSWORD=merega psql -d merega -f structure.sql -U merega
PGPASSWORD=merega psql -d merega -f data.sql -U merega
echo 'end'