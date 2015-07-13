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
    });
