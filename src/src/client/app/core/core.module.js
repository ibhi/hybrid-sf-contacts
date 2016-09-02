(function() {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize',
      'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.constants',
      'blocks.jsforce',
      'ui.router', 'ngplus',
      'ngCordova'
    ]);
})();
