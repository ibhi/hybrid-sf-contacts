(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$q', 'dataservice', 'logger', '$cordovaOauth', 'LOGINURL', 'CLIENTID', 'auth', '$scope'];
  /* @ngInject */
  function DashboardController($q, dataservice, logger, $cordovaOauth, LOGINURL, CLIENTID, auth, $scope) {
    var vm = this;
    document.addEventListener("deviceready", function () {
      vm.news = {
        title: 'sfContacts',
        description: 'Hot Towel Angular is a SPA template for Angular developers.'
      };
      vm.messageCount = 0;
      vm.people = [];
      vm.title = 'Dashboard';

      var forcetkClient;
      console.log('Forcetk ckient ', forcetkClient);
      var fieldsList = ['Id', 'FirstName', 'LastName', 'Email'];
      activate();

      function activate() {
        auth.login().then(function(client) {
          forcetkClient = client;
        }, function(error) {
          console.error('Auth error', error)
        });
        initSmartStore();
        
      }

      var sfSmartStore;

      function initSmartStore() {
        
          var indexSpecs = [
            {
              path: "Id",
              type: "string"
            },
            {
              path: "FirstName",
              type: "string"
            },
            {
              path: "LastName",
              type: "string"
            },
            {
              path: "Email",
              type: "string"
            }
          ];

          navigator.smartstore.registerSoup('contacts', indexSpecs, successCallback, errorCallback);

          var successCallback = function(soupName) {
            console.log("Soup " + soupName + " was successfully created"); 
          };

          var errorCallback = function(err) { 
            console.log("registerSoup failed with error:" + err); 
          };

        sfSmartStore = function () {
          return cordova.require('com.salesforce.plugin.smartstore');
        };
      }

      function queryContacts(accessToken, instanceUrl) {

        var query = 'SELECT ' + fieldsList.join(',') + ' from Contact';

        forcetkClient.query(query, function(response) {
          console.log(response.records);
          $scope.$apply(function() {
            vm.contacts = response.records;
          });
          
        }, function(error) {
          console.error('Error retrieving records ', error);
        })

      }

      var soupFieldsList = ['Id', 'FirstName', 'LastName', 'Email'];

      function queryFromSoup() {
        
        var fields = prepareFieldsForSoupQuery('contacts', soupFieldsList);
        var query = 'SELECT ' + fields.join(',') + ' from {contacts}';

        var querySpec = navigator.smartstore.buildSmartQuerySpec(query, 100);

        navigator.smartstore.runSmartQuery(querySpec, function(cursor) { 
          console.log('Cursor', cursor);
          $scope.$apply(function() {
            vm.contacts = createContactList(cursor, soupFieldsList);
          });
        });
      }

      function prepareFieldsForSoupQuery(soupName, fieldsList) {
        return fieldsList.map(function(field) {
          return '{' + soupName + ':' + field + '}';
        });
      }

      function createContactList(cursor, soupFieldsList) {

        return cursor.currentPageOrderedEntries.map(function(contact) {
          var tempContact = {};
          soupFieldsList.map(function(field, i) {
            tempContact[field] = contact[i];
          });
          return tempContact;
        });
      }

      vm.login = function() {
        // queryContacts();
        queryFromSoup();
        
      }

      vm.logout = function() {
        console.log('User logged out');
        cordova.require("com.salesforce.plugin.sfaccountmanager").logout();
      }

      vm.switchUser = function() {
          cordova.require("com.salesforce.plugin.sfaccountmanager").switchToUser();
      }

      vm.showSmartStoreInspector = function() {
        sfSmartStore().showInspector();
      };

      vm.syncDown = function() {
        var options = {
          mergeMode:"OVERWRITE"
        };

        var target = {
          type: 'soql',
          query: 'SELECT ' + fieldsList.join(',') + ' from Contact'
        }

        var callback = function() {
          console.log('Sync down callback called ', arguments.length, arguments);
        };

        document.addEventListener("sync",
          function(event) {
            // event.detail contains the status of the sync operation
            console.log('Event Status ', event.detail);
            console.log('Progress: ' + event.detail.progress);
          }
        );

        cordova.require("com.salesforce.plugin.smartsync").syncDown(target, 'contacts', options, callback);
      };

      vm.syncUp = function() {
        var soupName = 'contacts';
        var options = {
          fieldlist: ['FirstName', 'LastName', 'Email'],
          mergeMode: "OVERWRITE"
        };
        function successCallback(result) {
          console.log('Syncup callback called ', result);
          // vm.syncDown();
        }
        document.addEventListener("sync",
          function(event) {
            // event.detail contains the status of the sync operation
            console.log('Event Status ', event.detail);
            console.log('Progress: ' + event.detail.progress);
          }
        );

        cordova.require("com.salesforce.plugin.smartsync")
          .syncUp(soupName, options, successCallback);
      };

      vm.insertContact = function() {
        var contact = {
          FirstName: 'Arnold',
          LastName: 'Swaz',
          Email: 'arnold@gmail.com',
        };
        sfSmartStore()
          .upsertSoupEntries('contacts', [contact], successCallback, failureCallback);

        function successCallback(items) {
          var statusTxt = "upserted: " + items.length + " contacts";
          console.log(statusTxt);
    
        }

        function failureCallback(err) {
          console.error('Upsert Error ', err);
        }
      }

      vm.removeSoup = function() {
        sfSmartStore().removeSoup('contacts',onSuccessRemoveSoup, onErrorRemoveSoup);
        
        function onSuccessRemoveSoup(result) {
          console.log('Soup removed successfully', result);
        }

        function onErrorRemoveSoup(error) {
          console.log('Error removing soup ', error);
        }
      }

    }, false);
  }
})();
