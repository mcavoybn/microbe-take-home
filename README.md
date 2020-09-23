# **Microbe Address Book Assessment**
### **Getting Started:**

1. Install node, mysql.
2. Clone the repository and run `npm install` to pull down dependencies
3. Connect to a mysql instance (or create one if you havent already) with mysqlworkbench. Open `./schema.sql` and run it. 
4. (Optional) Populate the database with dummy values by running `./address_rows.sql` and `./employee_rows.sql` in mysqlworkbench.
5. Update the config object in `./dbConfig.js` with the username/password for your database server instance
6. Run the command `npm run` to start the server
7. Open a browser window and navigate to `localhost:4000/graphql`. See `./example_graphql_queries.txt` for examples.