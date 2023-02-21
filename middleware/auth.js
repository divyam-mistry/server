import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token){
            return res.status(403).send("Access Denied");
        }
        // token format: "Bearer xxxxxxxx...xxx";
        if(token.startsWith("Bearer ")){
            // fetch actual token
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        next();
        
    } catch (err) {
        console.log('Error: ', err);
        res.status(500).json({
            error: err.message
        });
    }
};