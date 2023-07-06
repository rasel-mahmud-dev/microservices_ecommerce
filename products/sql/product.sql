create table products (
  product_id SERIAL NOT NULL PRIMARY KEY,
  category_name VARCHAR(255),
  description VARCHAR(255)
)