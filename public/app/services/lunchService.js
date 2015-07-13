angular.module('lunchService', [])
    .factory('Lunch', function($http) {
        
        var lunchFactory = {};

        lunchFactory.get = function(id) {
            return $http.get('/api/lunches/' + id);
        };

        lunchFactory.all = function() {
            return $http.get('/api/lunches/');
        };

        lunchFactory.create = function(lunchData) {
            return $http.post('/api/lunches/', lunchData);
        };

        lunchFactory.update = function(id, lunchData) {
            return $http.put('/api/lunches/' + id, lunchData);
        };

        lunchFactory.delete = function(id) {
            return $http.delete('/api/lunches/' + id);
        };

        return lunchFactory;
    });
