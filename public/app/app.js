angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'userService', 'lunchService', 'eventService', 'mainCtrl', 'userCtrl', 'lunchCtrl', 'eventCtrl'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
