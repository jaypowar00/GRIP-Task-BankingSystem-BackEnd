const mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    account_no: {
        type: Number
    },
    balance: {
        type: Number
    }
}, {  collection: 'Customers' });

mongoose.model('Customer', CustomerSchema);