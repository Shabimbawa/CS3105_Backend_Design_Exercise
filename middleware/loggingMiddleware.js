const loggingMiddleware = (req,res,next) =>{
    
    const method = req.method; 
    const route = req.path || req.url; 
    const timeStamp = new Date().toISOString();
    
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`${method}, ${route}, [${timeStamp}],Client IP: ${clientIp} `);

    next();
}

module.exports = loggingMiddleware