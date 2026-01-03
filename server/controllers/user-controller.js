
const Joi = require("joi");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


// to register a user

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})


const generateToken = (getId)=>{
    return jwt.sign({
        getId
    }, "DEFAULT_SECRET_KEY", {
        expiresIn: 3*24*60*60
    })
}

const registerUser = async (req, res, next) => {

    try {
        const { name, email, password } = await req.body;

        const { error } = registerSchema.validate({ name, email, password });

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error occurred" + error.details[0].message
            })
        }
        try{

            //check if user already exists
            const curUser = await User.findOne({email: email});

            if(curUser){
                return res.status(400).json({
                    success: false,
                    message: "User email already exists! Please try with different email id"
                })
            }

           // hash the user's Password
           const hashedPassword = await bcryptjs.hash(password, 12);

           const newUser = await User.create({
            name: name,
            email,
            password: hashedPassword
           });

           if(newUser){
            const token = generateToken(newUser?._id);

            res.cookie("token", token,{
                withCredentials: true,
                httpOnly: false
            })

            return res.status(201).json({
                success: true,
                message: "New User Registered Successfully!",
                data: newUser
            })

            next();
           }

        }catch(e){
            console.log(e);
            
            return res.status(500).json({
                success: false,
                message: "Some error occured :( "+ e
            })
        }
    } catch (e) {
        console.log(e);
         return res.status(500).json({
                success: false,
                message: "Some error occured :( "+ e
            })
    }
}

const loginUser = async (req, res, next) => {
    try{

        const {email, password} = req.body;

        const {error} = loginSchema.validate({email, password});

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error occurred" + error.details[0].message
            })
        }
        
        //check if user is registered
        const curUser = await User.findOne({email: email});

        if(!curUser || curUser.toString() === ""){

            return res.status(400).json({
                success: false,
                message: `The email ${email} is NOT register pls register before login!`
            })
        }

        //check if password is matching or not

        const passwordMatch = await bcryptjs.compare(password, curUser.password);
        //  console.log(passwordMatch.catch());
         
        if(!passwordMatch ){
           
            
            return res.status(400).json({
                success: false,
                message: "Password is incorrect!"
            })
        }

        
            const token = generateToken(curUser?._id);
        

        res.cookie("token", token,{
                withCredentials: true,
                httpOnly: false
            })

        return res.status(200).json({
            success: true,
            message: `User ${curUser?.name} Logged in Successfully!`,
            data: curUser
        })    

        next();

    }catch(e){
        console.log(e);
         return res.status(500).json({
                success: false,
                message: "Some error occured :( "+ e
            })
    }
}

const logoutUser = async (req,res,next) => {

    res.cookie("token", "", {
        withCredentials: true,
        httpOnly: false
    })

    return res.status(200).json({
        success:true,
        message: `User logged out Successfully!`
    })
    
}
module.exports = {registerUser,loginUser, logoutUser}