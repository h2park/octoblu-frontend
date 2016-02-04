class TopBarController
  constructor: ($state, AuthService) ->
    @state = $state
    @AuthService = AuthService

    @showUserNav = false

  logout: =>
    @AuthService.logout()
      .then => @state.go 'login'


angular.module('octobluApp').controller 'TopBarController', TopBarController
