# Storefront Backend Project


## Table of Contents
* [Description](#Descritpion)
* [Scripts](#Scripts)
* [Usage](#Usage)
* [Dependencies](#Dependencies)


## Description

This is a training project as a part of Udacity's Advanced Fullstack Web Development NanoDegree program 2022-2023.
It is about creating the RESTful API routes and associated PSQL database(s) and required database tables to power the backend of an online storefront. This is to be achieved utilizing NodeJS, Typescript, PSQL databases and related pg module, db-migrate for managing PSQL db migrations, and JWT powered authentication for information-sensitive operations. The project includes unit tests using jasmine.


## Scripts

  - ```first_run: "npm run create_dbs && db-migrate up && npm run watch"```  
  The entry point for creating the project databases and tables, then spinning the server in watch mode.

  - ```create_dbs: "npx ts-node src/utils/create_dbs.ts"```  
  Create the dev & test databases programmatically.

  - ```drop_dbs: "npx ts-node src/utils/drop_dbs.ts"```  
  Drop both PSQL databases, dev & test for a clean slate!

  - ```watch: "tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess \"node ./dist/server.js\""```   
  Transpiles the .ts files in the src folder, then runs the server.js, watches the .ts files for any change, then restarts the server reflecting the new changes.

  - ```test_short: "ENV=test db-migrate --env test up && jasmine-ts && db-migrate db:drop test"```  
  Runs the up migrations for the PSQL test_db, then runs the jasmine unit tests. Finally it deletes the test_db.

  - ```test: "npm run create_dbs && npm run test_short"```   
  Creates the PSQL testing and development dbs first, then runs the above script.

  - ```build: "npx tsc"```  
  This builds the JS in the ./dist folder

  - ```lint: "eslint 'src/**/*.ts'"```  
  Check the development code using lint 
  
  - ```lint:fix: "eslint --fix 'src/**/*.ts'"```  
  Check and fix the code using lint
  
  - ```prettier: "prettier --config .prettierrc --write src/**/*.ts"```  
  Runs prettier for code formatting
  
  - ```checkrulesnpx eslint-config-prettier"```  
  Checks for conflicting rules between lint and prettier.

## Usage
First create and update a .env file with the following info: 
```
PG_ROOT_USER=
PG_ROOT_PASS=
PG_ROOT_DB=
POSTGRES_HOST=127.0.0.1 (default)
POSTGRES_PORT=5432 (default)
PG_STORE_DB=
PG_STORE_TEST_DB=
PG_STORE_USER=
PG_STORE_PASSWORD=
ENV=dev (default), or test
BCRYPT_PASSWORD=
SALT_ROUNDS= [number]
TOKEN_SECRET=
```

`ADMIN_USER`, `ADMIN_PASS` & `PG_ROOT_DB` fields are especially important to allow the creation of the other user and databases programmatically.

Then run the package.json script called `first_run` to create the project databases and tables, then spin the server in watch mode.

If needed the entire project can be reset by running the `drop_dbs` script, deleting the `./dist` folder, then running the `first_run` script.

Once the server is up the API can be accessed via the routes descriped in the [REQUIREMENTS.md](REQUIREMENTS.md) e.g. [GET] [http://localhost:3000/products](http://localhost:3000/products)

## Dependencies

All the project dependencies / dev dependencies are listed in the [package.json](package.json) file.

