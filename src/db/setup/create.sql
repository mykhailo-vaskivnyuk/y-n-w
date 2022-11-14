DROP DATABASE IF EXISTS mereganew;
DROP USER IF EXISTS mereganew;
CREATE USER mereganew WITH PASSWORD 'mereganew';
CREATE DATABASE mereganew WITH
    OWNER = mereganew
    TEMPLATE = template0
    LC_COLLATE = 'C'
    LC_CTYPE = 'C';
