
create table if not exists products (
  product_id serial not null primary key,
  title varchar(255),
  description varchar,
  price int
);



-- attribute table
create table if not exists attributes (
  attribute_id serial not null primary key,
  name varchar(400),
  description varchar(500)
);


-- variant value table
create table if not exists variants (
  variant_id serial not null primary key,
  product_id integer not null references products (product_id),
  sku varchar(1000)
);


-- variant attributes table
create table if not exists variant_attributes (
  variant_id serial not null primary key,
  product_id integer not null references products (product_id),
  sku integer
)