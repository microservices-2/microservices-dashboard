(function () {
    'use strict';

    describe('Test graph node filter', function () {

        beforeEach(module('microServicesGui'));

        it('should have a node filter', inject(function ($filter) {
            expect($filter('nodeFilter')).toBeDefined();
        }));

        it('should have a node filter that produces an array of nodes',
            inject(function ($filter) {

                var nodeSearch = {details:{status:'UP'}};
                var node1 = {
                    details: {
                        status: 'UP',
                        type: 'DB'
                    },
                    lane: 3
                }, node2 = {
                    details: {
                        status: 'DOWN',
                        type: 'DB'
                    },
                    lane: 3
                }, node3 = {
                    details: {
                        status: 'UP',
                        type: 'SOAP'
                    },
                    lane: 3
                }, node4 = {
                    details: {
                        status: 'DOWN',
                        type: 'SOAP'
                    },
                    lane: 3
                }, node5 = {
                    details: {
                        status: 'UP',
                        type: 'MICROSERVICE'
                    },
                    lane: 2
                }, node6 = {
                    details: {
                        status: 'UP',
                        type: 'MICROSERVICE'
                    },
                    lane: 2
                };
                var nodesList = [node1, node2, node3, node4, node5, node6];

                var nodes = $filter('nodeFilter')(nodesList, nodeSearch);

                expect(nodes.length).toEqual(4);
                expect(nodes[0]).toEqual(node1);
                expect(nodes[1]).toEqual(node3);
                expect(nodes[2]).toEqual(node5);
                expect(nodes[3]).toEqual(node6);
            }));

        it('should return [] when nothing is set',
            inject(function ($filter) {

                var nodes = $filter('nodeFilter')([], '');
                expect(nodes).toBeDefined();
                expect(nodes.length).toEqual(0);
            }));

    });
})();
