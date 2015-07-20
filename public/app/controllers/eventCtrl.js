angular.module('eventCtrl', ['eventService'])
    
    .controller('eventController', function(Event) {

        var vm = this;

        vm.processing = true;

        // grab all the events at page load
        Event.all()
            .success(function(data) {

                // processing variable for UI purposes
                vm.processing = false;

                // bind the data 
                vm.events = data;
            });

        // Delete a event
        vm.deleteEvent = function(id) {
            vm.processing = true;

            Event.delete(id)
                .success(function(data) {

                    Event.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.events = data;
                        });
                });
        };
    })

    .controller('eventCreateController', function(Event) {

        var vm = this;

        vm.type = 'create';

        vm.saveEvent = function() {
            vm.processing = true;
            vm.message = '';

            Event.create(vm.eventData)
                .success(function(data) {
                    vm.processing = false;
                    vm.eventData = {};
                    vm.message = data.message;
                });
        };
    })

    .controller('eventEditController', function($routeParams, Event) {
        
        var vm = this;

        vm.type = 'edit';

        Event.get($routeParams.event_id)
            .success(function(data) {
                vm.eventData = data;
            });

        vm.saveEvent = function() {
            vm.processing = true;
            vm.message = '';

            Event.update($routeParams.event_id, vm.eventData)
                .success(function(data) {
                    vm.processing = false;

                    vm.eventData = {};

                    vm.message = data.message;
                });
        };
    })

    .controller('eventAttendeesController', function($routeParams, Event) {
        
        var vm = this;
        vm.users = '';
        vm.eventAttendees = '';

        vm.processing = true;

        Event.getAllUsers()
            .success(function(data) {
                vm.users = data;
            });

        Event.getAttendees($routeParams.event_id)
            .success(function(data) {
                vm.processing = false;
                vm.eventAttendees = data.attendees;
                vm.count = vm.eventAttendees.length;
            });

        vm.signInUser = function(userId) {
            Event.addAttendee($routeParams.event_id, userId)
                .success(function(data) {
                    vm.eventAttendees = data.attendees;
                    vm.count = vm.eventAttendees.length;
                });
        };

        vm.signOutUser = function(userId) {
            Event.deleteAttendee($routeParams.event_id, userId)
                .success(function(data) {
                    vm.eventAttendees = data.attendees;
                    vm.count = vm.eventAttendees.length;
                });
        };

        vm.isSignedIn = function(userId) {
            for (var i = 0; i < vm.eventAttendees.length; i++) {
                if (vm.eventAttendees[i]._id == userId) {
                    return true;
                }
            }
            return false;
        };
    });
