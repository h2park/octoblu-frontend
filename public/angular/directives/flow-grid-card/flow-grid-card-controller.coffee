class FlowGridCardController
  constructor: ($scope, $state, FlowService, BluprintService, NotifyService) ->
    @scope = $scope
    @state = $state
    @FlowService = FlowService
    @BluprintService = BluprintService
    @NotifyService = NotifyService

  createBluprint: () ->
    { name, flowId } = @scope.flow
    @BluprintService
      .createBluprint
        name: name
        flowId: flowId
      .then (template) =>
        @state.go 'material.bluprintEdit', bluprintId: template.uuid, createMode: true

  deleteFlow: () =>
    { name, flowId } = @scope.flow

    @NotifyService
      .confirm
        title: 'Delete Flow'
        content: 'Are you sure you want to delete ' + name + '?'
      .then =>
        @FlowService.deleteFlow(flowId).then => @state.go 'material.dashboard', {}, {reload: true}

angular.module('octobluApp').controller 'FlowGridCardController', FlowGridCardController
