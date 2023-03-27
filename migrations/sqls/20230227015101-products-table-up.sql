CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(64) NOT NULL,
    price numeric(10,3) NOT NULL,
    category VARCHAR(64) NOT NULL
);