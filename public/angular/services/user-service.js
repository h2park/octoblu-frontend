'use strict';
angular.module('octobluApp')
.service('userService', function ($http, $q, OCTOBLU_API_URL) {

this.activateNoAuthChannel = function(user, channelid, callback) {
  $http.put(OCTOBLU_API_URL + '/api/user/' + user + '/activate/' + channelid)
  .success(function(data) {
    callback(null, data);
  })
  .error(function(error) {
    console.error(error);
    callback(error);
  });
};

this.activateNoAuthChannelByType = function(user, channeltype, callback) {
  $http.put(OCTOBLU_API_URL + '/api/user/' + user + '/activate/' + channeltype + '/type')
  .success(function(data) {
    callback(null, data);
  })
  .error(function(error) {
    console.error(error);
    callback(error);
  });
};

this.saveAWSApi = function (uuid, channelid, username, password, callback) {

  $http.post(OCTOBLU_API_URL + '/api/channel/aws/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });

};

this.savePagerdutyApi = function (channelId, token, callback) {
  $http.post(OCTOBLU_API_URL + '/api/channel/pagerduty/channel/' + channelId, {token: token})
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });
};

this.saveGooglePlacesApi = function(uuid, channelid, apikey, callback) {
  $http.post(OCTOBLU_API_URL + '/api/channel/google-places/channel/' + channelid, { apikey: apikey })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.error('Error: ' + data);
    callback({});
  });
};

this.saveBasicApi = function (uuid, channelid, username, password, callback) {
  $http.post(OCTOBLU_API_URL + '/api/channel/basic/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(null, data);
  })
  .error(function (error) {
    console.error(error);
    callback(error);
  });

};

this.saveApiKey = function(channelid, apikey, callback){
  $http.post(OCTOBLU_API_URL + '/api/channel/apikey/channel/' + channelid, {apikey: apikey})
  .success(function(data){
    callback(data);
  })
  .error(function(error){
    console.error('Error: ', error);
  });
};

this.saveSimpleAuthQuery = function(channelid, userId, password, domain, appKey, callback){
  $http.post(OCTOBLU_API_URL + '/api/channel/simpleauthquery/channel/' + channelid, {
      userId : userId,
      domain : domain,
      password : password,
      appKey : appKey})
  .success(function(data){
    callback(data);
  })
  .error(function(error){
    console.error('Error: ', error);
  });
};

this.saveConnection = function (uuid, channelid, key, token, custom_tokens, callback, defaultParams, defaultHeaderParams) {
  $http.put(OCTOBLU_API_URL + '/api/user/' + uuid+ '/channel/' + channelid,
  	{ key: key, token: token, custom_tokens: custom_tokens, defaultParams : defaultParams, defaultHeaderParams: defaultHeaderParams})
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });
};

this.removeConnection = function (channelid) {
  return $http.delete(OCTOBLU_API_URL + '/api/user/channel/' + channelid);
};

});
