'use strict';

angular.module('octobluApp')
.controller('addChannelWitaiController', function(OCTOBLU_API_URL, $scope, $state, $http, nodeType, userService, channelService, AuthService) {
  var channelPromise;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    var profile = { accessToken: $scope.newChannel.accessToken};
    channelPromise.then(function(channel){
      $http.post(OCTOBLU_API_URL + '/api/witai/auth', profile).then(function(){
        $state.go('material.configure', {added: nodeType.name});
      })
    })
  };
});
