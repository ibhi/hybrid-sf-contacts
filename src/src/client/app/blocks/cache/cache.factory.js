// (function() {
//   'use strict';

//   // angular
//   //   .module('blocks.cache')
//   //   .service('cache', cacheFactory);

//   cacheFactory.$inject = ['$q'];

//   function cacheFactory($q) {
//     var cache = {};

//     // document.addEventListener('deviceready', function() {

//         var db;
        
//         function createPlaceholderQuestionmark(fieldNames) {
//             return fieldNames.map(function() {
//                 return '?'
//             }).join(',');
//         }

//         function createUpdateQuery(fieldNames) {
//             return fieldNames.map(function(fieldName) {
//                 return fieldName + '=?'
//             }).join(',');
//         }

//         /**
//          * Method to initialize database
//          *
//          * @param {String} [dbName] - Name of the DB
//          * @param {String} [dbLocation] - Location of database table
//          * @returns {Promise} - Returns angularjs promise
//         */

//         cache.init = function(dbName, dbLocation) {
//             if(!window.sqlitePlugin) return new Error('sqlitePlugin not installed ');
//             if(!dbName) dbName = 'demo.db';
//             if(!dbLocation) dbLocation = 'default';
//             db = window.sqlitePlugin.openDatabase({name: dbName, location: dbLocation});
//             if(!db) return new Error('DB Creation error');
//         };

        


//         /**
//          * Method to create tables
//          *
//          * @param {String} fieldSpec - Fieldnames with type and key information in string format; (ex: id integer primary key, business_id integer, business_name text)
//          * @param {String} tableName - Table name
//          * @returns {Promise} - Returns angularjs promise
//         */
//         cache.createTable = function(fieldSpec, tableName) {
//             return $q(function(resolve, reject){
//                 db.transaction(function(tx) {
//                     tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (?) (' + fieldSpec + ')', [tableName],
//                     function(tx, result) {
//                         console.log('Populated database OK');
//                         resolve(result);
//                     }, function(error) {
//                         console.log('Transaction ERROR: ' + error.message);
//                         reject(error);
//                     });
//                 });
//             });
//         }

//         /**
//          * Method to create a new record
//          *
//          * @param {Array} fieldNames - Name of fields to perform the transaction
//          * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
//          * @param {String} tableName - Name of table to perform the transaction
//          * @returns {Promise} - Returns angularjs promise
//         */
//         cache.create = function(fieldNames, fieldValues, tableName) {
//             return $q(function(resolve, reject){
//                 var query = 'INSERT INTO ' + tableName + ' (' + fieldNames.join(',') + ') ' + 
//                     ' VALUES(' + createPlaceholderQuestionmark(fieldNames) + ')';
//                 db.transaction(function(tx) {
//                     tx.executeSql(query, fieldValues,
//                     function(tx, result) {
//                         console.log('Record created ', result);
//                         resolve(result);
//                     }, function(error) {
//                         console.log('Create ERROR: ' + error.message);
//                         reject(error);
//                     });
//                 });
//             }
//         }

//         /**
//          * Method to get all records
//          *
//          * @param {String} tableName - Name of table to perform the transaction
//          * @returns {Promise} - Returns angularjs promise
//         */
//         cache.retrieveAll = function(tableName) {
//             return $q(function(resolve, reject){
//                 var query = 'SELECT * FROM ' + tableName;
//                 db.transaction(function(tx) {
//                     tx.executeSql(query, [],
//                     function(tx, result) {
//                         console.log('All records', result);
//                         resolve(result);
//                     }, function(error) {
//                         console.log('Insert ERROR: ' + error.message);
//                         reject(error);
//                     });
//                 });
//             }
//         }

//         /**
//          * Method to get single record
//          *
//          * @param {String} tableName - Name of table to perform the transaction
//          * @returns {Promise} - Returns angularjs promise
//         */
//         cache.retrieve = function(fieldNames, id, tableName) {
//             return $q(function(resolve, reject){
//                 var query = 'SELECT ' + fieldNames.join(',') + ' FROM ' + tableName + 'WHERE Id=?';
//                 db.transaction(function(tx) {
//                     tx.executeSql(query, [id],
//                     function(tx, result) {
//                         console.log('Record fetched ', result);
//                         resolve(result);
//                     }, function(error) {
//                         console.log('Fetch ERROR: ' + error.message);
//                         reject(error);
//                     });
//                 });
//             }
//         }

//         /**
//          * Method to update a record with unique Id
//          *
//          * @param {Array} fieldNames - Name of fields to perform the transaction
//          * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
//          * @param {String} tableName - Name of table to perform the transaction
//          * @returns {Promise} - Returns angularjs promise
//         */
//         cache.save = function(fieldNames, fieldValues, tableName) {
//             fieldNames = _.concat(fieldNames, '__locally_updated__');
//             fieldValues = _.concat(fieldValues, true);
//             return $q(function(resolve, reject){
//                 var query = 'UPDATE ' + tableName + ' SET ' +  createUpdateQuery(fieldNames) + ' WHERE Id=?';
//                 db.transaction(function(tx) {
//                     tx.executeSql(query, fieldValues,
//                     function(tx, result) {
//                         console.log('Record updated ', result);
//                         resolve(result);
//                     }, function(error) {
//                         console.log('Update ERROR: ' + error.message);
//                         reject(error);
//                     });
//                 });
//             }
//         }

//         /**
//          * Method to delete a record with unique Id
//          *
//          * @param {Array} fieldNames - Name of fields to perform the transaction
//          * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
//          * @param {String} tableName - Name of table to perform the transaction
//          * @returns {Promise} - Returns angularjs promise
//         */
//         cache.delete = function(id, tableName) {
//             return $q(function(resolve, reject){
//                 var query = 'DELETE FROM ' + tableName + ' WHERE Id=?';
//                 db.transaction(function(tx) {
//                     tx.executeSql(query, [id],
//                     function(tx, result) {
//                         console.log('Record deleted ', result);
//                         resolve(result);
//                     }, function(error) {
//                         console.log('Delete ERROR: ' + error.message);
//                         reject(error);
//                     });
//                 });
//             }
//         }




//         return cache;
//     // });
    
//   }


// })();
