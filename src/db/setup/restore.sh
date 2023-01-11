echo 'start'

export PGCLIENTENCODING=utf8
export DATABASE=merega
export USER=merega

# export PGPASSWORD=admin
psql -f create.sql -U postgres

export PGPASSWORD=merega
psql -d $DATABASE -f backup.sql -U $USER

echo 'end'
