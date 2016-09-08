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
