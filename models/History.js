const mongoose = require('mongoose');

let HistorySchema = new mongoose.Schema({
    from: Number,
    fromName: String,
    to: Number,
    toName: String,
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    }
}, {  collection: 'History' });

mongoose.model('History', HistorySchema);