(function() {
  'use strict';

  angular.module('app.dashboard')
  	.config(dashboardConfig);

  dashboardConfig.$inject = ['cacheProvider'];

  function dashboardConfig(cacheProvider) {
  	var config = {
      dbName: 'dashboard',
      dbLocation:'default'
    };
  	cacheProvider.config(config);
  }

})();
