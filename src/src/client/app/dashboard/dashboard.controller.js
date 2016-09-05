(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$q', 'dataservice', 'logger', '$cordovaOauth', 'LOGINURL', 'CLIENTID', 'auth', '$scope', 'models', 'viewModel'];
  /* @ngInject */
  function DashboardController($q, dataservice, logger, $cordovaOauth, LOGINURL, CLIENTID, auth, $scope, models, viewModel) {
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
        auth.login().then(function() {
          console.log('Auth successfull');
          // forcetkClient = client;
          // initSmartStore();
          models.init();
          initViewModel();
        }, function(error) {
          console.error('Auth error', error)
        });
        
        
      }

      var sfSmartStore;
      sfSmartStore = function () {
        return cordova.require('com.salesforce.plugin.smartstore');
      };
      var contactsCache;

      function initViewModel() {
        var contactCollectionViewModel = viewModel;
        contactCollectionViewModel.initialize({model: new models.ContactCollection()});
        contactCollectionViewModel.search();
        window.viewModel = viewModel;

      }

      // var app = {
      //   models: {}
      // };

      // function initSmartStore() {
        
      //     var indexSpecs = [
      //       {
      //         path: "FirstName",
      //         type: "full_text"
      //       },
      //       {
      //         path: "LastName",
      //         type: "full_text"
      //       },
      //       {
      //         path: "Email",
      //         type: "full_text"
      //       }
      //     ];

      //     // navigator.smartstore.registerSoup('contacts', indexSpecs, successCallback, errorCallback);
      //     app.cache = new Force.StoreCache("contacts", indexSpecs);

      //     app.cacheForOriginals = new Force.StoreCache("original-contacts", indexSpecs);

      //     // contactsCache.init();

      //     $q.all(app.cache.init(), app.cacheForOriginals.init()).then(function() {
      //       console.log('StoreCache success');
      //       initModel();
      //       //Move this inside the success call
      //       app.offlineTracker = new app.models.OfflineTracker({isOnline: true});
      //     }, function() {
      //       console.error('StoreCache error');
      //     });

      //   sfSmartStore = function () {
      //     return cordova.require('com.salesforce.plugin.smartstore');
      //   };
      // }

      // function initModel() {
      //   // -------------------------------------------------- The Models --------------------------------------------------- //
      //   // The Account Model
      //   app.models.Contact = Force.SObject.extend({
      //       sobjectType: "Contact",
      //       fieldlist: function(method) { 
      //           return method == "read" 
      //               ? ["Id", "FirstName", "LastName", "Email", "MobilePhone", "LastModifiedBy.Name", "LastModifiedDate"]
      //               : ["Id", "FirstName", "LastName", "Email", "MobilePhone"];
      //       },
      //       cache: function() { return app.cache;},
      //       cacheForOriginals: function() { return app.cacheForOriginals;},
      //       cacheMode: function(method) {
      //           if (!app.offlineTracker.get("isOnline")) {
      //               return Force.CACHE_MODE.CACHE_ONLY;
      //           }
      //           else {
      //               return (method == "read" ? Force.CACHE_MODE.CACHE_FIRST : Force.CACHE_MODE.SERVER_FIRST);
      //           }
      //       }
      //   });

      //   // The AccountCollection Model
      //   app.models.ContactCollection = Force.SObjectCollection.extend({
      //       model: app.models.Contact,
      //       fieldlist: ["Id", "FirstName", "LastName", "Email", "MobilePhone", "LastModifiedBy.Name", "LastModifiedDate"],
      //       cache: function() { return app.cache},
      //       cacheForOriginals: function() { return app.cacheForOriginals;},

      //       getCriteria: function() {
      //           return this.key;
      //       },

      //       setCriteria: function(key) {
      //           this.key = key;
      //       },

      //       config: function() {
      //           // Offline: do a cache query
      //           if (!app.offlineTracker.get("isOnline")) {
      //               // Not using like query because it does a case-sensitive sort
      //               return {type:"cache", cacheQuery:{queryType:"smart", smartSql:"SELECT {contacts:_soup} FROM {contacts} WHERE {contacts:LastName} LIKE '" + (this.key == null ? "" : this.key) + "%' ORDER BY LOWER({contacts:LastName})", pageSize:25}};
      //           }
      //           // Online
      //           else {
      //               // First time: do a MRU query
      //               if (this.key == null) {
      //                   return {type:"mru", sobjectType:"Account", fieldlist: this.fieldlist, orderBy:"LastModifiedDate", orderDirection:"DESC"};
      //               }
      //               // Other times: do a SOQL query
      //               else {
      //                   return {type:"soql", query:"SELECT " + this.fieldlist.join(",") + " FROM Contact WHERE LastName like '" + this.key + "%' ORDER BY LastName LIMIT 25"};
      //               }
      //           }
      //       }
      //   });

      //   // Online/Offline Tracker
      //   app.models.OfflineTracker = Backbone.Model.extend({
      //       initialize: function() {
      //           var that = this;
      //           this.set("isOnline", navigator.onLine);
      //           document.addEventListener("offline", function() {
      //               console.log("Received OFFLINE event");
      //               that.set("isOnline", false);
      //           }, false);
      //           document.addEventListener("online", function() {
      //               console.log("Received ONLINE event");
      //               // User decides when to go back online
      //           }, false);
      //       }
      //   });

      //   // Collection behind search screen
      //   app.searchResults = new app.models.ContactCollection();

      //   // Collection behind sync screen
      //   app.localContacts = new app.models.ContactCollection();
      //   app.localContacts.config = {type:"cache", cacheQuery: {queryType:"exact", indexPath:"__local__", matchKey:true, order:"ascending", pageSize:25}};
      //   window.app = {
      //     models: {}
      //   };
      //   window.app.models.ContactCollection = app.models.ContactCollection;

      //   window.app.models.Contact = app.models.Contact;

      //   ///////////////////////////////////////////////////////////////////////////////////////////////////
      //   var View = function(modelObj) {
      //     this.model = modelObj.model;
      //   }

      //   View.prototype = {

      //     initialize: function() {
      //         var that = this;
      //         this.fieldlist = app.models.Contact.prototype.fieldlist('read');
      //         this.fieldlistForSyncUp = _.without(app.models.Contact.prototype.fieldlist('read'), "Id", "LastModifiedDate");
      //         // this.listView = new app.views.ContactListView({model: this.model});
      //         document.addEventListener("sync", function() { 
      //             that.handleSyncUpdate(event.detail);
      //         });
      //     },

      //     // render: function(eventName) {
      //     //     $(this.el).html(this.template());
      //     //     $(".search-key", this.el).val(this.model.getCriteria());
      //     //     this.listView.setElement($("ul", this.el)).render();
      //     //     return this;
      //     // },

      //     // syncUp followed by syncDown followed by search
      //     handleSyncUpdate: function(sync) {
      //         if (sync.status !== "DONE") {
      //             // $(".sync").html("Sync - " + sync.type + " " + Math.round(sync.progress) + "%");

      //             if (sync.type === "syncDown") {
      //                 this.lastSyncDownId = sync._soupEntryId;
      //             }
      //         }
      //         else {
      //             // $(".sync").html("Sync");

      //             if (sync.type === "syncDown") {
      //                 this.syncInFlight = false;
      //                 // $(".sync").disabled = false;
      //                 this.search();
      //             }
      //             if (sync.type === "syncUp") {
      //                 this.syncDown();
      //             }
      //         }
      //     },

      //     syncDown: function() {
      //         if (!_.isNumber(this.lastSyncDownId)) {
      //             // First time
      //             var target = {type:"soql", query:"SELECT " + this.fieldlist.join(",") + " FROM Contact  LIMIT 10000"};
      //             cordova.require("com.salesforce.plugin.smartsync").syncDown(target, "contacts", {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}, this.handleSyncUpdate.bind(this));
      //         }
      //         else {
      //             // Subsequent times
      //             cordova.require("com.salesforce.plugin.smartsync").reSync(this.lastSyncDownId, this.handleSyncUpdate.bind(this));
      //         }
      //     },

      //     syncUp: function() {
      //         cordova.require("com.salesforce.plugin.smartsync").syncUp("contacts", {fieldlist: this.fieldlistForSyncUp}, this.handleSyncUpdate.bind(this));
      //     },

      //     sync: function() {
      //         if (!this.syncInFlight) {
      //             this.syncInFlight = true;
      //             // $(".sync").disabled = true;
      //             this.syncUp();
      //         }
      //     },
      //     search: function(event) {
      //         this.model.setCriteria('');
      //         this.model.fetch();
      //     }
      //   }

      //   window.view = new View({model: new app.models.ContactCollection() });

      //   window.view.initialize();

      //   //////////////////////////////////////////////////////////
      // }

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
        // sfSmartStore()
        //   .upsertSoupEntries('contacts', [contact], successCallback, failureCallback);

        contactsCache.save(contact, "OVERWRITE");

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
        sfSmartStore().removeSoup('syncs_soup',onSuccessRemoveSoup, onErrorRemoveSoup);
        sfSmartStore().removeSoup('original-contacts',onSuccessRemoveSoup, onErrorRemoveSoup);

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
