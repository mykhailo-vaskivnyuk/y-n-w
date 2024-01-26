echo 'start'

export DATABASE=postgresql-asymmetrical-81951
export APP=merega
# export DATABASE=postgresql-animated-67025
# export APP=younworld

heroku pg:psql $DATABASE --app $APP -f create.heroku.sql
heroku pg:psql $DATABASE --app $APP -f ../structure.sql
# heroku pg:psql $DATABASE --app $APP -f data.sql

echo 'end'
