describe('FlowService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(FlowService, _$httpBackend_){
      sut          = FlowService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
      $httpBackend.flush();
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('saveAllFlows', function () {
    describe('when it receives one workspace', function () {
      it('call $http.put for each flow', function () {
        $httpBackend.expectPUT("/api/flows/d5fe412a.2a01c").respond(204);
        var workspace = {id: "d5fe412a.2a01c", label: "Sheet 1", type: "tab"};
        sut.saveAllFlows([workspace]);
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });

    describe('when it receives two workspaces', function () {
      it('call $http.get for each flow', function () {
        $httpBackend.expectPUT("/api/flows/one.value").respond(204);
        $httpBackend.expectPUT("/api/flows/two.value").respond(204);
        var workspaces = [
          {id: "one.value", label: "Sheet 1", type: "tab"},
          {id: "two.value", label: "Sheet 1", type: "tab"}
        ];
        sut.saveAllFlows(workspaces);
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });
  });

  describe('designerToFlows', function () {
    describe('when called with no arguments', function () {
      it('should return an empty array', function () {
        expect(sut.designerToFlows()).to.deep.equal([]);
      });
    });

    describe('when called with only a workspace', function () {
      it('should return an array with one flow', function () {
        var workspace = {id: "d5fe412a.2a01c", label: "Sheet 1", type: "tab"};

        expect(sut.designerToFlows([workspace])).to.include({
          id:   'd5fe412a.2a01c',
          name: 'Sheet 1',
          nodes: [],
          links: []
        });
      });

      it('should return an array with one flow', function () {
        var workspace = {id: "differrent.id", label: "Other Sheet", type: "tab"};
        var designerNodes = [workspace];

        expect(sut.designerToFlows(designerNodes)).to.include({
          id:    'differrent.id',
          name:  'Other Sheet',
          nodes: [],
          links: []
        });
      });
    });

    describe('when its called with a workspace and two connected nodes', function () {
      it('should return an array with one flow', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        var node1     = {id: 'node1', z: 'workspace.id', wires: [['node2']]};
        var node2     = {id: 'node2', z: 'workspace.id'};
        var designerNodes = [workspace, node1, node2];

        var flow = _.first(sut.designerToFlows(designerNodes));
        expect(flow).to.deep.equal({
          id:    'workspace.id',
          name:  'Sheet',
          nodes: [{id: 'node1'}, {id: 'node2'}],
          links: [{from: 'node1', to: 'node2'}]
        });
      });
    });
  });

  describe('extractNodesByWorkspaceId', function () {
    describe('when called with only a workspace and an id', function () {
      it('should return an empy array', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        expect(sut.extractNodesByWorkspaceId(workspace, 'workspace.id')).to.deep.equal([]);
      });
    });

    describe('when called with a workspace, a node, and an id', function () {
      it('should return just the node with z and wires stripped', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        var node      = {type:  "function", z: 'workspace.id', x: 2, wires: [{}, {}]};
        var designerNodes = [workspace, node];
        var result = sut.extractNodesByWorkspaceId(designerNodes, 'workspace.id');
        expect(result).to.deep.equal([{type: 'function', x: 2}]);
      });
    });
  });

  describe('extractLinksByWorkspaceId', function () {
    describe('when its called with only a workspace and id', function () {
      it('should return an empty array', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        expect(sut.extractLinksByWorkspaceId([workspace], 'workspace.id')).to.deep.equal([]);
      });
    });

    describe('when called with a workspace and two connected nodes', function () {
      it('return the wires', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        var node1     = {id: 'foo', z: 'workspace.id', wires: [['bar']]};
        var node2     = {id: 'bar', z: 'workspace.id', wires: []};
        var designerNodes = [workspace, node1, node2];

        var result = sut.extractLinksByWorkspaceId(designerNodes, 'workspace.id');
        expect(result).to.deep.equal([{from: 'foo', to: 'bar'}]);
      });
    });

    describe('when a node is connected to two other nodes', function () {
      it('return the wires', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        var node1     = {id: 'foo', z: 'workspace.id', wires: [['bar', 'baz']]};
        var node2     = {id: 'bar', z: 'workspace.id', wires: []};
        var node3     = {id: 'baz', z: 'workspace.id', wires: []};
        var designerNodes = [workspace, node1, node2, node3];

        var result = sut.extractLinksByWorkspaceId(designerNodes, 'workspace.id');
        expect(result).to.deep.equal([{from: 'foo', to: 'bar'}, {from: 'foo', to: 'baz'}]);
      });
    });

    describe('when called with two workspaces, each with two connected nodes', function () {
      it('return only the wires in the first workspace', function () {
        var workspace1 = {id: "workspace1.id", label: "Sheet", type: "tab"};
        var workspace2 = {id: "workspace2.id", label: "Sheet", type: "tab"};
        var node1      = {id: 'foo', z: 'workspace1.id', wires: [['bar']]};
        var node2      = {id: 'bar', z: 'workspace1.id', wires: []};
        var node3      = {id: 'far', z: 'workspace2.id', wires: [['boo']]};
        var node4      = {id: 'boo', z: 'workspace2.id', wires: []};
        var designerNodes = [workspace1, workspace2, node1, node2, node3, node4];

        var result = sut.extractLinksByWorkspaceId(designerNodes, 'workspace1.id');
        expect(result).to.deep.equal([{from: 'foo', to: 'bar'}]);
      });
    });
  });
});
