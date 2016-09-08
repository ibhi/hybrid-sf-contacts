/**
 * sfContacts - sfContacts Project Generated from HotTowel Angular
 * @authors 
 * @version v0.0.0
 * @link 
 * @license 
 */
(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.widgets',
    'app.admin',
    'app.dashboard',
    'app.layout'
  ]);

})();

(function() {
  'use strict';

  angular.module('app.admin', [
    'app.core',
    'app.widgets'
  ]);

})();

(function() {
  'use strict';

  angular.module('blocks.auth', []);
  
})();
(function() {
  'use strict';

  angular.module('blocks.constants', []);
})();
(function() {
  'use strict';

  angular.module('blocks.exception', ['blocks.logger']);
})();

(function() {
  'use strict';

  angular.module('blocks.jsforce', []);
  
})();
(function() {
  'use strict';

  angular.module('blocks.logger', []);
})();

(function() {
  'use strict';

  angular.module('blocks.models', []);
  
})();
(function() {
  'use strict';

  angular.module('blocks.router', [
    'ui.router',
    'blocks.logger'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.viewModel', []);
  
})();
(function() {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize',
      'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.constants',
      'blocks.jsforce', 'blocks.auth','blocks.models','blocks.viewModel', 'blocks.cache',
      'ui.router', 'ngplus',
      'ngCordova'
    ]);
})();

(function() {
  'use strict';

  angular.module('app.dashboard', [
    'app.core',
    'app.widgets',
    'ngCordovaOauth'
  ]);
})();

(function() {
  'use strict';

  angular.module('app.layout', ['app.core', 'ui.bootstrap.collapse']);
})();

(function() {
  'use strict';

  angular.module('app.widgets', []);
})();

(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('AdminController', AdminController);

  AdminController.$inject = ['logger'];
  /* @ngInject */
  function AdminController(logger) {
    var vm = this;
    vm.title = 'Admin';

    activate();

    function activate() {
      logger.info('Activated Admin View');
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.admin')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'admin',
        config: {
          url: '/admin',
          templateUrl: 'app/admin/admin.html',
          controller: 'AdminController',
          controllerAs: 'vm',
          title: 'Admin',
          settings: {
            nav: 2,
            content: '<i class="fa fa-lock"></i> Admin'
          }
        }
      }
    ];
  }
})();

(function() {
  'use strict';

  angular
    .module('blocks.auth')
    .factory('auth', authFactory);

  authFactory.$inject = ['$window', '$q'];

  function authFactory($window, $q) {

    var forcetkClient;
    var apiVersion = "v36.0";
    var auth = {
      login: login,
    };
    // login();
    function login() {
      return $q(function(resolve, reject) {
        // Container
        if ($window.cordova && !cordova.interceptExec) {
          document.addEventListener("deviceready", function() {
            console.log("onDeviceReady: cordova ready");

            //Call getAuthCredentials to get the initial session credentials
            cordova.require("com.salesforce.plugin.oauth")
                .getAuthCredentials(salesforceSessionRefreshed, failureAuth);

            function salesforceSessionRefreshed(creds) {
                console.log('Auth successfull ', creds);
                // var credsData = creds;
                // if (creds.data)  // Event sets the `data` object with the auth data.
                //     credsData = creds.data;
                // forcetkClient = new forcetk.Client(credsData.clientId, credsData.loginUrl, null,cordova.require("com.salesforce.plugin.oauth").forcetkRefresh);
                // forcetkClient.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl);
                // forcetkClient.setRefreshToken(credsData.refreshToken);
                // forcetkClient.setUserAgentString(credsData.userAgent);
                Force.init(_.extend(creds, {userAgent: navigator.userAgent}), null, null, cordova.require("com.salesforce.plugin.oauth").forcetkRefresh);
                resolve();
            }

            function failureAuth(error) {
                console.log("Auth failed: " + error);
                reject(error);
            }

            // document.addEventListener("salesforceSessionRefresh",salesforceSessionRefreshed,false);

          });
        }
        // Browser
        else {
          var loginUrl = "https://login.salesforce.com/";
          var consumerKey = "3MVG98dostKihXN53TYStBIiS8HkwJJ.hsRQPcdchz8X9k16IRCU4KpvmoRuPRgAsWhy2cwXyX0JUr21qQ.mX";
          var callbackUrl = "https://sfdc-sobject-editor.herokuapp.com/oauth/success";

          // Instantiating forcetk ClientUI
          var oauthClient = new ForceOAuth(loginUrl, consumerKey, callbackUrl,
            function forceOAuthUI_successHandler(forcetkClient) { // successCallback
                console.log('OAuth success!');
                creds = {
                    accessToken: oauthClient.oauthResponse.access_token,
                    instanceUrl: oauthClient.oauthResponse.instance_url
                };
                // appStart(creds);
            },
            function forceOAuthUI_errorHandler(error) { // errorCallback
                console.log('OAuth error!');
                if (confirm("Authentication Failed. Try again?")) oauthClient.login();
            });

          oauthClient.login();
        }
        
      });
    }

    return auth;
  }

})();

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

