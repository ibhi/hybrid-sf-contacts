(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$q', 'dataservice', 'logger', '$cordovaOauth', 'LOGINURL', 'CLIENTID', 'jsforce', 'auth', '$scope'];
  /* @ngInject */
  function DashboardController($q, dataservice, logger, $cordovaOauth, LOGINURL, CLIENTID, jsforce, auth, $scope) {
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
      var fieldsList = ['Id', 'Name', 'Email', 'MobilePhone'];
      activate();

      function activate() {
        auth.login().then(function(client) {
          forcetkClient = client;
        }, function(error) {
          console.error('Auth error', error)
        });
        initSmartStore();
        // var promises = [getMessageCount(), getPeople()];
        // return $q.all(promises).then(function() {
        //   logger.info('Activated Dashboard View');
        // });
      }

      // function getMessageCount() {
      //   return dataservice.getMessageCount().then(function(data) {
      //     vm.messageCount = data;
      //     return vm.messageCount;
      //   });
      // }

      // function getPeople() {
      //   return dataservice.getPeople().then(function(data) {
      //     vm.people = data;
      //     return vm.people;
      //   });
      // }

      var sfSmartStore;

      function initSmartStore() {
        // navigator.smartstore.soupExists('contacts', successCallback, errorCallback);

        // function successCallback() {
        //   console.log('Contacts soup already exists');
        // }

        // function errorCallback() {
          var indexSpecs = [
            {
              path: "Id",
              type: "string"
            },
            {
              path: "Name",
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
        // }

        sfSmartStore = function () {
          return cordova.require('com.salesforce.plugin.smartstore');
        };
      }

      function queryContacts(accessToken, instanceUrl) {
        // var conn = jsforce.connection({
        //   instanceUrl: instanceUrl,
        //   accessToken: accessToken
        // });

        var query = 'SELECT ' + fieldsList.join(',') + ' from Contact';

        forcetkClient.query(query, function(response) {
          console.log(response.records);
          $scope.$apply(function() {
            vm.contacts = response.records;
          });
          
        }, function(error) {
          console.error('Error retrieving records ', error);
        })

        // conn.queryPromise(query).then(function(data) {
        //   console.log(data.records);
        //   var contacts = data.records;
        //   if(contacts.length > 0) {
        //       sfSmartStore().upsertSoupEntries('contacts', contacts, 
        //         function(items) {
        //           var statusTxt = "upserted: " + items.length + " contacts";
        //           console.log(statusTxt);
            
        //         }, function(err) {
        //           console.error('Upsert Error ', err);
        //         });
        //   }
        // }, function(err) {
        //   console.error('Connection error: ', err);
        // });
      }

      var soupFieldsList = ['Id', 'Name', 'Email'];

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
        // var accessToken = window.localStorage.getItem('access_token');
        // var instanceUrl = window.localStorage.getItem('instance_url');
        // if(accessToken && instanceUrl) {
        //   queryContacts(accessToken, instanceUrl)
        // } else {

        //   $cordovaOauth.salesforce(LOGINURL, CLIENTID)
        //     .then(function(result) {
        //       console.log(result);
        //       window.localStorage.setItem('access_token', result.access_token);
        //       window.localStorage.setItem('refresh_token', result.refresh_token);
        //       window.localStorage.setItem('instance_url', result.instance_url);

        //       queryContacts(result.access_token, result.instance_url);

        //     }, function(error) {
        //       console.error(error);
        //     });
        // }
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
