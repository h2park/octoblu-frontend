'use strict';

angular.module('octobluApp')
.controller('BluprintsController', function ($mdDialog, $mdToast, $scope, $state, $stateParams, BluprintService, UrlService, OCTOBLU_ICON_URL) {
  var luckyRobotNumber = Math.round(1 + (Math.random() * 9));
  $scope.OCTOBLU_ICON_URL = OCTOBLU_ICON_URL;
  $scope.isLoading = true;
  $scope.refreshBluprints = function(){
    BluprintService.getAllBluprints().then(function(bluprints) {      
      $scope.bluprints = bluprints;
      $scope.isLoading = false;
    });
  };

  $scope.confirmdeleteBluprint = function(id){
    var confirm = $mdDialog.confirm()
      .content("Are you sure you want to delete this bluprint?")
      .ok("Delete")
      .cancel("Cancel");
    $mdDialog.show(confirm).then(function(){
      BluprintService.deleteBluprint(id).then(function(){
        $scope.refreshBluprints();
      });
    });
  };

  $scope.importBluprint = function(bluprintUuid) {
    $state.go('material.flow-import', {flowTemplateId: bluprintUuid});
  }

  $scope.togglePublic = function(bluprint) {
    return bluprint.public = !bluprint.public;
  }

  $scope.setcurrentBluprint = function(bluprint) {
    $scope.currentBluprint = bluprint;
  };

  $scope.toastBluprintUrl = function(url) {
    var message = 'Copied ' + url + ' to clipboard';
    $mdToast.show($mdToast.simple({position: 'top right'}).content(message));
  };

  $scope.dialogBluprintUrl = function(url) {
    var alert = $mdDialog.alert().content(url).title('Share this bluprint').ok('OKAY');
    $mdDialog.show(alert).finally(function(){
      alert = undefined;
    });
  };

  var immediateUpdateBluprint = function(newBluprint, oldBluprint){
    if (!newBluprint || !oldBluprint) {
      return;
    }

    BluprintService.update(newBluprint.uuid, newBluprint);
  };

  $scope.randomRobot = function(){
    return "/assets/images/robots/robot"+luckyRobotNumber+".png"
  };

  var updateBluprint = _.debounce(immediateUpdateBluprint, 500);

  $scope.$watch('currentBluprint', updateBluprint, true);

  $scope.refreshBluprints();
});