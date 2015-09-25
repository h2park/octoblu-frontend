'use strict';

angular.module('octobluApp')
.controller('addChannelWinkController', function(OCTOBLU_API_URL, $scope, $state, $http, nodeType, userService, channelService, AuthService) {
  var channelPromise;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    var profile = { username: $scope.newChannel.user, password : $scope.newChannel.pass };
    channelPromise.then(function(channel){
      $http.post(OCTOBLU_API_URL + '/api/wink/auth', profile).then(function(){
        $state.go('material.configure', {added: 'Wink'});
      })
    });
  };
});
