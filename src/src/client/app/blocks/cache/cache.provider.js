(function() {
  'use strict';

  angular
    .module('blocks.cache')
    .provider('cache', cacheProvider);

  cacheProvider.$inject = ['$qProvider'];

  function cacheProvider($qProvider) {

    var config = {
        dbName: 'demo.db',
        dbLocation:'default'
    };

    this.config = function(cfg) {
        angular.extend(config, cfg);
    };

    this.$get = CacheHelper;

    CacheHelper.$inject = ['$q'];
    
    function CacheHelper($q) {

        function createPlaceholderQuestionmark(fieldNames) {
            return fieldNames.map(function() {
                return '?'
            }).join(',');
        }

        function createUpdateQuery(fieldNames) {
            return fieldNames.map(function(fieldName) {
                return fieldName + '=?'
            }).join(',');
        }
        
        /**
         * Cache constructor
         *
         * @class - Cache constructor
        */

        function Cache(){
            this.db = window.sqlitePlugin.openDatabase({name: config.dbName , location: config.dbLocation});
            if(!this.db) return new Error('Error creating database');
        }

        /**
         * Method to create tables
         *
         * @param {String} fieldSpec - Fieldnames with type and key information in string format; (ex: id integer primary key, business_id integer, business_name text)
         * @param {String} tableName - Table name
         * @returns {Promise} - Returns angularjs promise
        */

        Cache.prototype.createTable = function(fieldSpec, tableName) {
            var that = this;
            return $q(function(resolve, reject){
                that.db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + fieldSpec + ')', [],
                    function(tx, result) {
                        console.log('Populated database OK');
                        resolve(result);
                    }, function(error) {
                        console.log('Transaction ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        /**
         * Method to create a new record
         *
         * @param {Array} fieldNames - Name of fields to perform the transaction
         * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        Cache.prototype.create = function(fieldNames, fieldValues, tableName) {
            var that = this;
            return $q(function(resolve, reject){
                var query = 'INSERT INTO ' + tableName + ' (' + fieldNames.join(',') + ') ' + 
                    ' VALUES(' + createPlaceholderQuestionmark(fieldNames) + ')';
                that.db.transaction(function(tx) {
                    tx.executeSql(query, fieldValues,
                    function(tx, result) {
                        console.log('Record created ', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Create ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        /**
         * Method to get all records
         *
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        Cache.prototype.retrieveAll = function(tableName) {
            var that = this;
            return $q(function(resolve, reject){
                var query = 'SELECT * FROM ' + tableName;
                that.db.transaction(function(tx) {
                    tx.executeSql(query, [],
                    function(tx, result) {
                        console.log('All records', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Insert ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        /**
         * Method to get single record
         *
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        Cache.prototype.retrieve = function(fieldNames, id, tableName) {
            var that = this;
            return $q(function(resolve, reject){
                var query = 'SELECT ' + fieldNames.join(',') + ' FROM ' + tableName + ' WHERE Id=?';
                that.db.transaction(function(tx) {
                    tx.executeSql(query, [id],
                    function(tx, result) {
                        console.log('Record fetched ', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Fetch ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        /**
         * Method to update a record with unique Id
         *
         * @param {Array} fieldNames - Name of fields to perform the transaction
         * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        Cache.prototype.save = function(fieldNames, fieldValues, id, tableName) {
            var that = this;
            // fieldNames = _.concat(fieldNames, '__locally_updated__');
            // fieldValues = _.concat(fieldValues, id);
            fieldValues.push(id);
            return $q(function(resolve, reject){
                var query = 'UPDATE ' + tableName + ' SET ' +  createUpdateQuery(fieldNames) + ' WHERE Id=?';
                that.db.transaction(function(tx) {
                    tx.executeSql(query, fieldValues,
                    function(tx, result) {
                        console.log('Record updated ', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Update ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        /**
         * Method to delete a record with unique Id
         *
         * @param {Array} fieldNames - Name of fields to perform the transaction
         * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        Cache.prototype.delete = function(id, tableName) {
            var that = this;
            return $q(function(resolve, reject){
                var query = 'DELETE FROM ' + tableName + ' WHERE Id=?';
                that.db.transaction(function(tx) {
                    tx.executeSql(query, [id],
                    function(tx, result) {
                        console.log('Record deleted ', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Delete ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        /**
         * Method to delete a record with unique Id
         *
         * @param {Array} fieldNames - Name of fields to perform the transaction
         * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
         * @param {String} tableName - Name of table to perform the transaction
         * @returns {Promise} - Returns angularjs promise
        */
        Cache.prototype.query = function(query, fieldValues, tableName) {
            var that = this;
            return $q(function(resolve, reject){
                that.db.transaction(function(tx) {
                    tx.executeSql(query, fieldValues,
                    function(tx, result) {
                        console.log('Query completed ', result);
                        resolve(result);
                    }, function(error) {
                        console.log('Query ERROR: ' + error.message);
                        reject(error);
                    });
                });
            });
        };

        return new Cache();
    }
  

    }


})();
