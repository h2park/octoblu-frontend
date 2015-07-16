angular.module('octobluApp')
.service('FlowNodeTypeService', function (OCTOBLU_API_URL, $http, $q, UUIDService, NodeService, OCTOBLU_ICON_URL) {
  'use strict';

  var self = this;

  var CACHE_TIMEOUT = 3000;
  var cacheTimeStamp;
  var resolvedPromise;
  var pendingPromise;

  self.createFlowNode = function(flowNodeType){
    var defaults = _.cloneDeep(flowNodeType.defaults);

    return _.defaults({id: UUIDService.v1(), resourceType: 'flow-node'}, defaults, flowNodeType);
  };

  self.getFlowNodeType  = function(type){
    return self.getFlowNodeTypes().then(function(flowNodeTypes){
      return _.findWhere(flowNodeTypes, {type: type});
    });
  };

  self.getFlowNodeTypeByUUID = function(uuid){
    return self.getFlowNodeTypes().then(function(flowNodeTypes){
      return _.findWhere(flowNodeTypes, {uuid: uuid});
    });
  };

  self.getFlowNodeTypes = function(cache) {
    var now = (new Date).getTime();

    if (!pendingPromise && (!cacheTimeStamp || (now - cacheTimeStamp)>CACHE_TIMEOUT)) {
      pendingPromise = $http.get(OCTOBLU_API_URL + '/api/flow_node_types')
      .then(function(res) {
        var result = _.map(res.data, function(data){
          if(data.logo){
            return data;
          }
          if(data.defaults && data.defaults.logo){
            data.logo = data.defaults.logo;
            return data;
          }
          if (data && data.type) {
            data.logo = OCTOBLU_ICON_URL + data.type.replace(':', '/') + '.svg';
          }
          return data;
        });
        cacheTimeStamp = (new Date).getTime();
        resolvedPromise = pendingPromise;
        pendingPromise = undefined;
        return result;
      }, function(reason) {
        pendingPromise = undefined;
        console.error(reason);
      });
    }

    return resolvedPromise || pendingPromise;
  };

  self.getOtherMatchingFlowNodeTypes = function(type){
    return self.getFlowNodeTypes(true).then(function(flowNodeTypes){
      return _.where(flowNodeTypes, { type : type });
    });
  };

  function getSubdeviceFlowNodeTypes() {
    return NodeService.getSubdeviceNodes().then(function(subdevices){
      return _.map(subdevices, function(subdevice){
        return self.convertSubdevice(subdevice);
      });

    });
  }

  //"borrowed" from the back end until we can query subdevices on the backend.
  // Can we give it back now?
  self.convertSubdevice = function(node) {
    return {
      name: node.name,
      category: 'device',
      class: node.name,
      type: node.type,
      logo: node.logo,
      uuid: node.uuid,
      defaults: {
        logo: node.logo,
        category: 'device',
        uuid: node.uuid,
        schema: node && node.plugin ? node.plugin.messageSchema : {},
        useStaticMessage: true,
        staticMessage: {},
        type: node.type
      },
      resourceType: 'flow-node-type',
      input: 1,
      output: 1,
      formTemplatePath: "/pages/node_forms/subdevice_form.html"
    };
  };

  return self;
});
