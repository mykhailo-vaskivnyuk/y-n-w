echo 'start'
# export DATABASE_URL = postgresql-symmetrical-62365
# export PGCLIENTENCODING=utf8
# heroku pg:psql -f create.sql
# PGPASSWORD=merega psql -d merega -f structure.sql -U merega
# PGPASSWORD=merega psql -d merega -f data.sql -U merega
heroku pg:psql -f structure.sql
heroku pg:psql -f data.sql
echo 'end'