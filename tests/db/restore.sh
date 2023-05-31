echo 'start'

cd tests/db

export PGCLIENTENCODING=utf8
export DATABASE=merega
export USER=merega
export LOG=log.txt

export PGPASSWORD=admin
psql -f create.sql -U postgres &>> $LOG

export PGPASSWORD=merega
psql -d $DATABASE -f backup.sql -U $USER &>> $LOG

echo 'end'
