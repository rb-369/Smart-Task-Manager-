const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    googleId: String,  // OAuth Google ID
    authMethod: {
        type: String,
        enum: ['email', 'google'],
        default: 'email'
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)