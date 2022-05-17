const { userModel, requestModel, acceptModel, rejectModel, paymentModel } = require('../model/loanModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const PayStack = require('paystack-node');
const secret = process.env.JWT_SECRET;
const paystackKey = process.env.PAYSTACK_SECRET_KEY;

const confirmIDs =(req, res)=> {
    let { email, username } = req.body;
    userModel.find()
    .then(allUser => {
        let findUsername = allUser.find(user => user.username == username);
        let findEmail = allUser.find(user => user.email == email);
        if (findUsername) {
            res.send({confirmError: true, message: "Username already exist"});
            return;
        }
        if (findEmail) {
            res.send({confirmError: true, message: "Email already exist"});
            return;
        } else {
            let transporter = nodemailer.createTransport ({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
            let confirmationCode = Math.floor(Math.random() * 10000);
            let mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: "Confirm Your Email Address",
                text: `Your Loan Application Email Confirmation Code is ${confirmationCode}`
            }
            transporter.sendMail(mailOptions, (err, info)=> {
                if (!err) {
                    res.send({confirmationCode});
                } else {
                    throw err;
                }
            })
        }
    })
}

const register =(req, res)=> {
    let form = new userModel(req.body);
    form.save()
    .then(()=> {
        res.send({success: true, message: "Registration Successfull"});
    });
}

const login =(req, res)=> {
    let { userId, password } = req.body;
    userModel.find()
    .then(allUser => {
        let findUserId = allUser.find(user => user.email == userId || user.username == userId);
        if (findUserId) {
            findUserId.validatePassword(password, (err, same)=> {
                if (err) {
                    res.status(500).send({message: "Internal Sever Error"});
                } else if (!same) {
                    res.status(401).send({message: "Incorrect Password"});
                } else {
                    let userData = {email: findUserId.email};
                    let token = jwt.sign(userData, secret, {expiresIn: '1h'});
                    res.status(200).send({success: true, message: "Login successfull", token});
                }
            })
        } else {
            res.send({message: "Invalid user data"});
        }
    })
}

const getProfile =(req, res)=> {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret, (err, decoded)=> {
        let email = decoded.email;
        userModel.findOne({email}, (err, userInfo)=> {
            if (userInfo) {
                res.send(userInfo);
            } else if (err) {
                throw err;
            }
        })
    })
}

const requestLoan =(req, res)=> {
    let { amount, paymentMethod, duration, email, purpose } = req.body;
    let interest = amount / 100 * 10;
    let loanForm = new requestModel({...req.body, interest, status: "Pending"});
    loanForm.save()
    .then(()=> {
        let transporter = nodemailer.createTransport ({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Loan Request Successful",
            html: `
                <h3>Your Loan Request is been process</h3>
                <h5>Loan details:</h5>
                <p>
                    <strong>LOAN PURPOSE:</strong>
                    <span>${purpose}</span>
                </p>
                <p>
                    <strong>AMOUNT REQUESTED:</strong>
                    <span>${amount}</span>
                </p>
                <p>
                    <strong>LOAN INTEREST AMOUNT:</strong>
                    <span>${interest}</span>
                </p>
                <p>
                    <strong>TOTAL AMOUNT:</strong>
                    <span>${+amount + +interest}</span>
                </p>
                <p>
                    <strong>LOAN DURATION:</strong>
                    <span>${duration}</span>
                </p>
                <p>
                    <strong>PAYMENT METHOD:</strong>
                    <span>${paymentMethod}</span>
                </p>         
            `
        }
        transporter.sendMail(mailOptions, (err, info)=> {
            if (!err) {
                res.send({success: true, message: "Request Successful"});
            } else {
                throw err;
            }
        })
    })
}

const getPendingLoan =(req, res)=> {
    let { username } = req.body;
    requestModel.find()
    .then(allRequest => {
        let userLoanRequest = allRequest.filter(request => request.user == username);
        if (userLoanRequest) {
            res.send({status: true, userLoanRequest});
        } else {
            res.send({status: false});
        }
    })
}

const editLoan =(req, res)=> {
    let { amount, purpose, paymentMethod, duration, id } = req.body;
    let interest = amount / 100 * 10;
    let editForm = {amount, purpose, paymentMethod, duration, interest };
    requestModel.findOneAndUpdate({id}, editForm)
    .then(()=> {
        res.send({success: true});
    })
}

const deleteLoan =(req, res)=> {
    let { id } = req.body;
    requestModel.deleteOne({_id: id})
    .then(()=> {
        res.send({success: true});
    })
}

const getAcceptedLoan =(req, res)=> {
    let { username } = req.body;
    acceptModel.find()
    .then(acceptedLoan => {
        let loanAccepted = acceptedLoan.filter(accept => accept.user == username);
        if (loanAccepted) {
            res.send({success: true, loanAccepted});
        } else {
            res.send({success: false});
        }
    })
}

const loanPayment =(req, res)=> {
    console.log(req.body);
}

module.exports = { register, confirmIDs, login, getProfile, requestLoan, getPendingLoan, editLoan, deleteLoan, getAcceptedLoan, loanPayment };