# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. I've been tasked with building the API that will support this application, and my coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Users
- Index [token required]: `/api/users` [GET]
- Show (args: user id)[token required]: `/api/users/:username` [GET]
- Create [token required]: `/api/users` [POST]
- Delete [token required]: `/api/users` [DELET]

#### Products
- Index: `/api/products` [GET]
- Show (args: product id): `/api/products/id/:id` [GET]
- Create [token required]: `/api/products` [POST]
- Delete [token required]: `/api/products` [DELETE]
- Products by category (args: product category): `/api/products/cat/:category` [GET]

#### Orders
- Index [token required]: `/api/orders` [GET]
- Show (args: order id)[token required]: `/api/orders/:id` [GET]
- Create [token required]: `/api/orders` [POST]
- Delete [token required]: `/api/orders` [DELETE]
- add_product [token required]: `/api/orders/product` [POST]
- remove_product [token required]: `/api/orders/product` [DELETE]

#### Custom Queries
- Current Order by user (args: user id)[token required]: `/api/dashboard/user_active_order/:id` [GET]
- Completed Orders by user (args: user id)[token required]: `/api/dashboard/user_completed_orders/:id` [GET]

## Data Shapes
#### Product
- id: bigint SERIAL PRIMARY KEY
- product_name: VARCHAR
- price: numeric(10,3)
- category: VARCHAR

#### User
- id: bigint SERIAL PRIMARY KEY
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- user_name (unique for each user): VARCHAR(100)
- password: VARCHAR

#### Orders
- id: bigint SERIAL PRIMARY KEY
- status (active or complete): VARCHAR(15)
- user_id: bigint [foreign key to users table(id)]

#### Order_products
- id: bigint SERIAL PRIMARY KEY
- order_id: bigint [foreign key to orders table(id)]
- product_id: bigint [foreign key to products table(id)]
- quantity (of each product in the order): integer
