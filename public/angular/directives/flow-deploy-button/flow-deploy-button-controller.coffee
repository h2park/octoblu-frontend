class FlowDeployButtonController
  constructor: ($scope, FlowService, ThingService, MESHBLU_HOST, MESHBLU_PORT, $cookies) ->
    @scope = $scope
    @FlowService = FlowService
    @ThingService = ThingService
    @cookies = $cookies
    @MESHBLU_HOST = MESHBLU_HOST
    @MESHBLU_PORT = MESHBLU_PORT

    @start = _.throttle @immediateStart, 5000, leading: true, trailing: false
    @stop = _.throttle @immediateStop, 5000, leading: true, trailing: false

  immediateStart : (e) =>
    e?.preventDefault()
    lastDeployedHash = _.clone @scope.flow.hash
    _.each @scope.flow.nodes, (node) =>
      delete node.errorMessage

    @ThingService.updateDevice uuid: @scope.flow.flowId, deploying: true, stopping: false
      .then =>
        @FlowService.saveActiveFlow()
      .then =>
        @FlowService.immediateNotifyFlowSaved()
        @FlowService.start @scope.flow

  immediateStop: (e) =>
    e?.preventDefault()
    @ThingService.updateDevice uuid: @scope.flow.flowId, deploying: false, stopping: true
      .then =>
        @FlowService.stop @scope.flow

angular.module('octobluApp').controller 'FlowDeployButtonController', FlowDeployButtonController
