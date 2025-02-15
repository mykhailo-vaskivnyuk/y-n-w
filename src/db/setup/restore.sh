echo 'start'

export PGCLIENTENCODING=utf8
DATABASE=merega
USER=merega

# export PGPASSWORD=postgres
psql -h postgres -f create.sql -U postgres

export PGPASSWORD=merega
psql -h postgres -d $DATABASE -f backup.sql -U $USER

echo 'end'
