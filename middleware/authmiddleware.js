const jwt = require("jsonwebtoken")
const authMiddleware = (req, res,next)  =>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).json({
            message: "no token provided"
        })
    }
    const token = authHeader.split(" ")[1]
    console.log("header from request", authHeader)
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        console.log("user assigned from request", req.user)
        next()

    }catch(error){
        return  res.status(401).json({
            message: "invalid token"
        })
    }
    
}

module.exports = authMiddleware