var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Lunch      = require('../models/lunch');
var Event	   = require('../models/event');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to generate sample user
	apiRouter.post('/createUser', function(req, res) {

		// look for the user already existing
		User.findOne({ 'email': req.body.email }, function(err, user) {

			// if there is no chris user, create one
			if (!user) {
				var newUser = new User();

				newUser.first = req.body.first;
				newUser.last = req.body.last;
				newUser.email = req.body.email; 
				newUser.employeeId = req.body.employeeId;
				newUser.password = req.body.password;

				newUser.save(function(err) {
					if (err) res.send(err);

					res.json({ 
	      				success: true,
	      				message: 'Please Check Your E-mail' 
	      			});
				});
			} else {
				// user already exists
				res.json({
					success: false,
					message: 'User already exists'
				});
			}

		});

	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    email: req.body.email
	  }).select('first last email password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	first: user.first,
	        	last: user.last,
	        	email: user.email
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	      if (err) {
	        res.status(403).send({ 
	        	success: false, 
	        	message: 'Failed to authenticate token.' 
	    	});  	   
	      } else { 
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	            
            // Make sure we go to the next routes to allow site to function
	        next(); 
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({ 
   	 		success: false, 
   	 		message: 'No token provided.' 
   	 	});
	    
	  }
	});

	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'welcome to our api!' });	
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
            // Create a new instance of the User Model
			var user = new User();		
			user.first = req.body.first;
			user.last = req.body.last;
			user.email = req.body.email; 
			if (req.body.employeeId) user.employeeId = req.body.employeeId;
			user.password = req.body.password;

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that email already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.first) user.first = req.body.first;
				if (req.body.last) user.last = req.body.last;
				if (req.body.email) user.email = req.body.email;
				if (req.body.employeeId) user.employeeId = req.body.employeeId;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

    // on routes that end in /lunches
	// ----------------------------------------------------
	apiRouter.route('/lunches')

		// create a lunch (accessed at POST http://localhost:8080/lunches)
		.post(function(req, res) {
			
            // Create a new instance of the Lunch Model
			var lunch = new Lunch();
			lunch.name = req.body.name;
			lunch.description = req.body.description; 
			lunch.food_type = req.body.food_type;
			lunch.date = req.body.date;
			lunch.attendees = req.body.attendees;

			lunch.save(function(err) {
				if (err) {
					return res.send(err);
				}

				// return a message
				res.json({ message: 'Lunch created!' });
			});

		})

		// get all the lunches (accessed at GET http://localhost:8080/api/lunches)
		.get(function(req, res) {

			Lunch.find({}, function(err, lunches) {
				if (err) res.send(err);

				// return the lunches
				res.json(lunches);
			});
		});

	// on routes that end in /lunches/:lunch_id
	// ----------------------------------------------------
	apiRouter.route('/lunches/:lunch_id')

		// get the lunch with that id
		.get(function(req, res) {
			Lunch.findById(req.params.lunch_id, function(err, lunch) {
				if (err) res.send(err);

				// return that lunch
				res.json(lunch);
			});
		})

		// update the lunch with this id
		.put(function(req, res) {
			Lunch.findById(req.params.lunch_id, function(err, lunch) {

				if (err) res.send(err);

				// set the new lunch information if it exists in the request
				if (req.body.name) lunch.name = req.body.name;
				if (req.body.description) lunch.description = req.body.description;
				if (req.body.food_type) lunch.food_type = req.body.food_type;
				if (req.body.date) lunch.date = req.body.date;

				// save the lunch
				lunch.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Lunch updated!' });
				});

			});
		})

		// delete the lunch with this id
		.delete(function(req, res) {
			Lunch.remove({
				_id: req.params.lunch_id
			}, function(err, lunch) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// on routes that end in /lunches/:lunch_id/attendees
	// ----------------------------------------------------
	apiRouter.route('/lunches/:lunch_id/attendees')

		// get the attendees for the lunch with that id
		.get(function(req, res) {
			// Get the list of attendees for the array
			var query = Lunch.findById(req.params.lunch_id);
			query.populate('attendees');
			query.select('attendees');

			query.exec(function(err, members) {
				if (err) res.send(err);

				res.json(members);
			});
		});

	// on routes that end in /lunches/:lunch_id/attendees/:attendee_id
	// ----------------------------------------------------------------
	apiRouter.route('/lunches/:lunch_id/attendees/:attendee_id')
		// update the attendees for the lunch with this id
		.put(function(req, res) {
			Lunch.findById(req.params.lunch_id, function(err, lunch) {

				if (err) res.send(err);

				var isAlreadyAttendee = lunch.attendees.some(function (userId) {
    				return userId.equals(req.params.attendee_id);
				});

				if (req.params.attendee_id) {
					if (isAlreadyAttendee) {
						res.json({ message: "User already signed in"});
					} else {
						lunch.attendees.push(req.params.attendee_id);

						// save the lunch
						lunch.save(function(err) {
							if (err) res.send(err);

							// return the list of members
							// return the list of members
							var query = Lunch.findById(req.params.lunch_id);
							query.populate('attendees');
							query.select('attendees');

							query.exec(function(err, members) {
								if (err) res.send(err);

								res.json(members);
							});
						});
					}
				}
			});
		})

		// Remove lunch attendee from the current lunch
		.delete(function(req, res) {
			Lunch.findById(req.params.lunch_id, function(err, lunch) {

				if (err) res.send(err);

				if (req.params.attendee_id) lunch.attendees.pull(req.params.attendee_id);

				// save the lunch
				lunch.save(function(err) {
					if (err) res.send(err);

					// return the list of members
					var query = Lunch.findById(req.params.lunch_id);
					query.populate('attendees');
					query.select('attendees');

					query.exec(function(err, members) {
						if (err) res.send(err);

						res.json(members);
					});
				});

			});
		});

	// on routes that end in /events
	// ----------------------------------------------------
	apiRouter.route('/events')

		// create a event (accessed at POST http://localhost:8080/events)
		.post(function(req, res) {
			
            // Create a new instance of the Event Model
			var event = new Event();
			event.name = req.body.name;
			event.description = req.body.description; 
			event.food_type = req.body.food_type;
			event.start_date = req.body.start_date;
            event.end_date = req.body.end_date;
            event.event_type = req.body.event_type;
			event.attendees = req.body.attendees;
            event.copay = req.body.copay;
            if (req.body.url) event.url = req.body.url;

			event.save(function(err) {
				if (err) {
					return res.send(err);
				}

				// return a message
				res.json({ message: 'Event created!' });
			});

		})

		// get all the lunches (accessed at GET http://localhost:8080/api/events)
		.get(function(req, res) {

			Event.find({}, function(err, events) {
				if (err) res.send(err);

				// return the events
				res.json(events);
			});
		});

	// on routes that end in /events/:event_id
	// ----------------------------------------------------
	apiRouter.route('/events/:event_id')

		// get the event with that id
		.get(function(req, res) {
			Event.findById(req.params.event_id, function(err, event) {
				if (err) res.send(err);

				// return that event
				res.json(event);
			});
		})

		// update the event with this id
		.put(function(req, res) {
			Event.findById(req.params.event_id, function(err, event) {

				if (err) res.send(err);

				// set the new event information if it exists in the request
				if (req.body.name) event.name = req.body.name;
				if (req.body.description) event.description = req.body.description;
				if (req.body.food_type) event.food_type = req.body.food_type;
				if (req.body.start_date) event.start_date = req.body.start_date;
                if (req.body.end_date) event.end_date = req.body.end_date
                if (req.body.copay) event.copay = req.body.copay;
                if (req.body.url) event.url = req.body.url;

				// save the event
				event.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Event updated!' });
				});

			});
		})

		// delete the event with this id
		.delete(function(req, res) {
			Event.remove({
				_id: req.params.event_id
			}, function(err, event) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// on routes that end in /events/:event_id/attendees
	// ----------------------------------------------------
	apiRouter.route('/events/:event_id/attendees')

		// get the attendees for the lunch with that id
		.get(function(req, res) {
			// Get the list of attendees for the array
			var query = Event.findById(req.params.event_id);
			query.populate('attendees');
			query.select('attendees');

			query.exec(function(err, members) {
				if (err) res.send(err);

				res.json(members);
			});
		});

	// on routes that end in /events/:event_id/attendees/:attendee_id
	// ----------------------------------------------------------------
	apiRouter.route('/events/:event_id/attendees/:attendee_id')
		// update the attendees for the event with this id
		.put(function(req, res) {
			Event.findById(req.params.event_id, function(err, event) {

				if (err) res.send(err);

				var isAlreadyAttendee = event.attendees.some(function (userId) {
    				return userId.equals(req.params.attendee_id);
				});

				if (req.params.attendee_id) {
					if (isAlreadyAttendee) {
						res.json({ message: "User already signed in"});
					} else {
						event.attendees.push(req.params.attendee_id);

						// save the lunch
						event.save(function(err) {
							if (err) res.send(err);

							// return the list of members
							// return the list of members
							var query = Event.findById(req.params.event_id);
							query.populate('attendees');
							query.select('attendees');

							query.exec(function(err, members) {
								if (err) res.send(err);

								res.json(members);
							});
						});
					}
				}
			});
		})

		// Remove event attendee from the current event
		.delete(function(req, res) {
			Event.findById(req.params.event_id, function(err, event) {

				if (err) res.send(err);

				if (req.params.attendee_id) event.attendees.pull(req.params.attendee_id);

				// save the lunch
				event.save(function(err) {
					if (err) res.send(err);

					// return the list of members
					var query = Event.findById(req.params.event_id);
					query.populate('attendees');
					query.select('attendees');

					query.exec(function(err, members) {
						if (err) res.send(err);

						res.json(members);
					});
				});

			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};
