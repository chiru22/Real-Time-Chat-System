const express = require('express');
const router = express.Router();
const userProcess = require('../services/user');

router.post('/userReg', function(req, res, next) {
  userProcess.userRegisteration(req.body)
    .then(resp => {
        res.status(200).send(resp);
    })
     .catch( err => {
        res.status(500).send(err);
     })
});

router.get('/getActiveUsers', function(req, res, next) {
  userProcess.getActiveUsers(req.body)
    .then(resp => {
        res.status(200).send(resp);
    })
     .catch( err => {
        res.status(500).send(err);
     })
});

router.post('/sendMessage', function(req, res, next) {
  userProcess.sendMessage(req.body)
    .then(resp => {
        res.status(200).send(resp);
    })
     .catch( err => {
        res.status(500).send(err);
     })
});

router.post('/logout', function(req, res, next) {
  userProcess.logout(req.body)
    .then(resp => {
        res.status(200).send(resp);
    })
     .catch( err => {
        res.status(500).send(err);
     })
});

router.get('/getAllMessageById/from/:fromUserid/to/:toUserId', function(req, res, next) {
  userProcess.getAllMessageById(req.params.fromUserid, req.params.toUserId)
    .then(resp => {
        res.status(200).send(resp);
    })
     .catch( err => {
        res.status(500).send(err);
     })
});

router.put('/saveName', function(req, res, next) {
  userProcess.updateUserName(req.body)
    .then(resp => {
        res.status(200).send(resp);
    })
     .catch( err => {
        res.status(500).send(err);
     })
});

module.exports = router;