echo 'start'

export DATABASE=postgresql-defined-93367
export APP=peaceful-chamber-69318

heroku pg:psql $DATABASE --app $APP -f structure.sql
heroku pg:psql $DATABASE --app $APP -f data.sql

echo 'end'
