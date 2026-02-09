const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuthVerification = async (req, res) => {

    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.json({
            success: false,
            message: "Invalid Token OR User not Authenticated login or register first to access"
        })
    }

    if (token) {
        try {

            const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");
            const curUserInfo = await User.findById(decoded.getId);

            if (curUserInfo) {
                return res.status(200).json({
                    success: true,
                    curUserInfo
                })
            }

        } catch (e) {
            return res.status(401).json({
                success: false,
                message: `Some error occurred:( ${e}`
            })
        }
    }
}
module.exports = { userAuthVerification };