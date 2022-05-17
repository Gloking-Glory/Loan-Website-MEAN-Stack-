const { userModel, requestModel, acceptModel, rejectModel } = require('../model/loanModel');
const nodemailer = require('nodemailer');

const getLoanRequest =(req, res)=> {
    requestModel.find()
    .then(allRequest => {
        res.send(allRequest);
    })
}

const acceptRequest =(req, res)=> {
    let { id } = req.body;
    requestModel.findOne({_id: id}, (err, result)=> {
        if (result) {
            let { amount, purpose, paymentMethod, duration, user } = result;
            let loanInfo = {amount, purpose, paymentMethod, duration, user, status: "Accepted"};
            let accept = new acceptModel(loanInfo);
            accept.save()
            .then(()=> {
                userModel.findOne({username: user}, (err, result)=> {
                    let { email } = result;
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
                        subject: "Loan Request Accepted",
                        html: `
                            <h3>Your Loan Request is Accepted</h3>
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
                        if (err) {
                            throw err;
                        }
                    })
                })
                requestModel.deleteOne({_id: id})
                .then (()=> {
                    requestModel.find()
                    .then(request => {
                        res.send({success: true, message: "Loan Request Accepted", request});
                    })
                })
            })
        }
    })
}

const rejectRequest =(req, res)=> {
    let { id } = req.body;
    requestModel.findOne({_id: id}, (err, result)=> {
        if (result) {
            let { amount, purpose, paymentMethod, duration, user } = result;
            let loanInfo = {amount, purpose, paymentMethod, duration, user, status: "Rejected"};
            let reject = new rejectModel(loanInfo);
            reject.save()
            .then(()=> {
                userModel.findOne({username: user}, (err, result)=> {
                    let { email } = result;
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
                        subject: "Loan Request Rejected",
                        html: `
                            <h3>Your Loan Request is Rejected</h3>
                            <p>Dear ${user}, we have process your loan request and decided not to continue, we apologize for any incovenience. We hope you'll continue with us.</p>
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
                                <strong>LOAN DURATION:</strong>
                                <span>${duration}</span>
                            </p>
                            <p>
                                <strong>PAYMENT METHOD:</strong>
                                <span>${paymentMethod}</span>
                            </p>
                            <p>Please try again, your satisfaction is our priority. Thanks</p>     
                        `
                    }
                    transporter.sendMail(mailOptions, (err, info)=> {
                        if (err) {
                            throw err;
                        }
                    })
                })
                requestModel.deleteOne({_id: id})
                .then(()=> {
                    requestModel.find()
                    .then(request => {
                        res.send({success: true, message: "Loan Request Rejected", request});
                    })
                })
            })
        }
    })
}

const getAcceptedLoan =(req, res)=> {
    acceptModel.find()
    .then(accept => {
        res.send({accept});
    })
}

const getRejectedLoan =(req, res)=> {
    rejectModel.find()
    .then(reject => {
        res.send({reject});
    })
}

const delRejectedLoan =(req, res)=> {
    let { id } = req.body;
    rejectModel.deleteOne({_id: id})
    .then(()=> {
        rejectModel.find()
        .then(reject => {
            res.send({success: true, reject});
        })
    })
}

module.exports = { getLoanRequest, acceptRequest, rejectRequest, getAcceptedLoan, getRejectedLoan, delRejectedLoan }