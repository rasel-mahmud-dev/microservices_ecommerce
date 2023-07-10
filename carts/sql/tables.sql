
CREATE TABLE if not exists cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


--drop table cart_item;

CREATE TABLE if not exists cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    sku VARCHAR NOT NULL,
    variant_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
        CONSTRAINT uc_cart_item UNIQUE (cart_id, product_id, sku, variant_id),
        FOREIGN KEY (cart_id) REFERENCES cart (cart_id)
--    FOREIGN KEY (product_id) REFERENCES product (product_id) disable for separate database
);