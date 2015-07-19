angular.module('lunchCtrl', ['lunchService'])
    
    .controller('lunchController', function(Lunch) {

        var vm = this;

        vm.processing = true;

        // grab al the lunches at page load
        Lunch.all()
            .success(function(data) {

                // processing variable for UI purposes
                vm.processing = false;

                // bind the data 
                vm.lunches = data;
            });

        // Delete a lunch
        vm.deleteLunch = function(id) {
            vm.processing = true;

            Lunch.delete(id)
                .success(function(data) {

                    Lunch.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.lunches = data;
                        });
                });
        };
    })

    .controller('lunchCreateController', function(Lunch) {

        var vm = this;

        vm.type = 'create';

        vm.saveLunch = function() {
            vm.processing = true;
            vm.message = '';

            Lunch.create(vm.lunchData)
                .success(function(data) {
                    vm.processing = false;
                    vm.lunchData = {};
                    vm.message = data.message;
                });
        };
    })

    .controller('lunchEditController', function($routeParams, Lunch) {
        
        var vm = this;

        vm.type = 'edit';

        Lunch.get($routeParams.lunch_id)
            .success(function(data) {
                vm.lunchData = data;
            });

        vm.saveLunch = function() {
            vm.processing = true;
            vm.message = '';

            Lunch.update($routeParams.lunch_id, vm.lunchData)
                .success(function(data) {
                    vm.processing = false;

                    vm.lunchData = {};

                    vm.message = data.message;
                });
        };
    })

    .controller('lunchAttendeesController', function($routeParams, Lunch) {
        
        var vm = this;
        vm.users = '';
        vm.lunchAttendees = '';

        vm.processing = true;

        Lunch.getAllUsers()
            .success(function(data) {
                vm.users = data;
            });

        Lunch.getAttendees($routeParams.lunch_id)
            .success(function(data) {
                vm.processing = false;
                vm.lunchAttendees = data.attendees;
            });

        vm.signInUser = function(userId) {
            Lunch.addAttendee($routeParams.lunch_id, userId)
                .success(function(data) {
                    vm.lunchAttendees = data.attendees;
                });
        };

        vm.signOutUser = function(userId) {
            Lunch.deleteAttendee($routeParams.lunch_id, userId)
                .success(function(data) {
                    vm.lunchAttendees = data.attendees;
                });
        };

        vm.isSignedIn = function(userId) {
            for (var i = 0; i < vm.lunchAttendees.length; i++) {
                if (vm.lunchAttendees[i]._id == userId) {
                    return true;
                }
            }
            return false;
        };
    });
