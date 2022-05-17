const express = require('express');
const userController = require('../controllers/userLoanController');
const router = express();

// confirm provided ID on registration
router.post('/confirmIDs', userController.confirmIDs);

// register user after ID confirmation
router.post('/register', userController.register);

// login user
router.post('/login', userController.login);

// get user profile on dashboard
router.get('/getProfile', userController.getProfile);

// request loan
router.post('/requestLoan', userController.requestLoan);

// get user loan history
router.post('/getPendingLoan', userController.getPendingLoan);

// edit pending loan
router.post('/editLoan', userController.editLoan);

// delete pending loan
router.post('/deleteLoan', userController.deleteLoan);

// get accepted loan
router.post('/getAcceptedLoan', userController.getAcceptedLoan);

// loan payemnt
router.post('/loanPayment', userController.loanPayment);

module.exports = router;