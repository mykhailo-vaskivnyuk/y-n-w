echo 'start'

cd tests/db

export PGCLIENTENCODING=utf8
DATABASE=merega
USER=merega

export PGPASSWORD=postgres
psql -f create.sql -U postgres

export PGPASSWORD=merega
psql -d $DATABASE -f backup.sql -U $USER

echo 'end'
