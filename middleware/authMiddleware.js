const jwt = require("jsonwebtoken");

const authenticateToken = async(req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(403).json({error: "Unauthorized access"});
    }
    const verifyToken= jwt.verify(token, 'SECRET_KEY');
    jwt.verify(token, 'SECRET_KEY', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid Token" }); // Send error response if token is invalid
        }
        req.user = user; // Attach user stored in token for use in viewProfile
        next(); 
    });

}   

module.exports = authenticateToken;