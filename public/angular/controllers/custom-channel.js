'use strict';
angular.module('octobluApp')
    .controller('CustomChannelController',function(OCTOBLU_API_URL, $scope, $state, $log, customChannels ) {
        $scope.customChannels = customChannels;
        $scope.updateCustomChannel = function(channel) {
        	$log.info('update...');
        	for(var l = 0; l<$scope.customChannels.length; l++) {
        		if($scope.customChannels[l]._id===channel._id) {
        			$scope.customChannels[l] = channel;
        			return;
        		}
        	}
        	$scope.customChannels.push(channel);
        };
        $scope.removeCustomChannels = function(channel) {
        	$log.info('remove...');
        	for(var l = 0; l<$scope.customChannels.length; l++) {
        		if($scope.customChannels[l]._id===channel._id) {
        			 myArray.splice(l, 1);
        			return;
        		}
        	}
        };
    });
