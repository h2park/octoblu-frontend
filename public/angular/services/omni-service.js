angular.module('octobluApp')
  .service('OmniService', function (FlowNodeTypeService, NodeTypeService, FlowService, $q) {
    'use strict';
    var self, flowNodes, flowNodeTypes;
    self = this;

    flowNodes = [];
    flowNodeTypes = [];

    self.fetch = function (omniItems) {
      flowNodes = omniItems;
      return $q.all([self.getFlowNodeTypes(), NodeTypeService.getNodeTypes()]).then(function (results) {
        return _.union(omniItems, _.flatten(results, true));
      });
    };

    self.getFlowNodeTypes = function () {
      return FlowNodeTypeService.getFlowNodeTypes().then(function (theFlowNodeTypes) {
        flowNodeTypes = theFlowNodeTypes;
        return flowNodeTypes;
      });
    };

    self.selectItem = function (item) {
      var flowNodeType, flowNode;
      flowNodeType = _.findWhere(flowNodeTypes, {uuid: item.uuid});
      flowNode     = _.findWhere(flowNodes,     {id: item.id});

      if (flowNode) {
        FlowService.selectNode(item);
        return $q.when(null);
      }

      if (flowNodeType) {
        FlowService.addNodeFromFlowNodeType(item);
        return $q.when(null);
      }

      return $q.when(item);
    };
  });
