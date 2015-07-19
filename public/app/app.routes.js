angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})
		
		// USER ROUTES
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// LUNCH ROUTES
        .when('/lunches', {
            templateUrl: 'app/views/pages/lunches/all.html',
            controller: 'lunchController',
            controllerAs: 'lunch'
        })

        .when('/lunches/create', {
            templateUrl: 'app/views/pages/lunches/single.html',
            controller: 'lunchCreateController',
            controllerAs: 'lunch'
        })

        .when('/lunches/:lunch_id', {
            templateUrl: 'app/views/pages/lunches/single.html',
            controller: 'lunchEditController',
            controllerAs: 'lunch'
        })

        .when('/lunches/:lunch_id/attendees', {
            templateUrl: 'app/views/pages/lunches/attendees.html',
            controller: 'lunchAttendeesController',
            controllerAs: 'attendees'
        })

        // EVENT ROUTES
        .when('/events', {
            templateUrl: 'app/views/pages/events/all.html',
            controller: 'eventController',
            controllerAs: 'event'
        })

        .when('/events/create', {
            templateUrl: 'app/views/pages/events/single.html',
            controller: 'eventCreateController',
            controllerAs: 'event'
        })

        .when('/events/:event_id', {
            templateUrl: 'app/views/pages/events/single.html',
            controller: 'eventEditController',
            controllerAs: 'event'
        });

	$locationProvider.html5Mode(true);

});
