
const bcrypt = require("bcrypt");
const express = require('express')
const pool = require("./db/db")
const jwt = require("jsonwebtoken")
const authMiddleware = require("./middleware/authmiddleware")

const app = express()

app.use(express.json())



app.get('/', async (req,res) => {
    try{
        const result = await pool.query('SELECT * FROM users')
        res.json(result.rows)

    }catch (error){
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        })

    }
})

// app.post('/register',  async (req,res) => {
//     try{
//         const {name, email, password} = req.body
//         console.log(name, email)

//         const existingUser = await pool.query("SELECT * FROM users WHERE email = $1",[email]);

//             if (existingUser.rows.length > 0) {
//             return res.status(409).json({
//                 message: "Email already exists."
//             });
//             }
        
//         const hashedpassword = await bcrypt.hash(password,10)
//         const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
//             [name, email, hashedpassword] )
//         res.status(201).json({
//             message: "user created succesfully",
//             user:result.rows[0]
//         })
//         console.log(hashedpassword, password)

//     }catch(error)
//         {
//            res.status(500).json({
//             message: 'Error creating user',
//             error: error.message
//            })
//         }

// })

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body
        // console.log("user from request" , req.user)
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

        

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            })
        
        }
        const user = result.rows[0]

        const token = jwt.sign({
                id: user.id,
                email: user.email
            },process.env.JWT_SECRET,{
                expiresIn : "1h"
            })

        console.log(result.rows)
        console.log(result.rows[0])

        const isMatch = await bcrypt.compare(password, user.password )

        if(isMatch){
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

        // console.log(result.fields.map(field => field.name))

       
    } catch (error) {
        return res.status(500).json({
            message: "Error getting user",
            error: error.message
        })
    }
})

app.get("/profile", authMiddleware, (req,res) =>{
    res.json({
        message : "welcome"
    })
})

app.get('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const result = await pool.query("SELECT * FROM users WHERE id =$1", [userId])
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        res.json(result.rows[0])
        console.log("Get user by ID", result.command)

    }catch(error){
        res.status(500).json({
            message: 'Error retrieving user',
            error: error.message
        })
    }
})

app.delete('/users/:id', async (req, res) =>{
    try{
        const userId = parseInt(req.params.id)
        const result = await pool.query("DELETE FROM users WHERE id =$1", [userId])
        res.json({
            message: 'User deleted successfully'
        })
        console.log("Delete user", result)
    }catch(error){
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        })
    }

})

app.post('/users',  async (req,res) => {
    try{
        const {name} = req.body
        const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *',[name])
        
        res.status(201).json(result.rows[0])
        console.log(req)

    }catch(error)
        {
           res.status(500).json({
            message: 'Error creating user',
            error: error.message
           })
        }

})

app.patch('/users/:id' ,async (req,res) =>{
    try{
        const userId = parseInt(req.params.id)
        const { name } = req.body

        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
        if(user.rows.length === 0){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const result = await pool.query('UPDATE users SET name = $1 where id = $2 RETURNING *', [name, userId])
            return res.json(result.rows[0])
        


    }catch(error){
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        })

    }
})

app.listen('3000', ()=>{
    console.log('Server is running on port 3000')
})
