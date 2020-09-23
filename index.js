//igraphql will not work without this polyfill
require('url-search-params-polyfill');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// TODO replace with mysql connection
var fakeDatabase = {};

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input AddressInput {
    line1: String
    line2: String
    city: String
    state: String
    zip: String
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
    getAddress(id: ID!): Address
    getEmployee(id: ID!): Employee
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
    constructor(id, {line1, line2, city, state, zip}) {
      this.id = id;
      this.line1 = line1;
      this.line2 = line2;
      this.city = city;
      this.state = state;
      this.zip = zip;      
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
var addrCount = 0;
var EmployeeCount = 0;
var root = {
    // addres CRUD operations
    getAddress: ({id}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no address exists with id ' + id);
        }
        return new Address(id, fakeDatabase[id]);
    },
    createAddress: ({input}) => {
        // Create a random id for our "database".
        var id = addrCount;
        addrCount += 1;

        fakeDatabase[id] = input;
        return new Address(id, input);
    },
    updateAddress: ({id, input}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no address exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Address(id, input);
    },
    deleteAddress: ({id, input}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no address exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        delete fakeDatabase[id];
        return new Address(id, input);
    },
    // Employee CRUD operations
    getEmployee: ({id}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no Employee exists with id ' + id);
        }
        return new Employee(id, fakeDatabase[id]);
    },
    createEmployee: ({input}) => {
        // Create a random id for our "database".
        var id = EmployeeCount;
        EmployeeCount += 1;

        fakeDatabase[id] = input;
        return new Employee(id, input);
    },
    updateEmployee: ({id, input}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no Employee exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Employee(id, input);
    },
    deleteEmployee: ({id, input}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no Employee exists with id ' + id);
        }
        delete fakeDatabase[id];
        return new Employee(id, input);
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