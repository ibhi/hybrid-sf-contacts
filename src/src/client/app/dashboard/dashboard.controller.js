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
        var promises = [getMessageCount(), getPeople()];
        return $q.all(promises).then(function() {
          logger.info('Activated Dashboard View');
        });
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

      vm.login = function() {
        $cordovaOauth.salesforce(LOGINURL, CLIENTID)
          .then(function(result) {
            console.log(result);
            window.localStorage.setItem('access_token', result.access_token);
            window.localStorage.setItem('refresh_token', result.refresh_token);
            window.localStorage.setItem('instance_url', result.instance_url);

            var conn = jsforce.connection({
              instanceUrl: result.instance_url,
              accessToken: result.access_token
            });

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
            
            var sfSmartStore = navigator.smartstore;
            var isSfSmartStore = false;
            sfSmartStore.registerSoup('contacts', indexSpecs, successCallback, errorCallback)

            var successCallback = function(soupName) {
              isSfSmartStore = true;
              console.log("Soup " + soupName + " was successfully created"); 
            };
            var errorCallback = function(err) { console.log("registerSoup failed with error:" + err); };

            var query = 'SELECT Id, Name, Email, MobilePhone, Account from Contact';

            conn.queryPromise(query).then(function(data) {
              console.log(data.records);
              var contacts = data.records;
              if(contacts.lenght > 0) {
                if(isSfSmartStore) {
                  sfSmartStore.upsertSoupEntries('contacts', contacts, 
                    function(items) {
                      var statusTxt = "upserted: " + items.length + " contacts";
                      console.log(statusTxt);
                
                    }, function(err) {
                      console.error('Upsert Error ', err);
                    });
                }
              }
              
            }, function(err) {
              console.error(err);
            });

          }, function(error) {
            console.error(error);
          });
      }
    }, false);
  }
})();
