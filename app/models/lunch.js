var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LunchSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    food_type: { type: String, required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Lunch', LunchSchema);
