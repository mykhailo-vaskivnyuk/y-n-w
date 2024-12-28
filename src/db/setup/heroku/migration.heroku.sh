echo 'start'

# prod
# DATABASE=postgresql-asymmetrical-81951
# APP=merega

# dev
DATABASE=postgresql-animated-67025
APP=younworld

heroku pg:psql $DATABASE --app $APP -f ../migrations/alter.members.to.members.sql

echo 'end'
