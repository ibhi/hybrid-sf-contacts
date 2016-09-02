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