const router = require('express').Router();
const mongoose = require('mongoose');
require('../models/Customers');
const Customer = mongoose.model('Customer');
require('../models/History');
const History = mongoose.model('History');

router.get('/', (req, res)=>{
    Customer.find({}).sort({account_no: 1}).exec((err, customers)=>{
        if(err)
            return res.json({
                'status': false,
                'message': 'Server Error! (Error: '+err.message+')'
            });
        return res.json({
            'status': true,
            'message': 'Customers successfully retrived!',
            'customers': customers
        });
    });
});

router.get('/history', (req, res)=>{
    History.find({}).sort({date: -1}).exec((err, historyDocs)=>{
        if(err)
            return res.json({
                'status': false,
                'message': 'Server Error! (Error: '+err.message+')'
            });
        return res.json({
            'status': true,
            'message': 'History successfully retrived!',
            'history': historyDocs
        });
    });
});

router.post('/transfer', (req, res)=>{
    const { body } = req;
    const {
        from,
        to,
        amount
    } = body;
    if(from === "" || to === "" || amount === "" || !from || !to || !amount)
        return res.json({
            'status': false,
            'message': 'Invalid/Missing data in the request!'
        });
    if(from === to)
        return res.json({
            'status': false,
            'message': 'Sender and Reciever cannot be the same account!'
        });
    Customer.find({
        account_no: from
    }, (err, senders)=>{
        if(err)
            return res.json({
                'status': false,
                'message': 'Server Error! (Error: '+err.message+')!'
            });
        if(senders.length === 0)
            return res.json({
                'status': false,
                'message': 'Sender account does not exists!'
            });
        if(senders[0].balance<amount)
            return res.json({
                'status': false,
                'message': 'not enough balance in '+senders[0].name+'\'s account!'
            });
        let sender = senders[0];
        Customer.find({
            account_no: to
        }, (err, receivers)=>{
        if(err)
            return res.json({
                'status': false,
                'message': 'Server Error! (Error: '+err.message+')!'
            });
        if(receivers.length === 0)
            return res.json({
                'status': false,
                'message': 'Receiver account does not exists!'
            });
        let receiver = receivers[0];
        sender.balance -= amount;
        sender.save((err, docs)=>{
            if(err)
                return res.json({
                    'status': false,
                    'message': 'Error while updating senders balance!'
                });
        });
        receiver.balance = Number(receiver.balance) + Number(amount);
        receiver.save((err, docs)=>{
            if(err)
                return res.json({
                    'status': false,
                    'message': 'Error while updating receiver balance!'
                });
        });
        let newHistory = new History();
        newHistory.from = from;
        newHistory.fromName = sender.name;
        newHistory.to = to;
        newHistory.toName = receiver.name;
        newHistory.amount = amount;
        newHistory.save((err, docs)=>{
            if(err)
                return res.json({
                    'status': false,
                    'message': 'Error while creating history entry for the transaction!'
                });
        });
        res.json({
            'status': true,
            'message': 'Transaction successfully completed!'
        });
        });
    });
});

module.exports = router;