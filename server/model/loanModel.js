const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRound = 10;

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    username: String,
    bvnNo: String,
    dob: String
})

userSchema.pre('save', function (next) {
    const document = this;
    bcrypt.hash(document.password, saltRound, (err, hashedPassword) => {
        if (!err) {
            document.password = hashedPassword;
            next();
        } else {
            throw err;
        }
    })
})

userSchema.methods.validatePassword = function (password, callback) {
    const document = this;
    bcrypt.compare(password, document.password, (err, same)=> {
        if (!err) {
            callback(err, same);
        } else {
            next();
        }
    })
}

const loanRequestSchema = mongoose.Schema ({
    amount: Number,
    duration: Number,
    interest: Number,
    paymentMethod: String,
    user: String,
    status: String,
    purpose: String
})

const loanAcceptSchema = mongoose.Schema ({
    amount: Number,
    duration: Number,
    interest: Number,
    paymentMethod: String,
    user: String,
    status: String,
    purpose: String
})

const loanRejectSchema = mongoose.Schema ({
    amount: Number,
    duration: Number,
    paymentMethod: String,
    user: String,
    status: String,
    purpose: String
})

const loanPaymentSchema = mongoose.Schema ({
    firstName: String,
    lastName: String,
    email: String,
    amount: Number,
    ref: String
})

const userModel = mongoose.model("loanUsers", userSchema);
const requestModel = mongoose.model("loanRequest", loanRequestSchema);
const acceptModel = mongoose.model("loanAccept", loanAcceptSchema);
const rejectModel = mongoose.model("loanReject", loanRejectSchema);
const paymentModel = mongoose.model("loanPayment", loanPaymentSchema);

module.exports = { userModel, requestModel, acceptModel, rejectModel, paymentModel };