angular.module('octobluApp')
.service('NodeTypeService', function (NodeService, $http, $q, OCTOBLU_ICON_URL, OCTOBLU_API_URL) {
  'use strict';

  var self = this;

  self.getNodeTypes = function(){
    return $http.get(OCTOBLU_API_URL + '/api/node_types', {cache:true}).then(function(res){
      var nodeTypes = _.filter(res.data, function(data){
        return data.enabled;
      });

      return _.map(nodeTypes, self.addLogo);
    });
  };

  self.getSubdeviceNodeTypes = function(){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.filter(nodeTypes, 'connector');
    })
  };

  self.getUnconfiguredNodeTypes = function() {
    return self.getNodeTypes()
      .then(self.removeConfiguredNodes);
  };

  self.removeConfiguredNodes = function(nodeTypes) {
    return NodeService.getNodes()
      .then(function(configuredNodes){
        return _.filter(nodeTypes, function(nodeType){
          if(nodeType.category !== 'channel') {
            return true;
          }
          return ! _.findWhere(configuredNodes, { channelid:  nodeType.channelid});
        });
      });
  }

  self.addLogo = function(node){
    var nodeCopy = _.clone(node);
    nodeCopy.logo = nodeCopy.logo || OCTOBLU_ICON_URL + nodeCopy.type.replace(':', '/') + '.svg';
    return nodeCopy;
  };

  self.getNodeTypeById = function(id){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {_id: id});
    });
  };

  self.getNodeTypeByType = function(type){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {type: type});
    });
  };

  self.getNodeTypeByObject = function(node){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.defaults(node, _.findWhere(nodeTypes, {type: node.type}));
    });
  };

  self.getById = self.getNodeTypeById;

  return self;
});
