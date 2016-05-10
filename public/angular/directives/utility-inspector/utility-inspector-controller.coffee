class UtilityInspectorController
  constructor: ($scope, FlowNodeTypeService, NodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @scope.things = []
    @scope.collectionViewStyle = 'list'
    @scope.viewSource = false
    @scope.loading = true
    @scope.paneCollapsed = false
    @scope.showCategory = true
    @scope.unreadDebug = false

    @toggleActiveTab 'things'
    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService     = NodeTypeService

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        flows           = _.filter flowNodeTypes, type: 'device:flow'
        flows           = _.filter flows, type: 'octoblu:flow'
        connectedThings = _.filter flowNodeTypes, @flowNodeTypeIsConfiguredNode

        @scope.things = _.union(@scope.things, connectedThings, flows)
        @scope.tools  = _.filter flowNodeTypes, category: 'operation'

    @NodeTypeService.getUnconfiguredNodeTypes().then (nodeTypes) =>
      @scope.things = _.union(@scope.things, nodeTypes)
      @scope.loading = false

    @scope.$watch 'thingNameFilter', (thingNameFilter) =>
      thingNameFilter = thingNameFilter || '';
      filteredThings = _.filter @scope.things, (thing) =>
        name = (thing.name || '').toLowerCase()
        thingNameFilter = thingNameFilter.toLowerCase();
        return _.contains name, thingNameFilter

      @updateThingsByCategory(filteredThings)

    @scope.$watch 'things', @updateThingsByCategory

    @scope.$watch 'debug', (debug) =>
      return if @scope.unreadDebug
      return if @scope.tab.state == 'debug'
      return unless debug.length

      @scope.unreadDebug = true
    , true

  updateThingsByCategory: (things) =>
    @scope.noThings = !things.length
    @scope.thingsByCategory = _.groupBy things, (thing) =>
      return 'Flows' if thing.type == 'device:flow'
      return 'Flows' if thing.type == 'octoblu:flow'
      return 'Connected' if !thing.categories?
      thing.categories

    @scope.categories = _.sortBy(_.keys @scope.thingsByCategory)
    (_.pull @scope.categories, 'Connected').unshift 'Connected' if @scope.thingsByCategory['Connected']
    (_.pull @scope.categories, 'Flows').push 'Flows' if @scope.thingsByCategory['Flows']

  setCollectionViewStyle: (viewStyle) =>
    @scope.collectionViewStyle = viewStyle

  flowNodeTypeIsConfiguredNode: (node) =>
    return false if node.category == 'operation'
    return false if node.type == 'device:flow'
    return false if node.type == 'octoblu:flow'
    true

  toggleViewSource: =>
    @scope.viewSource = !@scope.viewSource

  toggleActiveTab: (tabState) =>
    @scope.thingNameFilter = ''
    if tabState in ['things', 'tools', 'debug']
      @scope.paneCollapsed = false
      @scope.tab.state = tabState
      @scope.unreadDebug = false if tabState == 'debug'
    else
      @scope.tab.state = undefined

angular.module('octobluApp').controller 'UtilityInspectorController', UtilityInspectorController
