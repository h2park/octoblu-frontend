angular.module('octobluApp')
.service('BluprintService', function ($http, OCTOBLU_API_URL, UrlService) {
  'use strict';
  var self;
  self = this;

  self.createBluprint = function(bluprint) {
    return $http.post(OCTOBLU_API_URL + "/api/templates", bluprint).then(function(response) {
      return response.data;
    });
  };

  self.update = function(uuid, data) {
    var bluprint = _.omit(data, ['_id', 'uuid', 'flow']);
    return $http.put(OCTOBLU_API_URL + '/api/templates/' + uuid, bluprint).then(function(response){
      return response.data;
    });
  };

  self.like = function(userUuid, bluprint) {
    return $http.put(OCTOBLU_API_URL + '/api/templates/' + bluprint.uuid + '/like', {userUuid: userUuid}).then(function(response){
      return response.data;
    });
  };

  self.unlike = function(userUuid, bluprint) {
    return $http.delete(OCTOBLU_API_URL + '/api/templates/' + bluprint.uuid + '/unlike', {userUuid: userUuid}).then(function(response){
      return response.data;
    });
  };

  self.withFlowId = function(flowId) {
    return $http.get(OCTOBLU_API_URL + '/api/flows/' + flowId + '/templates').then(function(response) {
      return self.addPropertiesToList(response.data);
    });
  };

  self.getPublicBluprints = function(tags) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/public', {params: {tags: tags}}).then(function(response){
      return self.addPropertiesToList(response.data);
    });
  };

  self.getPublicBluprintsPaged = function(tags, limit, page) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/public/page', {params: {tags: tags, limit: limit, page: page}}).then(function(response){
      return self.addPropertiesToList(response.data);
    });
  };

  self.getAllBluprints = function() {
    return $http.get(OCTOBLU_API_URL + '/api/templates').then(function(response) {
      return self.addPropertiesToList(response.data);
    });
  };

  self.getBluprint = function(id) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/' + id).then(function(response){
      return self.addProperties(response.data);
    });
  };

  self.importBluprint = function(id) {
    return $http.post(OCTOBLU_API_URL + '/api/templates/' + id + '/flows').then(function(response) {
      return response.data;
    })
  };

  self.addPropertiesToList = function(bluprints) {
    return _.map(bluprints, self.addProperties);
  };

  self.addProperties = function(bluprint) {
    bluprint = _.clone(bluprint);
    bluprint.tags = _.uniq(bluprint.tags) || [];
    return bluprint;
  };

  self.toggleLike = function(userUuid, bluprint) {
    if(_.includes(bluprint.likedBy, userUuid)){
      return self.unlike(userUuid, bluprint);
    }
    else{
      return self.like(userUuid, bluprint);
    }
  };


  self.deleteBluprint = function(id) {
    return $http.delete(OCTOBLU_API_URL + '/api/templates/' + id);
  };
});
