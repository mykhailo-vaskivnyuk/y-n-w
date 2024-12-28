echo 'start'

export PGCLIENTENCODING=utf8
export PGPASSWORD=merega
USER=merega
DATABASE=merega

psql -d $DATABASE -f migrations/alter.members.to.members.sql -U $USER

echo 'end'
