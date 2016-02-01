describe 'LoginController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @rootScope = $rootScope
      @sut = $controller 'LoginController',
        $cookies : {}
        $location:
          host: -> 'the.mothership'
          port: -> 1234
          protocol: -> 'https'
          search: ->
            callbackUrl: '/devices/coffee-cup?empty=true'

        AUTHENTICATOR_URIS:
          EMAIL_PASSWORD: 'https://login.to.the.grid'
          GOOGLE: 'https://login.to.the.google'
          TWITTER: 'https://login.to.the.twitter'
          CITRIX: 'https://login.to.the.citrix'
          GITHUB: 'https://login.to.the.github'
          FACEBOOK: 'https://login.to.the.facebook'

    @encodedCallbackUrl = 'https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession%3FcallbackUrl%3D%25252Fdevices%25252Fcoffee-cup%25253Fempty%25253Dtrue'
    @callbackUrl        = 'https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession%3FcallbackUrl%3D%252Fdevices%252Fcoffee-cup%253Fempty%253Dtrue'


  describe 'emailPasswordLoginUri', ->
    it 'should have one', ->
      expect(@sut.emailPasswordLoginUri).to.equal "https://login.to.the.grid?callback=#{@encodedCallbackUrl}"

  describe 'googleLoginUri', ->
    it 'should have one', ->
      expect(@sut.googleLoginUri).to.equal "https://login.to.the.google?callback=#{@callbackUrl}"

  describe 'twitterLoginUri', ->
    it 'should have one', ->
      expect(@sut.twitterLoginUri).to.equal "https://login.to.the.twitter?callback=#{@callbackUrl}"

  describe 'citrixLoginUri', ->
    it 'should have one', ->
      expect(@sut.citrixLoginUri).to.equal "https://login.to.the.citrix?callback=#{@callbackUrl}"

  describe 'githubLoginUri', ->
    it 'should have one', ->
      expect(@sut.githubLoginUri).to.equal "https://login.to.the.github?callback=#{@callbackUrl}"

  describe 'facebookLoginUri', ->
    it 'should have one', ->
      expect(@sut.facebookLoginUri).to.equal "https://login.to.the.facebook?callback=#{@callbackUrl}"
