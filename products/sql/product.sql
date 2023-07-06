
create table if not exists products (
  product_id serial not null primary key,
  title varchar(255),
  description varchar,
  price int
)