'use strict';
angular.module('octobluApp')
.service('userService', function ($http, $q, elasticService) {
  this.getMessageGraph = function (uuid, from, interval, callback) {
    elasticService.searchAdvanced(
    {
      'size': 0,
      'query': {
        'filtered': {
          'filter': {
            'query': {
              'bool': {
                'must': [
                {
                  'query_string': {
                    'query': '(fromUuid.owner = "' + uuid + '" OR toUuid.owner = "' + uuid + '")'
                  }
                },
                {
                  'range': {
                    'timestamp': {
                      'from': from,
                      'to': 'now'
                    }
                  }
                }
                ]
              }
            }
          }
        }
      },
      'facets': {
        'times': {
          'date_histogram': {
            'field': 'timestamp',
            'interval': interval
          }
        },
        'types': {
          'terms': {
            'field': 'eventCode'
          }
        }
      }
    },
    function (err, data) {
      if (err) { return console.log(err); }

      callback({
        total: data.hits.total,
        times: [
        {
          key: 'Messages',
          values: _.map(data.facets.times.entries, function (item) {
            return {
              x: item.time,
              y: item.count
            };
          })
        }
        ],
        types: _.map(data.facets.types.terms, function (item) {
          return {
            label: item.term,
            value: item.count
          };
        })
      });
    }
    );
};

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

  $http.post(OCTOBLU_API_URL + '/api/auth/aws/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });

};

this.saveCloudDotComApi = function (uuid, channelid, username, password, callback) {

  $http.post(OCTOBLU_API_URL + '/api/auth/clouddotcom/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });
};

this.saveGooglePlacesApi = function(uuid, channelid, apikey, callback) {
  $http.post(OCTOBLU_API_URL + '/api/auth/google-places/channel/' + channelid, { apikey: apikey })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.error('Error: ' + data);
    callback({});
  });
};

this.saveBasicApi = function (uuid, channelid, username, password, callback) {

  $http.post(OCTOBLU_API_URL + '/api/auth/basic/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(null, data);
  })
  .error(function (error) {
    console.error(error);
    callback(error);
  });

};

this.saveApiKey = function(channelid, apikey, callback){
  $http.post(OCTOBLU_API_URL + '/api/auth/apikey/channel/' + channelid, {apikey: apikey})
  .success(function(data){
    callback(data);
  })
  .error(function(error){
    console.error('Error: ', error);
  });
};

this.saveSimpleAuthQuery = function(channelid, userId, password, domain, appKey, callback){
  $http.post(OCTOBLU_API_URL + '/api/auth/simpleauthquery/channel/' + channelid, {
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

this.saveConnection = function (uuid, channelid, key, token, custom_tokens, callback, defaultParams) {

  $http.put(OCTOBLU_API_URL + '/api/user/' + uuid+ '/channel/' + channelid,
  	{ key: key, token: token, custom_tokens: custom_tokens, defaultParams : defaultParams })
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
