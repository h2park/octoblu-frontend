angular.module('octobluApp')
.controller('addChannelApiKeyController', function(OCTOBLU_API_URL, $scope, $state, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveApiKey(nodeType.channelid, $scope.newChannel.apikey, function(){
        $state.go('material.configure', {added: nodeType.name});
      });
    });
  };
});
