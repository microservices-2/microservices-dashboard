// /* global it expect inject beforeEach describe */
// /* jshint unused:false*/

// (function() {
//   'use strict';

//   describe('NodeService', function() {
//     var NodeService, $httpBackend, newNode;
//     beforeEach(module('microServicesGui'));

//     beforeEach(inject(function(_$httpBackend_, _NodeService_) {
//       $httpBackend = _$httpBackend_;
//       NodeService = _NodeService_;
//       newNode = {
//         id: 'testNode',
//         details: {
//           status: {
//             key: 'Test'
//           },
//           type: {
//             key: 'Test'
//           },
//           group: {
//             key: 'Test'
//           }
//         }
//       };
//     }));

//     it('should set the newNode', function() {
//       NodeService.setNode(newNode);
//       expect(NodeService.getNode()).toEqual(newNode);
//     });

//     it('should post the node to the backend', function() {
//       $httpBackend.expectPOST('rest/graph', newNode).respond(201, '');
//       NodeService.pushNode(newNode);
//       $httpBackend.flush();
//     });
//   });
// })();
