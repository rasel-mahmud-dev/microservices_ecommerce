--ALTER TABLE users
--ADD avatar varchar;


create table if not exists users (
  user_id serial not null primary key,
  username varchar(255) not null,
  email varchar(255) not null,
  password varchar(1000) not null,
  avatar varchar
);