(function() {
  'use strict';

  angular.module('blocks.cache', []);
  
})();
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
        Cache.prototype.save = function(fieldNames, fieldValues, tableName) {
            var that = this;
            fieldNames = _.concat(fieldNames, '__locally_updated__');
            fieldValues = _.concat(fieldValues, true);
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

        return new Cache();
    }
  

    }


})();

(function() {
  'use strict';

  angular
  	.module('blocks.constants')
  	.constant('CLIENTID', '3MVG9ZL0ppGP5UrB9yKKJFrcw9oLs3cE8WGYH48tygt32vxANS2FoD8c6qGpHAxVv0aEWJDVgrMeU5w8vSkik');
})();
(function() {
  'use strict';

  angular
  	.module('blocks.constants')
  	.constant('LOGINURL', 'https://login.salesforce.com/');
})();
// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .provider('exceptionHandler', exceptionHandlerProvider)
    .config(config);

  /**
   * Must configure the exception handling
   */
  function exceptionHandlerProvider() {
    /* jshint validthis:true */
    this.config = {
      appErrorPrefix: undefined
    };

    this.configure = function(appErrorPrefix) {
      this.config.appErrorPrefix = appErrorPrefix;
    };

    this.$get = function() {
      return { config: this.config };
    };
  }

  config.$inject = ['$provide'];

  /**
   * Configure by setting an optional string value for appErrorPrefix.
   * Accessible via config.appErrorPrefix (via config value).
   * @param  {Object} $provide
   */
  /* @ngInject */
  function config($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];

  /**
   * Extend the $exceptionHandler service to also display a toast.
   * @param  {Object} $delegate
   * @param  {Object} exceptionHandler
   * @param  {Object} logger
   * @return {Function} the decorated $exceptionHandler service
   */
  function extendExceptionHandler($delegate, exceptionHandler, logger) {
    return function(exception, cause) {
      var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
      var errorData = { exception: exception, cause: cause };
      exception.message = appErrorPrefix + exception.message;
      $delegate(exception, cause);
      /**
       * Could add the error to a service's collection,
       * add errors to $rootScope, log errors to remote web server,
       * or log locally. Or throw hard. It is entirely up to you.
       * throw exception;
       *
       * @example
       *     throw { message: 'error message we added' };
       */
      logger.error(exception.message, errorData);
    };
  }
})();

(function() {
  'use strict';

  exception.$inject = ["$q", "logger"];
  angular
    .module('blocks.exception')
    .factory('exception', exception);

  /* @ngInject */
  function exception($q, logger) {
    var service = {
      catcher: catcher
    };
    return service;

    function catcher(message) {
      return function(e) {
        var thrownDescription;
        var newMessage;
        if (e.data && e.data.description) {
          thrownDescription = '\n' + e.data.description;
          newMessage = message + thrownDescription;
        }
        e.data.description = newMessage;
        logger.error(newMessage);
        return $q.reject(e);
      };
    }
  }
})();

