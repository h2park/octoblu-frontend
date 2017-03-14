angular.module('octobluApp')
.controller('DevicePickerController', function(OCTOBLU_API_URL, $scope) {
  'use strict';

  $scope.$watch('model.uuid', function(){

    if(!$scope.model) {
      return;
    }

    var device = _.find($scope.devices, {uuid: $scope.model.uuid});

    if(device){
      $scope.model.token = device.token;
    }
  });
});
