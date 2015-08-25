angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'https://login-staging.octoblu.com'
    GOOGLE: 'https://google-oauth-staging.octoblu.com/login'
    CITRIX: 'https://citrix-oauth-staging.octoblu.com/login'
    FACEBOOK: 'https://facebook-oauth-staging.octoblu.com/login'
    TWITTER: 'https://twitter-oauth-staging.octoblu.com/login'
    GITHUB: 'https://github-oauth-staging.octoblu.com/login'
  }
  .constant 'OAUTH_PROVIDER', 'https://oauth-staging.octoblu.com'
  .constant 'MESHBLU_HOST', 'meshblu-staging.octoblu.com'
  .constant 'MESHBLU_PORT', '443'
  .constant 'PROFILE_URI', '#'
  .constant 'OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', 'https://staging-api.octoblu.com'
  .constant 'FLOW_LOGGER_UUID', 'f952aacb-5156-4072-bcae-f830334376b1'
