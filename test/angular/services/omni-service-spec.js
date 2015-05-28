describe('OmniService', function () {
  var sut, fakeFlowNodeTypeService, fakeFlowService, fakeNodeTypeService, $rootScope, $q;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      fakeNodeTypeService = new FakeNodeTypeService();
      fakeFlowService = new FakeFlowService();

      $provide.value('FlowNodeTypeService', fakeFlowNodeTypeService);
      $provide.value('NodeTypeService', fakeNodeTypeService);
      $provide.value('FlowService', fakeFlowService);
      $provide.value('MESHBLU_HOST', 'https://whatever.com');
    });

    inject(function(OmniService, _$rootScope_, _$q_){
      $q = _$q_;
      sut = OmniService;
      $rootScope = _$rootScope_;
    });
  });

  describe('when fetch is called with no nodes', function () {
    var promise;

    beforeEach(function () {
      promise = sut.fetch();
    });

    describe('when FlowNodeTypeService and NodeTypeService respond with nothing', function () {
      beforeEach(function () {
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([]);
        fakeNodeTypeService.getUnconfiguredNodeTypes.resolve([]);
      });

      it('should keep its promise with an empty thing', function (done) {
        promise.then(function(result){
          expect(result).to.deep.equal([]);
          done();
        }).catch(done);

        $rootScope.$apply();
      });
    });

    describe('when FlowNodeTypeService and NodeTypeService respond with something', function () {
      var flowNodeType, nodeType;

      beforeEach(function () {
        flowNodeType = {type: 'flowNodeType', uuid: '1'};
        nodeType     = {type: 'nodeType', uuid: '2'};
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([flowNodeType]);
        fakeNodeTypeService.getUnconfiguredNodeTypes.resolve([nodeType]);
      });

      it('should keep its promise a mashup of the two [flow]nodeTypes', function (done) {
        promise.then(function(omniNodes){
          expect(omniNodes).to.deep.contain(flowNodeType);
          expect(omniNodes).to.deep.contain(nodeType);
          done();
        });
        $rootScope.$apply();
      });
    });
  });

  describe('when fetch is called with some nodes', function () {
    var promise, nodes;

    beforeEach(function () {
      nodes   = [{type: 'node1', uuid: '1'}, {type: 'node2', uuid: '2'}];
      promise = sut.fetch(nodes);
    });

    describe('when FlowNodeTypeService and NodeTypeService respond with nothing', function () {
      beforeEach(function () {
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([]);
        fakeNodeTypeService.getUnconfiguredNodeTypes.resolve([]);
      });

      it('should keep its promise with the original nodes', function (done) {
        promise.then(function(returnedNodes){
          expect(returnedNodes).to.deep.equal(nodes);
          done();
        });
        $rootScope.$apply();
      });
    });
  });

  var FakeFlowNodeTypeService = function(){
    var self = this;
    self.getFlowNodeTypes = function() {
      var deferred = $q.defer();
      self.getFlowNodeTypes.resolve = deferred.resolve;
      return deferred.promise;
    };
    self.getFlowNodeTypes.resolve = function(){};
  };

  var FakeFlowService = function(){
    var self = this;
    self.addNodeFromFlowNodeType = sinon.spy();
    self.selectNode = sinon.spy();
  };

  var FakeNodeTypeService = function(){
    var self = this;
    self.getUnconfiguredNodeTypes = function() {
      var deferred = $q.defer();
      self.getUnconfiguredNodeTypes.resolve = deferred.resolve;
      return deferred.promise;
    };
    self.getUnconfiguredNodeTypes.resolve = function(){};
  };

});
