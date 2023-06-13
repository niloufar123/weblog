const jwt=require('jsonwebtoken');

exports.authenticated=(req,res,next)=>{
    const authHeader=req.get('Authorization');
    try {
        if(!authHeader){
            const error=new Error("You do not have permission");
            error.statusCode=401;
            throw error
        }

        const token=authHeader.split(" ")[1]//bearer token =>['bearer','token']
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            const error=new Error("You do not have permission");
            error.statusCode=401;
            throw error
        }
        req.userId=decodedToken.user.userId;
        
        next();

    }
    
        
     catch (err) {
        next(err)
     }    
}