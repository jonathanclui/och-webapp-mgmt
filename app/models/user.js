var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
	first: { type: String, required: true },
	last: { type: String, required: true },
	employeeId: { type: Number, unique: true },
	email: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

UserSchema.virtual('fullname').get(function() {
    return this.first + ' ' + this.last;
});

UserSchema.virtual('fullname').set(function (name) {
  var split = name.split(' ');
  this.first = split[0];
  this.last = split[1];
});

module.exports = mongoose.model('User', UserSchema);