(function() {
  'use strict';

  angular
  	.module('blocks.jsforce')
  	.factory('jsforce', jsforceFactory);

  jsforceFactory.$inject = ['$window', '$q'];

  function jsforceFactory($window, $q) {
  	var jsforce = $window.jsforce || {};
  	return {
  		// config: {
  		// 	instanceUrl: string,
  		// 	accessToken: string	
  		// }
  		connection: function(config) {
  			var conn = new jsforce.Connection(config);

  			conn.queryPromise = function(query) {
					return $q(function(resolve, reject) {
						conn.query(query, function(error, result) {
							if(error) {
								reject(error);
							} else {
								resolve(result);
							}
						});
					});
				}
  			return conn;
  		}
  	};
  }
  
})();
(function() {
  'use strict';

  angular
    .module('blocks.logger')
    .factory('logger', logger);

  logger.$inject = ['$log', 'toastr'];

  /* @ngInject */
  function logger($log, toastr) {
    var service = {
      showToasts: true,

      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data, title) {
      toastr.error(message, title);
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      toastr.info(message, title);
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      toastr.success(message, title);
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      toastr.warning(message, title);
      $log.warn('Warning: ' + message, data);
    }
  }
} ());

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

/* Help configure the state-base ui.router */
(function() {
  'use strict';

  angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
  /* @ngInject */
  function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
    /* jshint validthis:true */
    var config = {
      docTitle: undefined,
      resolveAlways: {}
    };

    // if (!(window.history && window.history.pushState)) {
    //   window.location.hash = '/';
    // }

    $locationProvider.html5Mode(false);

    this.configure = function(cfg) {
      angular.extend(config, cfg);
    };

    this.$get = RouterHelper;
    RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger'];
    /* @ngInject */
    function RouterHelper($location, $rootScope, $state, logger) {
      var handlingStateChangeError = false;
      var hasOtherwise = false;
      var stateCounts = {
        errors: 0,
        changes: 0
      };

      var service = {
        configureStates: configureStates,
        getStates: getStates,
        stateCounts: stateCounts
      };

      init();

      return service;

      ///////////////

      function configureStates(states, otherwisePath) {
        states.forEach(function(state) {
          state.config.resolve =
            angular.extend(state.config.resolve || {}, config.resolveAlways);
          $stateProvider.state(state.state, state.config);
        });
        if (otherwisePath && !hasOtherwise) {
          hasOtherwise = true;
          $urlRouterProvider.otherwise(otherwisePath);
        }
      }

      function handleRoutingErrors() {
        // Route cancellation:
        // On routing error, go to the dashboard.
        // Provide an exit clause if it tries to do it twice.
        $rootScope.$on('$stateChangeError',
          function(event, toState, toParams, fromState, fromParams, error) {
            if (handlingStateChangeError) {
              return;
            }
            stateCounts.errors++;
            handlingStateChangeError = true;
            var destination = (toState &&
              (toState.title || toState.name || toState.loadedTemplateUrl)) ||
              'unknown target';
            var msg = 'Error routing to ' + destination + '. ' +
              (error.data || '') + '. <br/>' + (error.statusText || '') +
              ': ' + (error.status || '');
            logger.warning(msg, [toState]);
            $location.path('/');
          }
        );
      }

      function init() {
        handleRoutingErrors();
        updateDocTitle();
      }

      function getStates() { return $state.get(); }

      function updateDocTitle() {
        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState, fromParams) {
            stateCounts.changes++;
            handlingStateChangeError = false;
            var title = config.docTitle + ' ' + (toState.title || '');
            $rootScope.title = title; // data bind to <title>
          }
        );
      }
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('blocks.viewModel')
    .service('viewModel', ViewModelService);

  ViewModelService.$inject = ['models'];

  function ViewModelService(models) {
    this.models = models;
  }
  
  ViewModelService.prototype = {

    initialize: function(modelObj) {
        var that = this;
        this.model = modelObj.model;
        this.fieldlist = this.models.Contact.prototype.fieldlist('read');
        this.fieldlistForSyncUp = _.without(this.models.Contact.prototype.fieldlist('read'), "Id", "LastModifiedDate");


        // var setupProps = function(props) {
        //     props.forEach(function(prop) {
        //         Object.defineProperty(that, prop, {
        //             get: function() {
        //                 return that.model.get(prop);
        //             },
        //             set: function(val) {
        //                 that.model.set(prop, val);
        //             },
        //             enumerable: true
        //         });
        //     });
        // }
        // setupProps(_.union(_.keys(that.model.attributes), that.model.fieldlist));
        // // Setup an event listener to update properties whenever model attributes change
        // this.model.on('change', function() {
        //     setupProps(_.difference(_.keys(that.model.attributes), _.keys(that)));
        // });

        
        document.addEventListener("sync", function() { 
            that.handleSyncUpdate(event.detail);
        });
    },

    
    // syncUp followed by syncDown followed by search
    handleSyncUpdate: function(sync) {
        if (sync.status !== "DONE") {
            // $(".sync").html("Sync - " + sync.type + " " + Math.round(sync.progress) + "%");

            if (sync.type === "syncDown") {
                this.lastSyncDownId = sync._soupEntryId;
            }
        }
        else {
            // $(".sync").html("Sync");

            if (sync.type === "syncDown") {
                this.syncInFlight = false;
                // $(".sync").disabled = false;
                this.search();
            }
            if (sync.type === "syncUp") {
                this.syncDown();
            }
        }
    },

    syncDown: function() {
        if (!_.isNumber(this.lastSyncDownId)) {
            // First time
            var target = {type:"soql", query:"SELECT " + this.fieldlist.join(",") + " FROM Contact  LIMIT 10000"};
            cordova.require("com.salesforce.plugin.smartsync").syncDown(target, "contacts", {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}, this.handleSyncUpdate.bind(this));
        }
        else {
            // Subsequent times
            cordova.require("com.salesforce.plugin.smartsync").reSync(this.lastSyncDownId, this.handleSyncUpdate.bind(this));
        }
    },

    syncUp: function() {
        cordova.require("com.salesforce.plugin.smartsync").syncUp("contacts", {fieldlist: this.fieldlistForSyncUp}, this.handleSyncUpdate.bind(this));
    },

    sync: function() {
        if (!this.syncInFlight) {
            this.syncInFlight = true;
            // $(".sync").disabled = true;
            this.syncUp();
        }
    },
    search: function(event) {
        this.model.setCriteria('');
        this.model.fetch();
    }
  }


})();

