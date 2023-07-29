
--DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_ids JSON NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  order_date TIMESTAMP NOT NULL,
  order_status VARCHAR(255) NOT NULL,
  shipping_address INT NOT NULL,
  billing_address INT,
  payment_method VARCHAR(255) NOT NULL,
  order_notes VARCHAR(255),
  tax DECIMAL(10,2),
  shipping_cost DECIMAL(10,2),
  discount DECIMAL(10,2),
  coupon_code VARCHAR(255),
  customer_comments VARCHAR(255),
  order_fulfilled_by VARCHAR(255),
  order_shipped_date TIMESTAMP,
  order_delivered_date TIMESTAMP
);
