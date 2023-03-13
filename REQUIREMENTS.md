# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: '/products' [GET]
- Show (args: product id): '/products/id/:id' [GET]
- Create [token required]: '/products' [POST]
- Delete [token required]: '/products' [DELETE]
- Products by category (args: product category): '/products/cat/:category' [GET]

#### Users
- Index [token required]: '/users' [GET]
- Show (args: user id)[token required]: '/users/:id' [GET]
- Create [token required]: '/users' [POST]
- Delete [token required]: '/users' [DELET]

#### Orders
- Index [token required]: '/orders' [GET]
- Show (args: order id)[token required]: '/orders/:id' [GET]
- Create [token required]: '/orders' [POST]
- Delete [token required]: '/orders' [DELETE]
- add_product [token required]: '/orders/:id/products' [POST]
- remove_product [token required]: '/order_product' [DELETE]

#### Custom Queries
- Current Order by user (args: user id)[token required]: '/user_active_order/:id' [GET]
- Completed Orders by user (args: user id)[token required]: '/user_completed_orders/:id' [GET]

## Data Shapes
#### Product
- id: VARCHAR
- product_name: VARCHAR
- price: integer
- category: VARCHAR

#### User
- id: VARCHAR
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- user_name (unique for each user): VARCHAR(100)
- password: VARCHAR

#### Orders
- id: VARCHAR
- user_id: string [foreign key to users table(id)]
- status (active or complete): VARCHAR(15)

#### Order_products
- id: VARCHAR
- order_id: string [foreign key to orders table(id)]
- product_id: string [foreign key to products table(id)]
- quantity (of each product in the order): integer
