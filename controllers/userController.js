const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// @desciption Register a user
// @routes POST users/register
// @access public

const registerUser = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error ("All the fields are mandatory")
    }
    // checking duplicacy of email
    const availableUser = await User.findOne({email});
    if (availableUser) {
        res.status(400);
        throw new Error("User already registered");
    };
    // hasing password 
    const hashedPassword = await bcrypt.hash(password, 10); //10 tells the number of salt rounds to hash pass and this method returns a promise hence await is used 
    console.log("hashedPassword:",hashedPassword);
    
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    });
    console.log(`User createed ${user}`);

    if(user){
        res.status(201).json({_id:user.id, email:user.email}); //201->resource created
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({message:"Register the user"});
});

// @desciption login a user
// @routes POST users/register
// @access public

const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if (!email || !password){
        res.status(400);//400->validation error
        throw new Error("All fields are mandatory");
    };

    const user = await User.findOne({email});
    // compare password with hashed password
    if (user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user : {
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
        );
        res.status(200).json({accessToken});
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

// @desciption Register a user
// @routes GET users/register
// @access private

const currentUser = asyncHandler(async (req,res) => {
    res.status(200);
    res.json(req.user);
});

module.exports = {registerUser,loginUser,currentUser};