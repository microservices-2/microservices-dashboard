/**
 * Created by yave on 21/03/16.
 */
(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .factory('NodecolorService', NodeColorService);

    NodeColorService.$inject = [];
    function NodeColorService() {
        var types = [],
            COLORS = [
                '#004182', '#0a6308', '#674ea7', '#a10000', '#38976d',
                '#794044', '#f2c319', '#123677', '#658200', '#a1a100',
                '#a25203', '#862b59', '#f28686', '#008282', '#078446',
                '#416600', '#99004d', '#6a006a', '#440a7f', '#0021cb',
                '#9db2ff', '#7bf6b6', '#13a7c7', '#00ff7f', '#8b2252'
            ];

        function getColorFor(type) {
            var color = '#8b2252',
                index = types.indexOf(type);

            if (index > -1) {
                return COLORS[index];
            } else {
                types.push(type);
            }
            return color;
        }

        return {
            getColorFor: getColorFor
        }
    }
})();
