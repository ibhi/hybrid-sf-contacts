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
                var credsData = creds;
                if (creds.data)  // Event sets the `data` object with the auth data.
                    credsData = creds.data;
                forcetkClient = new forcetk.Client(credsData.clientId, credsData.loginUrl, null,cordova.require("com.salesforce.plugin.oauth").forcetkRefresh);
                forcetkClient.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl);
                forcetkClient.setRefreshToken(credsData.refreshToken);
                forcetkClient.setUserAgentString(credsData.userAgent);
                resolve(forcetkClient);
            }

            function failureAuth(error) {
                console.log("Auth failed: " + error);
                reject(error);
            }

            document.addEventListener("salesforceSessionRefresh",salesforceSessionRefreshed,false);

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
