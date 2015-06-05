angular.module('octobluApp')
.directive('flowNodeEditor', function ($window) {
  return {
    restrict: 'E',
    controller: 'FlowNodeEditorController',
    templateUrl: '/pages/flow-node-editor.html',
    replace: true,
    transclude: true,
    scope: {
      flowNode: '=',
      flowId: '='
    },
    link: function(scope, element) {
      // var setScrollableHeight = function() {
      //   var size = $window.innerHeight - 100;
      //   $('.flow-node-editor').css('max-height', size);
      // }
      //
      // var w = angular.element($window);
      // setScrollableHeight()
      //
      // w.bind('resize', function(){
      //   setScrollableHeight();
      // });
    }
  }
});
