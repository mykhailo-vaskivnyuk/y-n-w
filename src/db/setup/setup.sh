echo 'start'

export PGCLIENTENCODING=utf8
export DATABASE=merega
export USER=merega

# export PGPASSWORD=admin
psql -f create.sql -U postgres

export PGPASSWORD=merega
psql -d $DATABASE -f structure.sql -U $USER
# psql -d $DATABASE -f old.data.sql -U $USER

echo 'end'
