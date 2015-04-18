'use strict';

angular.module('octobluApp')
.controller('addChannelApiKeyDummyPassBasicController', function(OCTOBLU_API_URL, $scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
       $scope.newChannel.apiKey, 'XX',
       function(){
        $state.go('material.design');
      });
    });
  };
});