(function() {
  'use strict';

  var core = angular.module('app.core');

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  var config = {
    appErrorPrefix: '[sfContacts Error] ',
    appTitle: 'sfContacts'
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
  }

})();

/* global toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('toastr', toastr)
    .constant('moment', moment);
})();

(function() {
  'use strict';

  appRun.$inject = ["routerHelper"];
  angular
    .module('app.core')
    .run(appRun);

  /* @ngInject */
  function appRun(routerHelper) {
    var otherwise = '/';
    routerHelper.configureStates(getStates(), otherwise);
  }

  function getStates() {
    return [
      {
        state: '404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      }
    ];
  }
})();

(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function dataservice($http, $q, exception, logger) {
    var service = {
      getPeople: getPeople,
      getMessageCount: getMessageCount
    };

    return service;

    function getMessageCount() { return $q.when(72); }

    function getPeople() {
      return $http.get('/api/people')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.dashboard')
  	.config(dashboardConfig);

  dashboardConfig.$inject = ['cacheProvider'];

  function dashboardConfig(cacheProvider) {
  	var config = {
      dbName: 'dashboard.db',
      dbLocation:'default'
    };
  	cacheProvider.config(config);
  }

})();

(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$q', 'dataservice', 'logger', '$cordovaOauth', 'LOGINURL', 'CLIENTID', 'auth', '$scope', 'models', 'viewModel', '$timeout', 'cache'];
  /* @ngInject */
  function DashboardController($q, dataservice, logger, $cordovaOauth, LOGINURL, CLIENTID, auth, $scope, models, viewModel, $timeout, cache) {
    var vm = this;
    document.addEventListener("deviceready", function () {
      vm.news = {
        title: 'sfContacts',
        description: 'Hot Towel Angular is a SPA template for Angular developers.'
      };
      vm.messageCount = 0;
      vm.people = [];
      vm.title = 'Dashboard';
      vm.contacts = [];

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
        $timeout(function() {
          $scope.$apply(function() {
            vm.contacts = contactCollectionViewModel.model.models;
            
          });
        }, 2000 /*TODO: Remove the settiemout; Just a temporary hack for debug */);

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

      var tableName = 'contacts';

      vm.createTable = function() {
        var fieldSpec = 'Id text primary key, FirstName text, LastName text, Email text'
        cache.createTable(fieldSpec, tableName).then(function(result) {
          console.log(result);
        }, function(error) {
          console.log(error);
        });

      };

      var testData = {
        Id: 'cde',
        FirstName: 'Ayeesha Siddikka',
        LastName: 'Ibrahim'
      };

      var fieldNames = _.keys(testData);
      var fieldValues = _.values(testData);


      vm.createRecord = function() {
        

        cache.create(fieldNames, fieldValues, tableName).then(function(result) {
          console.log(result);
        }, function(error) {
          console.log(error);
        });

      };

      vm.retrieveAll = function() {
        cache.retrieveAll(tableName).then(function(result) {
          console.log(result.rows.item(0), result.rows.item(1));
        }, function(error) {
          console.log(error);
        });
      }

      vm.retrieve = function() {
        cache.retrieve(fieldNames, 'abc', tableName).then(function(result) {
          console.log(result.rows.item(0), result.rows.item(1));
        }, function(error) {
          console.log(error);
        });
      }

    }, false);
  }
})();

