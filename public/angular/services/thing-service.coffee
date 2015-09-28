class ThingService
  constructor: ($q, skynetService, OCTOBLU_ICON_URL) ->
    @skynetPromise  = skynetService.getSkynetConnection()
    @q = $q
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

  addLogo: (data) =>
    return _.clone data unless data?.type?

    filePath = data.type.replace('octoblu:', 'device:').replace ':', '/'
    logo = "#{@OCTOBLU_ICON_URL}#{filePath}.svg"
    _.extend logo: logo, data

  addUuidToWhitelists: (uuid, device={}) =>
    thing = {}
    thing.owner = uuid
    thing.discoverWhitelist  = _.union [uuid], device.discoverWhitelist ? []
    thing.configureWhitelist = _.union [uuid], device.configureWhitelist ? []
    thing.sendWhitelist      = _.union [uuid], device.sendWhitelist ? []
    thing.receiveWhitelist   = _.union [uuid], device.receiveWhitelist ? []
    thing

  calculateTheEverything: (device, peers) =>
    uuid: '*'
    name: 'Everything'
    discover:  !device.discoverWhitelist?
    configure: !device.configureWhitelist?
    send:      !device.sendWhitelist?
    receive:   !device.receiveWhitelist?

  claimThing: (query, user, params)=>
    return @q.reject 'Unable to claim device, missing uuid'  unless query?.uuid?
    return @q.reject 'Unable to claim device, missing token' unless query?.token?

    @getThing(query).then (thing) =>
      thing = @addUuidToWhitelists user.uuid, thing
      thing.name =  params.name
      thing.uuid =  query.uuid
      thing.token = query.token

      @updateDevice(thing)

  combineDeviceWithPeers: (device, peers) =>
    return unless device? && peers?

    rows = []
    rows.push @calculateTheEverything(device, peers)

    _.each peers, (peer) =>
      rows.push {uuid: peer.uuid, name: peer.name, type: peer.type, discover: false, configure: false, send: false, receive: false}

    _.each device.discoverWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'discover', uuid

    _.each device.configureWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'configure', uuid

    _.each device.sendWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'send', uuid

    _.each device.receiveWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'receive', uuid

    sortedRows = []

    [everything,rows] = _.partition rows, uuid: '*'
    [users,devices] = _.partition rows, (row) -> _.contains ['octoblu:user','user'], row.type
    users = _.sortBy users, 'uuid'
    devices = _.sortBy devices, 'uuid'
    _.union everything, users, devices


  _updateWhitelistOnRows: (rows, whitelistName, uuid) =>
    # _updateWhitelistOnRows could do in place modifications
    # to rows. Might be much faster, so look here if it's slow
    rows = _.cloneDeep rows
    row = _.find rows, uuid: uuid
    unless row?
      row = {uuid: uuid, discover: false, configure: false, send: false, receive: false}
      rows.push row
    row[whitelistName] = true
    rows

  deleteThing: (device) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.unregister uuid: device.uuid, =>
        deferred.resolve()

    deferred.promise

  generateSessionToken: (device) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.generateAndStoreToken uuid: device.uuid, (result) =>
        deferred.resolve result.token

    deferred.promise

  getThing: (query={}) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.devices query, (result={}) =>
        return deferred.reject result.error if result.error?
        thing = _.first result.devices
        thing = @addLogo thing
        deferred.resolve thing

    deferred.promise

  getThings: =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.mydevices {}, (results) =>
        [users, devices] = _.partition results.devices, type: 'octoblu:user'

        things = _.union(users, devices)

        things = _.map things, @addLogo

        deferred.resolve things

    deferred.promise

  revokeToken: (device={}) =>
    deferred = @q.defer()
    @skynetPromise.then (connection) =>
      connection.revokeToken device, (result) =>
        return deferred.reject new Error('Failed to revokeToken') unless result?
        deferred.resolve {}
    deferred.promise

  updateDevice: (device={}) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.update device, (response) =>
        deferred.resolve()

    deferred.promise

  updateDeviceWithPermissionRows: (device, rows) =>
    return @q.when() unless device? && rows?
    @updateDevice(
      uuid: device.uuid
      discoverWhitelist: _.pluck(_.where(rows, discover: true), 'uuid')
      configureWhitelist: _.pluck(_.where(rows, configure: true), 'uuid')
      sendWhitelist: _.pluck(_.where(rows, send: true), 'uuid')
      receiveWhitelist: _.pluck(_.where(rows, receive: true), 'uuid')
    )

angular.module('octobluApp').service 'ThingService', ThingService
