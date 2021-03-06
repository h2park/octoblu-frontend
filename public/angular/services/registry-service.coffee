{_, async, angular} = window

class RegistryService
  constructor: ($window, $q, $http, AuthService, DeviceLogo, OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL, OCTOBLU_REGISTRY_ENDO_OFFICIAL, OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY, OCTOBLU_REGISTRY_ENDO_COMMUNITY) ->
    @window = $window
    @q = $q
    @http = $http
    @AuthService = AuthService
    @DeviceLogo = DeviceLogo
    @OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL = OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL
    @OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY = OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY
    @OCTOBLU_REGISTRY_ENDO_OFFICIAL = OCTOBLU_REGISTRY_ENDO_OFFICIAL
    @OCTOBLU_REGISTRY_ENDO_COMMUNITY = OCTOBLU_REGISTRY_ENDO_COMMUNITY
    @getRegistriesQueue = async.queue @_getRegistriesAndCache

  getRegistries: =>
    return @q.when @registries if @registries?

    return @q (resolve, reject) =>
      @getRegistriesQueue.push {}, (error) =>
        return reject error if error?
        resolve _.cloneDeep @registries

  sanifyStr: (str='') =>
    return '' unless _.isString str
    return str.toLowerCase()

  _filterCollection: (items, key, search, exact) =>
    return _.filter items, (item) =>
      value = @sanifyStr item[key]
      return value == search if exact
      return _.includes value, @sanifyStr search

  filterBy: (key, search, exact) =>
    return _.mapValues _.cloneDeep(@registries), (registrySet) =>
      return _.mapValues registrySet, (registry) =>
        registry.items = @_filterCollection registry.items, key, search, exact
        return registry

  getItem: ({ _id, githubSlug, type }) =>
    found = null
    _.some _.values(@registries), (registrySet) =>
      return _.some registrySet, (registry) =>
        found = _.find registry.items, { _id } if _id?
        found = _.find registry.items, { githubSlug } if githubSlug?
        found = _.find registry.items, { type } if type?
        return true if found
    return found

  getItemFromDevice: (device) =>
    registryItemId = _.get(device, 'octoblu.registryItem._id')
    return @getItem { _id: registryItemId } if registryItemId?
    githubSlug = @getGithubSlugFromDevice device
    foundRegistryItem = @getItem { githubSlug } if githubSlug?
    return foundRegistryItem if foundRegistryItem?
    deviceRegistryItem = _.get device, 'octoblu.registryItem'
    return deviceRegistryItem if deviceRegistryItem?
    return null

  getGithubSlugFromDevice: (device) =>
    registryGithubSlug = _.get device, 'octoblu.registryItem.githubSlug'
    return registryGithubSlug if registryGithubSlug?
    githubSlug = _.get device, 'connectorMetadata.githubSlug'
    return githubSlug if githubSlug?
    connector = _.get device, 'connector'
    return "octoblu/#{connector}" if connector?

  getDeviceUrl: (device) =>
    foundItem = @getItemFromDevice device
    return unless foundItem?
    return @parseUri foundItem.configureUri, device if device.uuid
    return @parseUri foundItem.createUri, device unless device.uuid

  parseUri: (uri, { uuid }) =>
    return uri.replace ':uuid', uuid

  hasItems: (registries) =>
    return _.some registries, (registrySet) =>
      return _.some _.values(registrySet), (registry) =>
        return !_.isEmpty(registry.items)

  _getRegistriesFromUser: (callback) =>
    @AuthService.getCurrentUser()
      .then (user) =>
        registries = _.get user, 'userDevice.octoblu.registries', {}
        registries.connectors ?= {}
        registries.endos ?= {}
        registries.connectors['octoblu-official'] ?= {
          uri: @OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL,
        }
        registries.connectors['octoblu-community'] ?= {
          uri: @OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY,
        }
        registries.endos['octoblu-official'] ?= {
          uri: @OCTOBLU_REGISTRY_ENDO_OFFICIAL,
        }
        registries.endos['octoblu-community'] ?= {
          uri: @OCTOBLU_REGISTRY_ENDO_COMMUNITY,
        }
        callback null, registries
      .catch (error) =>
        callback error
    return

  _mapItem: (node={}) =>
    node.logo = new @DeviceLogo(node).get()
    node.categories = node.tags
    return node

  # 0.9 async.map doesn't handle mapping objects
  _mapObject: (object, fn, callback) =>
    values = _.values(object)
    keys = _.keys(object)
    async.map values, fn, (error, mappedValues) =>
      return callback error if error?
      finalObject = {}
      _.each keys, (key, i) =>
        return if _.isEmpty mappedValues[i]
        finalObject[key] = mappedValues[i]
      callback null, finalObject

  _getRegistry: ({ uri }, callback) =>
    @http.get uri
      .then (response) =>
        return callback new Error('invalid response code') unless response.status == 200
        registry = response.data ? {}
        registry.items = _.map registry.items, @_mapItem
        callback null, registry
      .catch (error) =>
        console.error 'error fetching registry', { uri, error }
        callback null
    return

  _getRegistrySet: (registrySet, callback) =>
    @_mapObject registrySet, @_getRegistry, callback

  _getRegistriesAndCache: (task, callback) =>
    return callback() if @registries?
    @_getRegistriesFromUser (error, registries) =>
      return callback error if error?
      @_mapObject registries, @_getRegistrySet, (error, @registries) =>
        return callback error if error?
        callback null

angular.module('octobluApp').service 'RegistryService', RegistryService
