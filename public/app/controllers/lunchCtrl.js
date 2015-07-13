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
    });
