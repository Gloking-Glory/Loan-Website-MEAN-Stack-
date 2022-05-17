const express = require("express");
const router = express();
const adminController = require("../controllers/adminLoanController");

// accept loan request
router.post('/acceptRequest', adminController.acceptRequest);

// reject loan request
router.post('/rejectRequest', adminController.rejectRequest);

// get loan request for admin
router.get('/getLoanRequest', adminController.getLoanRequest);

// get accepted loan
router.get('/getAcceptedLoan', adminController.getAcceptedLoan);

// get rejected loan
router.get('/getRejectedLoan', adminController.getRejectedLoan);

// delete rejected loan
router.post('/delRejectedLoan', adminController.delRejectedLoan);

module.exports = router;