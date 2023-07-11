
create table if not exists cart (
    cart_id serial primary key,
    user_id int not null,
    sku varchar not null,
    variant_id int not null,
    product_id int not null,
    quantity int not null default 1,
    created_at timestamp default now(),

    constraint uc_cart_item unique (user_id, product_id, sku, variant_id)

    -- FOREIGN KEY (product_id) REFERENCES product (product_id) disable for separate database
);