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

        lunchFactory.getAttendees = function(id) {
            return $http.get('/api/lunches/' + id + '/attendees');
        };

        lunchFactory.addAttendee = function(id, attendeeId) {
            return $http.put('/api/lunches/' + id + '/attendees/' + attendeeId);
        };

        lunchFactory.deleteAttendee = function(id, attendeeId) {
            return $http.delete('api/lunches/' + id + '/attendees/' + attendeeId);
        };

        lunchFactory.getAllUsers = function() {
            return $http.get('/api/users/');
        };

        return lunchFactory;
    });
