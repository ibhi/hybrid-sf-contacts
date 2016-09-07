(function() {
  'use strict';

  angular
    .module('blocks.cache')
    .service('cache', cacheFactory);

  cacheFactory.$inject = ['$q'];

  function cacheFactory($q) {
    var cache = {};

    document.addEventListener('deviceready', function() {
        var dbName = 'demo.db';
        var dbLocation = 'default';
        db = window.sqlitePlugin.openDatabase({name: dbName, location: dbLocation});
        
        if(!db) return null;

        function createPlaceholderQuestionmark(fieldNames) {
            return fieldNames.map(function() {
                return '?'
            }).join(',')
        }

        /**
         * Method to create tables
         *
         * @param {String} tableName - Table name
         * @param {String} fieldSpec - Fieldnames with type and key information in string format; (ex: id integer primary key, business_id integer, business_name text)
         * @returns {Promise} - Returns angularjs promise
        */
        cache.createTable = function(tableName, fieldSpec) {
            return $q(function(resolve, reject){
                db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (?) (' + fieldSpec + ')', [tableName],
                    function(tx, result) {
                        console.log('Populated database OK');
                        resolve(result);
                    }, function(error) {
                        console.log('Transaction ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        }

        /**
         * Method to get all records
         *
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        cache.getAllRecords = function(tableName) {
            return $q(function(resolve, reject){
                var query = 'SELECT * FROM ' + tableName;
                db.transaction(function(tx) {
                    tx.executeSql(query, [],
                    function(tx, result) {
                        console.log('All records', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Insert ERROR: ' + error.message);
                        reject(error);
                    });
                });
            }
        }


        return cache;
    });
    
  }


})();
