
create table if not exists products (
  product_id serial not null primary key,
  title varchar(255),
  description varchar,
  price int,
  image varchar
);


-- attribute table
create table if not exists attributes (
  attribute_id serial not null primary key,
  name varchar(400),
  description varchar(1000)
);

-- attribute value table
create table if not exists attribute_values (
    attribute_value_id     serial not null primary key,
    attribute_id integer references attributes(attribute_id),
    value varchar(400),
    label varchar(1000)
);

--ALTER TABLE attribute_values
--ADD label varchar;

-- variants table
create table if not exists variants (
  variant_id serial not null primary key,
  product_id integer not null references products (product_id),
  sku varchar(1000)
);

-- variant attributes table
-- variant_attributes table
create table if not exists variant_attributes (
  variant_attribute_id serial not null primary key,
  variant_id serial not null references variants (variant_id),
  attribute_value_id integer not null references attribute_values (attribute_value_id),
  attribute_id integer not null references attributes (attribute_id),
  image varchar
);

