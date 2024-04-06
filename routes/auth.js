const express = require('express')
const router = express.Router()
const bcrypt= require('bcrypt')

const User = require('../models/User')
const {getToken} = require('../utils/helper')

router.post("/register", async(req,res)=>{
    const {email,password,firstName,lastName,username} = req.body;

    // user with name already registered or not
    const user = await User.findOne({email:email})
    if(user){
        return res.status(403).json({
            status:403,
           error:"User already exist with this email address" 
        })
    }

    // valid user
    let hashedPassword = await bcrypt.hash(password,10);

    const newUserData= {
        email,
        password:hashedPassword,
        firstName,
        lastName,
        username
    };
    
    const newUser = await User.create(newUserData)
    
    const token = await getToken(email,newUser);          

    const userToReturn = {...newUser.toJSON(),token}
    delete userToReturn.password
    return res.status(200).json(userToReturn)

})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});

    // check email exist
    if(!user){
        return res.status(402).json({
            status:402,
            error:"Email not found"
        })
    }

    // check password correct

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(403).json({
            status:403,
            error:"Invalid Password"
        })
    }

    const token = await getToken(email,user)
    const userToReturn = {...user.toJSON(),token}
    delete userToReturn.password;
    res.status(200).json(
        userToReturn
    )


})

module.exports = router;