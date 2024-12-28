echo 'start'

# prod
# DATABASE=postgresql-asymmetrical-81951
# APP=merega

# dev
DATABASE=postgresql-animated-67025
APP=younworld

heroku pg:psql $DATABASE --app $APP -f create.heroku.sql
heroku pg:psql $DATABASE --app $APP -f ../structure.sql

echo 'end'
