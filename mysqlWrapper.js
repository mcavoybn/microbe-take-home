// go to https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628 for the full details on this snippet
// tl;dr it enables the use of await in the graphql query and mutator callbacks
const util = require( 'util' );
const mysql = require( 'mysql' );
function connect( config ) {
  const connection = mysql.createConnection( config );  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    query( sql, args ) {
        return util.promisify( connection.query )
          .call( connection, sql, args );
      },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}

module.exports = { connect };