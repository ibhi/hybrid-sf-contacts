(function() {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize',
      'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.constants',
      'ui.router', 'ngplus',
      'ngCordova'
    ]);
})();
