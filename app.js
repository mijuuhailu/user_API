
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require ('./routes/userRoutes')

const app = express()

app.use(express.json())
app.use(authRoutes)
app.use(userRoutes)

module.exports = app



