const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../db/db")
// const { findUserByEmail } = require("../models/userModel")


const registerUser = async (req,res) =>{
       try{
        const {name, email, password} = req.body
        console.log(name, email)

        const User = await pool.query("SELECT * FROM users WHERE email = $1",[email]);

            if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists."
            });
            }
        
        const hashedpassword = await bcrypt.hash(password,10)
        const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedpassword] )
        res.status(201).json({
            message: "user created succesfully",
            user:result.rows[0]
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
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found"
            })
        
        }
        const user = result.rows[0]

        console.log(result.rows)
        console.log(result.rows[0])

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