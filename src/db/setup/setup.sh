echo 'start'

export PGCLIENTENCODING=utf8
DATABASE=merega
USER=merega

# export PGPASSWORD=admin
psql -f create.sql -U postgres

export PGPASSWORD=merega
psql -d $DATABASE -f structure.sql -U $USER

echo 'end'
