const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    let token = req.header.Authorization.split(" ")[1];
    if (token) {
        jwt.verify(token, secret, (err, decoded)=> {
            if (!err) {
                let email = decoded.email;
                next();
            } else {
                res.status(401).send({message: "Unauthorized"});
            }
        })
    } else {
        res.status(401).send({message: "Unauthorized"});
    }
}

module.exports = verifyToken;