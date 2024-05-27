echo 'start'

export PGCLIENTENCODING=utf8
export PGPASSWORD=merega
USER=merega
DATABASE=merega

psql -d $DATABASE -f migrations/nets.guests.sql -U $USER

echo 'end'
