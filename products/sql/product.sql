
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

-- variant value table
create table if not exists variants (
  variant_id serial not null primary key,
  product_id integer not null references products (product_id),
  sku varchar(1000)
);


-- variant attributes table
create table if not exists variant_attributes (
  variant_attribute_id serial not null primary key,
  variant_id integer not null references variants (variant_id),
  attribute_id integer not null references attributes (attribute_id),
  value varchar(1000)
)

