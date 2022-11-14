echo 'start'

export PGCLIENTENCODING=utf8
export DATABASE=mereganew
export USER=mereganew

export PGPASSWORD=admin
psql -f create.sql -U postgres

export PGPASSWORD=mereganew
psql -d $DATABASE -f structure.new.sql -U $USER
# psql -d $DATABASE -f data.sql -U $USER

echo 'end'
