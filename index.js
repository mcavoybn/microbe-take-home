//graphiql client will not work without this polyfill
require('url-search-params-polyfill');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var mysqlWrapper = require('./mysqlWrapper');

var dbConnection = mysqlWrapper.connect(require('./dbConfig'));

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input AddressInput {
    line1: String
    line2: String
    city: String
    state: String
	zip: String
	employeeId: Int
  }

  input EmployeeInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    companyRole: String
  }
  
  type Address {
    id: ID!
    line1: String
    line2: String
    city: String
    state: String
	zip: String
	employeeId: Int
  }

  type Employee {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    companyRole: String
  }
  
  type Query {
    getAddress(id: ID): [Address]
    getEmployee(id: ID): [Employee],
  }
  
  type Mutation {
    createAddress(input: AddressInput): Address
    updateAddress(id: ID!, input: AddressInput): Address
    deleteAddress(id: ID!): Boolean
    createEmployee(input: EmployeeInput): Employee
    updateEmployee(id: ID!, input: EmployeeInput): Employee
    deleteEmployee(id: ID!): Boolean
  }
`);

class Address {
    constructor(id, {line1, line2, city, state, zip, employeeId}) {
      this.id = id;
      this.line1 = line1;
      this.line2 = line2;
      this.city = city;
      this.state = state;
	  this.zip = zip;   
	  this.employeeId = employeeId;   
    }
}

class Employee {
    constructor(id, {firstName, lastName, email, phoneNumber, companyRole}) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.companyRole = companyRole;      
    }
}

// The root provides a resolver function for each API endpoint
var root = {
    getAddress: async ({id}) => {
        if (!id) {
			var queryString = `SELECT * FROM address;`;
			var result = await dbConnection.query(queryString);
            return result.map(address => new Address(address.id, address));
        } else {
			var queryString = `SELECT * FROM address WHERE address.id = ${id};`;
			var result = await dbConnection.query(queryString);
			if (result.length == 0) throw `0 address rows with id ${id} found`;
            return [new Address(result[0].id, result[0])];
		}        
    },
    createAddress: async ({input}) => {
		const {line1, line2, city, state, zip, employeeId} = input;
		var queryString = `
		insert into address (line1, line2, city, state, zip, employeeId) \
		values ('${line1}', '${line2}', '${city}', '${state}', '${zip}', ${employeeId});
		`;
		var result = await dbConnection.query(queryString);
		return new Address(result.insertId, input);
    },
    updateAddress: async ({id, input}) => {
		var queryString = `UPDATE address SET `;
		Object.keys(input).forEach((key, idx) => {			
			queryString += `${idx > 0 ? "," : ""} ${key} = '${input[key]}'`;			
		});
		queryString += ` WHERE address.id = ${id}`;
		await dbConnection.query(queryString);
		return new Address(id, input);
    },
    deleteAddress: async ({id, input}) => {
		var queryString = `DELETE FROM address WHERE address.id = ${id} `;
		var result = await dbConnection.query(queryString);
		return result.affectedRows == 1;
    },
    getEmployee: async ({id}) => {
        if (!id) {
			var queryString = `SELECT * FROM employee;`;
			var result = await dbConnection.query(queryString);
            return result.map(address => new Employee(address.id, address));
        } else {
			var queryString = `SELECT * FROM employee WHERE employee.id = ${id};`;
			var result = await dbConnection.query(queryString);
			if (result.length == 0) throw `0 employee rows with id ${id} found`;
            return [new Employee(id, result[0])];
		} 
    },
    createEmployee: async ({input}) => {
		const {firstName, lastName, email, phoneNumber, companyRole} = input;
        var queryString = `
		insert into employee (firstName, lastName, email, phoneNumber, companyRole) \
		values ('${firstName}', '${lastName}', '${email}', '${phoneNumber}', '${companyRole}')`;
		var result = await dbConnection.query(queryString);
		return new Employee(result.insertId, input);
    },
    updateEmployee: async ({id, input}) => {
        var queryString = `UPDATE employee SET `;
		Object.keys(input).forEach((key, idx) => {			
			queryString += `${idx > 0 ? "," : ""} ${key} = '${input[key]}'`;			
		});
		queryString += ` WHERE employee.id = ${id}`;
		await dbConnection.query(queryString);
		return new Address(id, input);
    },
    deleteEmployee: async ({id, input}) => {
		var queryString = `DELETE FROM address WHERE address.employeeId = ${id}`;
		await dbConnection.query(queryString);
        var queryString = `DELETE FROM employee WHERE employee.id = ${id}`;
		var result = await dbConnection.query(queryString);
		return result.affectedRows == 1;
    },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');