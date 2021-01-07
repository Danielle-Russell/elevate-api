CREATE TABLE users (
 id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
 firstname TEXT NOT NULL,
 lastname TEXT NOT NULL,
 email TEXT UNIQUE,
 password CHAR(60)
) 
