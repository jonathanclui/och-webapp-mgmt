var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var EventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true, default: Date.now },
    end_date: {type: Date, required: true, default: Date.now },
    event_type: { type: String, required: true },
    attendees: { type: [Schema.Types.ObjectId] },
    copay: { type: Number, min: 0, default: 0 },
    url: { type: String }
});

module.exports = mongoose.model('Event', EventSchema);
