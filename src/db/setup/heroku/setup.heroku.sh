echo 'start'

export DATABASE=postgresql-asymmetrical-81951
export APP=merega

heroku pg:psql $DATABASE --app $APP -f create.heroku.sql
heroku pg:psql $DATABASE --app $APP -f ../structure.sql
# heroku pg:psql $DATABASE --app $APP -f data.sql

echo 'end'
