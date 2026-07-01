const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../db/db")
const { findUserByEmail ,createUser} = require("../models/userModel")


const registerUser = async (req,res) =>{
       try{
        const {name, email, password} = req.body
        console.log(name, email)

        const existingUser = await findUserByEmail(email)

            if(existingUser){
                return res.status(409).json({
                    message: "Email already exists."
                })
            }
        
        const hashedpassword = await bcrypt.hash(password,10)
       
        const result = await createUser(name, email, hashedpassword)

        res.status(201).json({
            message: "user created succesfully",
            user: result
        })
        console.log(hashedpassword, password)

    }catch(error)
        {
           res.status(500).json({
            message: 'Error creating user',
            error: error.message
           })
        }

}

const loginUser = async (req,res) =>{
     try {
        const { email, password } = req.body
        // console.log("user from request" , req.user)
        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        
        }
        // const user = result.rows[0]

        console.log(user)

        const isMatch = await bcrypt.compare(password, user.password )

        if(isMatch){
            const token = jwt.sign({
                id: user.id,
                email: user.email
            },process.env.JWT_SECRET,{
                expiresIn : "1h"
            })

            return res.json({
                meesage: "user successfully",
                token,
                user: {
                    id : user.id,
                    name : user.name,
                    email: user.email
                }
            })
        }else{
            return res.json({
                message: "Invalid email or password"
            })
        }
  
    } catch (error) {
        return res.status(500).json({
            message: "Error getting user",
            error: error.message
        })
    }
}


module.exports = { registerUser, loginUser }