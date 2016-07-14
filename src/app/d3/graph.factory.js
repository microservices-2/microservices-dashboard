(function () {
    'use strict';

    angular.module('msgGraph', [])

        .factory('d3', function () {
            /* We could declare locals or other D3.js specific configurations here. */
            return d3;
        });
})();
