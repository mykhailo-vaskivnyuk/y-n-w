echo 'start'

# prod
# export DATABASE=postgresql-asymmetrical-81951
# export APP=merega

# dev
DATABASE=postgresql-animated-67025
APP=younworld

heroku pg:psql $DATABASE --app $APP -f create.heroku.sql
heroku pg:psql $DATABASE --app $APP -f ../backup.sql

echo 'end'
