(function() {
  'use strict';

  angular
    .module('blocks.models')
    .service('models', modelsFactory);

  modelsFactory.$inject = ['$q'];

  function modelsFactory($q) {
    var app = {};
    var models = {};
    
    models.init = function() {
        var indexSpecs = [
          {
            path: "FirstName",
            type: "full_text"
          },
          {
            path: "LastName",
            type: "full_text"
          },
          {
            path: "Email",
            type: "full_text"
          },
          {
            path: "MobilePhone",
            type: "full_text"
          }
        ];

        // navigator.smartstore.registerSoup('contacts', indexSpecs, successCallback, errorCallback);
        app.cache = new Force.StoreCache("contacts", indexSpecs);
        app.cacheForOriginals = new Force.StoreCache("original-contacts", indexSpecs);
        console.log('App.cache ', app.cache, app.cacheForOriginals);

        // contactsCache.init();
        
        $q.when(app.cache.init()).then(function() {
            console.log('Contacts StoreCache success');
        });

        $q.when(app.cacheForOriginals.init()).then(function() {
            console.log('contacts-original StoreCache success');
        });
    }

    

    // $q.all(app.cache.init(), app.cacheForOriginals.init()).then(function() {
    //     console.log('StoreCache success');
    //     // initModel();

    //     
    // }, function() {
    //     console.error('StoreCache error');
    // });

      // sfSmartStore = function () {
      //   return cordova.require('com.salesforce.plugin.smartstore');
      // };
    

    

    // Online/Offline Tracker
    models.OfflineTracker = Backbone.Model.extend({
        initialize: function() {
            var that = this;
            this.set("isOnline", navigator.onLine);
            document.addEventListener("offline", function() {
                console.log("Received OFFLINE event");
                that.set("isOnline", false);
            }, false);
            document.addEventListener("online", function() {
                console.log("Received ONLINE event");
                // User decides when to go back online
            }, false);
        }
    });

    app.offlineTracker = new models.OfflineTracker({isOnline: true});

    models.Contact = Force.SObject.extend({
        sobjectType: "Contact",
        fieldlist: function(method) { 
            return method == "read" 
                ? ["Id", "FirstName", "LastName", "Email", "MobilePhone", "LastModifiedBy.Name", "LastModifiedDate"]
                : ["Id", "FirstName", "LastName", "Email", "MobilePhone"];
        },
        cache: function() { return app.cache;},
        cacheForOriginals: function() { return app.cacheForOriginals;},
        cacheMode: function(method) {
            if (!app.offlineTracker.get("isOnline")) {
                return Force.CACHE_MODE.CACHE_ONLY;
            }
            else {
                return (method == "read" ? Force.CACHE_MODE.CACHE_FIRST : Force.CACHE_MODE.SERVER_FIRST);
            }
        }
    });

    // The AccountCollection Model
    models.ContactCollection = Force.SObjectCollection.extend({
        model: models.Contact,
        fieldlist: ["Id", "FirstName", "LastName", "Email", "MobilePhone", "LastModifiedBy.Name", "LastModifiedDate"],
        cache: function() { return app.cache},
        cacheForOriginals: function() { return app.cacheForOriginals;},

        getCriteria: function() {
            return this.key;
        },

        setCriteria: function(key) {
            this.key = key;
        },

        config: function() {
            // Offline: do a cache query
            if (!app.offlineTracker.get("isOnline")) {
                // Not using like query because it does a case-sensitive sort
                return {type:"cache", cacheQuery:{queryType:"smart", smartSql:"SELECT {contacts:_soup} FROM {contacts} WHERE {contacts:LastName} LIKE '" + (this.key == null ? "" : this.key) + "%' ORDER BY LOWER({contacts:LastName})", pageSize:25}};
            }
            // Online
            else {
                // First time: do a MRU query
                if (this.key == null) {
                    return {type:"mru", sobjectType:"Account", fieldlist: this.fieldlist, orderBy:"LastModifiedDate", orderDirection:"DESC"};
                }
                // Other times: do a SOQL query
                else {
                    return {type:"soql", query:"SELECT " + this.fieldlist.join(",") + " FROM Contact WHERE LastName like '" + this.key + "%' ORDER BY LastName LIMIT 25"};
                }
            }
        }
    });

    //TODO: Remove the below line. this for debug purpose only
    window.models = models;

    return models;
  }


})();
