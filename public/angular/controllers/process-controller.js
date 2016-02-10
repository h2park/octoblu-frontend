'use strict';

angular.module('octobluApp')
.controller('ProcessController', function ($scope, $interval, ProcessNodeService, FlowService) {

  $scope.sortProcesses = 'name';
  $scope.sortAscending = true;
  $scope.totalMessagesReceivedOverTime = [];
  $scope.totalMessagesSentOverTime = [];

  $scope.loadingNodes = true;

  ProcessNodeService.getProcessNodes().then(function(processNodes){
    $scope.loadingNodes = false;
    $scope.processNodes = processNodes;
  });

  $scope.startProcess = function(node){
    if(node.type === 'octoblu:flow'){
      FlowService.start({ flowId : node.uuid })
      return;
    }
    ProcessNodeService.startProcess(node);
  };

  $scope.stopProcess = function(node){
    if(node.type === 'octoblu:flow'){
      FlowService.stop({ flowId : node.uuid })
      return;
    }
    ProcessNodeService.stopProcess(node);
  };

  $scope.getUptime = function(online, onlineSince){
    if(!online || !onlineSince){
      return null;
    }
    return moment(onlineSince).fromNow(true);
  };

  $scope.setSortProcess = function(sort){
    if ($scope.sortProcesses === sort) {
      $scope.sortAscending = !$scope.sortAscending;
      return;
    }
    $scope.sortProcesses = sort;
    $scope.sortAscending = true;

  };

  $scope.resetMessageCounter = function(){
    var totalMessagesReceived = 0;
    var totalMessagesSent = 0;


    _.each($scope.processNodes, function(processNode){

      processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime || [];
      processNode.messagesReceivedOverTime.push(processNode.messagesReceived);
      processNode.messagesSentOverTime = processNode.messagesSentOverTime || [];
      if (processNode.messagesSentOverTime.length > 9) {
        processNode.messagesSentOverTime = processNode.messagesSentOverTime.slice(1);
      }
      if (processNode.messagesReceivedOverTime.length > 9) {
        processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime.slice(1);
      }
      processNode.messagesSentOverTime.push(processNode.messagesSent);
      processNode.totalMessagesReceived = processNode.totalMessagesReceived || 0;
      processNode.totalMessagesReceived += processNode.messagesReceived;
      processNode.totalMessagesSent = processNode.totalMessagesSent || 0;
      processNode.totalMessagesSent += processNode.messagesSent;
      totalMessagesReceived += processNode.messagesReceived;
      totalMessagesSent += processNode.messagesSent;
      processNode.messagesReceived = 0;
      processNode.messagesSent = 0;
    });

    $scope.totalMessagesReceivedOverTime.push(totalMessagesReceived);
    $scope.totalMessagesSentOverTime.push(totalMessagesSent);
  };

  $interval($scope.resetMessageCounter, 1000);

});
