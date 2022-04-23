# Deno signup, login, logout web app

This is a simple signup, login, and logout app written in Deno using:

- Oak
- ETA

There are different variants of this app depending on the storage type:

- [JSON file DB](app-json-db)
- [Mongo](app-mongo-db)
- [Postgres](app-postgres-db)
- [MySQL](app-mysql-db)

To run this app locally:

- Clone the repo
- Change the folder according to the DB type
- Run the deno application using `./runApp`
- Open `http://localhost:8000` in the browser
