angular.module('octobluApp').controller 'SharedBluprintsController', ($scope, $mdToast, $state, $stateParams, AuthService, BluprintService) ->
  class SharedBluprintsController
    constructor: () ->
      @luckyRobotNumber = Math.floor(1 + Math.random() * 9)
      @sortLikedBy = {}
      $scope.isLoading = true;
      $scope.sortMethod = '-sortLikedBy.length'
      $scope.sortMethods =
        '-sortLikedBy.length': 'Top Liked'
        'name': 'Alphabetical (ascending)'
        '-name': 'Alphabetical (descending)'
      @collectionName = $stateParams.collection
      AuthService.getCurrentUser().then (user) =>
        @userUuid = user.resource.uuid

      @refreshBluprints()

    refreshBluprints: =>
      BluprintService.getPublicBluprints(@collectionName)
        .then (bluprints) =>
          @bluprints = bluprints
          _.each @bluprints, (bluprint) =>
            @sortLikedBy[bluprint.uuid] ?= bluprint.likedBy
            bluprint.sortLikedBy = @sortLikedBy[bluprint.uuid]
          $scope.isLoading = false;

    goToBluprintDetail: (bluprint) =>
      console.log 'BOOM!'
      $state.go 'material.flow-import', {flowTemplateId: bluprint.uuid}

    importBluprint: (bluprintId) =>
      BluprintService.importBluprint(bluprintId)
        .then (flow) =>
          $scope.importing = true;
          _.delay =>
            $state.go 'material.flow', flowId: flow.flowId
            , 1000

    liked: (bluprint) =>
      _.includes bluprint.likedBy, @userUuid

    toggleLike: (bluprint) =>
      BluprintService.toggleLike(@userUuid, bluprint).then => @refreshBluprints()

    toastBluprintUrl: (url) =>
      message = "Copied #{url} to clipboard"
      $mdToast.show $mdToast.simple(position: 'top right').content message

    dialogBluprintUrl: (url) =>
      alert = $mdDialog.alert().content(url).title('Share this bluprint').ok 'OKAY'
      $mdDialog.show(alert).finally =>
        alert = undefined

    searchByTag: (tag) =>
      $scope.bluprintFilter =
        if _.includes($scope.bluprintFilter, tag)
          _.without($scope.bluprintFilter, tag)
        else
          _.union($scope.bluprintFilter, [tag])

    randomRobot: () =>
      "/assets/images/robots/robot#{@luckyRobotNumber}.png"

  new SharedBluprintsController()
