
create table if not exists products (
  product_id serial not null primary key,
  title varchar(255),
  description varchar,
  price int
);



-- attribute model
create table if not exists attributes (
  attribute_id serial not null primary key,
  name varchar(400),
  description varchar(500)
)