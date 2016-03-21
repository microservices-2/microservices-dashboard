/**
 * Created by yave on 21/03/16.
 */
(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .factory('NodecolorService', NodeColorService);

    NodeColorService.$inject = ['GraphService'];
    function NodeColorService(GraphService) {
        var TYPES = GraphService.getTypes(),

            COLORS = [
                '#f28686','#794044','#674ea7','#a10000','#38976d',
                '#0a6308','#f2c319','#123677','#658200','#a1a100',
                '#a25203','#862b59','#004182','#008282','#078446',
                '#416600','#99004d','#6a006a','#440a7f','#0021cb',
                '#9db2ff','#7bf6b6','#13a7c7','#00ff7f','#8b2252'
            ];

        function getColorFor(type){
            var color = '#8b2252';
            TYPES.forEach(function (t,i) {
                if(t.key===type){
                    color = COLORS[i];
                }
            });
            return color;
        }

        return {
            getColorFor:getColorFor
        }
    }
})();
