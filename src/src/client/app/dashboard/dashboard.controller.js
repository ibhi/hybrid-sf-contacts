(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$q', 'dataservice', 'logger', '$cordovaOauth', 'LOGINURL', 'CLIENTID', 'jsforce'];
  /* @ngInject */
  function DashboardController($q, dataservice, logger, $cordovaOauth, LOGINURL, CLIENTID, jsforce) {
    var vm = this;
    document.addEventListener("deviceready", function () {
      vm.news = {
        title: 'sfContacts',
        description: 'Hot Towel Angular is a SPA template for Angular developers.'
      };
      vm.messageCount = 0;
      vm.people = [];
      vm.title = 'Dashboard';

      activate();

      function activate() {
        initSmartStore();
        // var promises = [getMessageCount(), getPeople()];
        // return $q.all(promises).then(function() {
        //   logger.info('Activated Dashboard View');
        // });
      }

      function getMessageCount() {
        return dataservice.getMessageCount().then(function(data) {
          vm.messageCount = data;
          return vm.messageCount;
        });
      }

      function getPeople() {
        return dataservice.getPeople().then(function(data) {
          vm.people = data;
          return vm.people;
        });
      }

      var isSfSmartStore;
      var sfSmartStore;

      function initSmartStore() {

        isSfSmartStore = false;

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
          isSfSmartStore = true;
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
        var conn = jsforce.connection({
          instanceUrl: instanceUrl,
          accessToken: accessToken
        });

        var query = 'SELECT Id, Name, Email, MobilePhone from Contact';

        conn.queryPromise(query).then(function(data) {
          console.log(data.records);
          var contacts = data.records;
          if(contacts.length > 0) {
              sfSmartStore().upsertSoupEntries('contacts', contacts, 
                function(items) {
                  var statusTxt = "upserted: " + items.length + " contacts";
                  console.log(statusTxt);
            
                }, function(err) {
                  console.error('Upsert Error ', err);
                });
          }
        }, function(err) {
          console.error('Connection error: ', err);
        });
      }

      vm.login = function() {

        var accessToken = window.localStorage.getItem('access_token');
        var instanceUrl = window.localStorage.getItem('instance_url');
        if(accessToken && instanceUrl) {
          queryContacts(accessToken, instanceUrl)
        } else {

          $cordovaOauth.salesforce(LOGINURL, CLIENTID)
            .then(function(result) {
              console.log(result);
              window.localStorage.setItem('access_token', result.access_token);
              window.localStorage.setItem('refresh_token', result.refresh_token);
              window.localStorage.setItem('instance_url', result.instance_url);

              queryContacts(result.access_token, result.instance_url);

            }, function(error) {
              console.error(error);
            });
        }
      }

      vm.showSmartStoreInspector = function() {
        sfSmartStore().showInspector();
      };

    }, false);
  }
})();
