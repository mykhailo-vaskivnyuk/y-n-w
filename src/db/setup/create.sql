DROP DATABASE IF EXISTS merega;
DROP USER IF EXISTS merega;
CREATE USER merega WITH PASSWORD 'merega';
CREATE DATABASE merega WITH
    OWNER = merega
    TEMPLATE = template0
    LC_COLLATE = 'C'
    LC_CTYPE = 'C';
