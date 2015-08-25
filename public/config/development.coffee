angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "http://#{window.location.hostname}:8888"
    GOOGLE: "http://#{window.location.hostname}:8888"
    FACEBOOK: "http://#{window.location.hostname}:8888"
    TWITTER: "http://#{window.location.hostname}:8888"
    CITRIX: "http://#{window.location.hostname}:8888"
    GITHUB: "http://#{window.location.hostname}:8888"
  }
  .constant 'OAUTH_PROVIDER', "http://#{window.location.hostname}:9000"
  .constant 'MESHBLU_HOST', "#{window.location.hostname}"
  .constant 'MESHBLU_PORT', '3000'
  .constant 'PROFILE_URI', "http://#{window.location.hostname}:8888/profile"
  # .constant 'OCTOBLU_ICON_URL', 'http://octoblu-icons.s3.amazonaws.com/'
  .constant 'OCTOBLU_ICON_URL', 'http://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', "http://#{window.location.hostname}:8080"
  .constant 'FLOW_LOGGER_UUID', 'c9296386-f1bb-46bf-9f85-ec9a3c287a95'
  .constant 'GATEBLU_LOGGER_UUID', '9dd90de9-5970-435b-8e97-9e0d04f07d97'
