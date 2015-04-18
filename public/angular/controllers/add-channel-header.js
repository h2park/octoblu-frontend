'use strict';

angular.module('octobluApp')
.controller('addChannelHeaderController', function(OCTOBLU_API_URL, $scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveConnection(user.resource.uuid, nodeType.channelid, $scope.newChannel.apiKey, undefined, {},
        function () {
          $state.go('material.design');
      });
    });
  };
});