(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'dashboard',
        config: {
          url: '/',
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          title: 'dashboard',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Dashboard'
          }
        }
      }
    ];
  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('htSidebar', htSidebar);

  /* @ngInject */
  function htSidebar() {
    // Opens and closes the sidebar menu.
    // Usage:
    //  <div ht-sidebar">
    //  <div ht-sidebar whenDoneAnimating="vm.sidebarReady()">
    // Creates:
    //  <div ht-sidebar class="sidebar">
    var directive = {
      link: link,
      restrict: 'EA',
      scope: {
        whenDoneAnimating: '&?'
      }
    };
    return directive;

    function link(scope, element, attrs) {
      var $sidebarInner = element.find('.sidebar-inner');
      var $dropdownElement = element.find('.sidebar-dropdown a');
      element.addClass('sidebar');
      $dropdownElement.click(dropdown);

      function dropdown(e) {
        var dropClass = 'dropy';
        e.preventDefault();
        if (!$dropdownElement.hasClass(dropClass)) {
          $sidebarInner.slideDown(350, scope.whenDoneAnimating);
          $dropdownElement.addClass(dropClass);
        } else if ($dropdownElement.hasClass(dropClass)) {
          $dropdownElement.removeClass(dropClass);
          $sidebarInner.slideUp(350, scope.whenDoneAnimating);
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('htTopNav', htTopNav);

  /* @ngInject */
  function htTopNav() {
    var directive = {
      bindToController: true,
      controller: TopNavController,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {
        'navline': '='
      },
      templateUrl: 'app/layout/ht-top-nav.html'
    };

    TopNavController.$inject = ['$scope'];

    /* @ngInject */
    function TopNavController($scope) {
      var vm = this;
      $scope.isCollapsed = true;
    }

    return directive;
  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
  /* @ngInject */
  function ShellController($rootScope, $timeout, config, logger) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    $rootScope.showSplash = true;
    vm.navline = {
      title: config.appTitle,
      text: 'Created by John Papa',
      link: 'http://twitter.com/john_papa'
    };

    activate();

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      hideSplash();
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function() {
        $rootScope.showSplash = false;
      }, 1000);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$state', 'routerHelper'];
  /* @ngInject */
  function SidebarController($state, routerHelper) {
    var vm = this;
    var states = routerHelper.getStates();
    vm.isCurrent = isCurrent;

    activate();

    function activate() { getNavRoutes(); }

    function getNavRoutes() {
      vm.navRoutes = states.filter(function(r) {
        return r.settings && r.settings.nav;
      }).sort(function(r1, r2) {
        return r1.settings.nav - r2.settings.nav;
      });
    }

    function isCurrent(route) {
      if (!route.title || !$state.current || !$state.current.title) {
        return '';
      }
      var menuName = route.title;
      return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('htImgPerson', htImgPerson);

  htImgPerson.$inject = ['config'];
  /* @ngInject */
  function htImgPerson(config) {
    //Usage:
    //<img ht-img-person="{{person.imageSource}}"/>
    var basePath = config.imageBasePath;
    var unknownImage = config.unknownPersonImageSource;
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      attrs.$observe('htImgPerson', function(value) {
        value = basePath + (value || unknownImage);
        attrs.$set('src', value);
      });
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('htWidgetHeader', htWidgetHeader);

  /* @ngInject */
  function htWidgetHeader() {
    //Usage:
    //<div ht-widget-header title="vm.map.title"></div>
    // Creates:
    // <div ht-widget-header=""
    //      title="Movie"
    //      allow-collapse="true" </div>
    var directive = {
      scope: {
        'title': '@',
        'subtitle': '@',
        'rightText': '@',
        'allowCollapse': '@'
      },
      templateUrl: 'app/widgets/widget-header.html',
      restrict: 'EA',
      link: link
    };
    return directive;

    function link(scope, element, attr) {
      scope.toggleContent = function() {
        if (scope.allowCollapse === 'true') {
          var content = angular.element(element).siblings('.widget-content');
          content.toggle();
        }
      };
    }
  }
})();

angular.module("app.core").run(["$templateCache", function($templateCache) {$templateCache.put("app/admin/admin.html","<section class=mainbar><section class=matter><div class=container><div class=row><div class=\"widget wviolet\"><div ht-widget-header title={{vm.title}}></div><div class=\"widget-content user\"><h3>TODO: Implement Your Features</h3></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></section></section>");
$templateCache.put("app/core/404.html","<section id=dashboard-view class=mainbar><section class=matter><div class=container><div class=row><div class=col-md-12><ul class=today-datas><li class=bred><div class=pull-left><i class=\"fa fa-warning\"></i></div><div class=\"datas-text pull-right\"><a><span class=bold>404</span></a>Page Not Found</div><div class=clearfix></div></li></ul></div></div><div class=row><div class=\"widget wblue\"><div ht-widget-header title=\"Page Not Found\" allow-collapse=true></div><div class=\"widget-content text-center text-info\"><div class=container>No soup for you!</div></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></section></section>");
$templateCache.put("app/dashboard/dashboard.html","<section id=dashboard-view class=mainbar><section class=matter><div class=container><div class=row><div class=col-md-12><ul class=today-datas><li class=blightblue><div class=pull-left><i class=\"fa fa-plane\"></i></div><div class=\"datas-text pull-right\"><span class=bold>May 18 - 19, 2015</span> Castle Resort, Neverland</div><div class=clearfix></div></li><li class=borange><div class=pull-left><i class=\"fa fa-envelope\"></i></div><div class=\"datas-text pull-right\"><span class=bold>{{vm.messageCount}}</span> Messages</div><div class=clearfix></div></li></ul></div></div><div class=row><div class=col-md-6><div class=\"widget wviolet\"><div ht-widget-header title=People allow-collapse=true></div><div class=\"widget-content text-center text-info\"><ul><li ng-repeat=\"contact in vm.contacts track by $index\">{{contact.attributes.FirstName}}</li></ul></div><div class=widget-foot><div class=clearfix></div></div></div></div><div class=col-md-6><div class=\"widget wgreen\"><div ht-widget-header title={{vm.news.title}} allow-collapse=true></div><div class=\"widget-content text-center text-info\"><small>{{vm.news.description}}</small> <button ng-click=vm.login()>Login</button> <button ng-click=vm.showSmartStoreInspector()>Show Smart Store Inspector</button> <button ng-click=vm.syncDown()>Sync Down</button> <button ng-click=vm.removeSoup()>Reomve Soup</button> <button ng-click=vm.logout()>Logout</button> <button ng-click=vm.switchUser()>Switch User</button> <button ng-click=vm.insertContact()>Insert Contact</button> <button ng-click=vm.syncUp()>Sync Up</button> <button ng-click=vm.createTable()>Create Table</button> <button ng-click=vm.createRecord()>Create Record</button> <button ng-click=vm.retrieveAll()>Retrieve All Records</button> <button ng-click=vm.retrieve()>Retrieve Record</button></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></div></section></section>");
$templateCache.put("app/layout/ht-top-nav.html","<nav class=\"navbar navbar-fixed-top navbar-inverse\"><div class=navbar-header><a href=\"/\" class=navbar-brand><span class=brand-title>{{vm.navline.title}}</span></a> <a class=\"btn navbar-btn navbar-toggle\" ng-click=\"isCollapsed = !isCollapsed\"><span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></a></div><div class=\"navbar-collapse collapse\" uib-collapse=isCollapsed><div class=\"pull-right navbar-logo\"><ul class=\"nav navbar-nav pull-right\"><li><a ng-href={{vm.navline.link}} target=_blank>{{vm.navline.text}}</a></li><li class=\"dropdown dropdown-big\"><a href=http://www.angularjs.org target=_blank><img src=images/AngularJS-small.png></a></li><li><a href=\"http://www.gulpjs.com/\" target=_blank><img src=images/gulp-tiny.png></a></li></ul></div></div></nav>");
$templateCache.put("app/layout/shell.html","<div ng-controller=\"ShellController as vm\"><header class=clearfix><ht-top-nav navline=vm.navline></ht-top-nav></header><section id=content class=content><div ng-include=\"\'app/layout/sidebar.html\'\"></div><div ui-view class=shuffle-animation></div><div ngplus-overlay ngplus-overlay-delay-in=50 ngplus-overlay-delay-out=700 ngplus-overlay-animation=dissolve-animation><img src=images/busy.gif><div class=\"page-spinner-message overlay-message\">{{vm.busyMessage}}</div></div></section></div>");
$templateCache.put("app/layout/sidebar.html","<div ng-controller=\"SidebarController as vm\"><ht-sidebar when-done-animating=vm.sidebarReady()><div class=sidebar-filler></div><div class=sidebar-dropdown><a href=#>Menu</a></div><div class=sidebar-inner><div class=sidebar-widget></div><ul class=navi><li class=\"nlightblue fade-selection-animation\" ng-class=vm.isCurrent(r) ng-repeat=\"r in vm.navRoutes\"><a ui-sref={{r.name}} ng-bind-html=r.settings.content></a></li></ul></div></ht-sidebar></div>");
$templateCache.put("app/widgets/widget-header.html","<div class=widget-head ng-class=\"{\'collapsive\': allowCollapse === \'true\'}\" ng-click=toggleContent()><div class=\"page-title pull-left\">{{title}}</div><small class=page-title-subtle ng-show=subtitle>({{subtitle}})</small><div class=\"widget-icons pull-right\"></div><small class=\"pull-right page-title-subtle\" ng-show=rightText>{{rightText}}</small><div class=clearfix></div></div>");}]);