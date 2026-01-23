import express from "express";
import jwt from "jsonwebtoken";
import myModel from "../models/myModel.js";

// Create a new router 
const router = express.Router();

// Middleware to verify JWT token
// This middleware checks for the token in the Authorization header
// and verifies it. If valid, it attaches the user info to req.user.
// If invalid, it responds with a 401 Unauthorized status.
const verifyToken = async (req, res, next) => {
    try{
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        // Bearer <token>, the split part[1] gets the token part
        //The split method is used to split a string into an array of substrings based on a specified separator.
        // In this case, it splits the authorization header string at the space character (" ").
        // The result is an array where the first element (index 0) is "Bearer" and the second element (index 1) is the actual token.
        const token = authHeader && authHeader.split(" ")[1]; 

        // If no token is found, respond with 401
        if (!token) return res.status(401).json({
            message : "Access Denied. No token provided"
        })

        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info to req.user with the decoded token data done from myModel with the id field with method findById using await 
        //await is used to wait for the promise returned by findById to resolve before assigning the result to req.user.
        // This ensures that req.user contains the actual user data retrieved from the database.
        // This is important because database operations are asynchronous, and using await allows the code to pause execution until the data is available.
        // This way, when the next middleware or route handler accesses req.user, it has the correct user information.
        req.user = await myModel.findById(decoded.id);
    } catch(err){
        // If token is invalid, respond with 403
        res.status(403).json({
            message : "Invalid token"
        });
    }
};

// Protected route to get user info
// This route uses the verifyToken middleware to ensure that only authenticated users can access it.
// It responds with the user's id, name, email, and avatar. 
// If the user is not authenticated, it will respond with an error from the middleware.
router.get("/me", verifyToken, (req,res) => {
    res.json({
        id : req.user._id,
        name : req.user.name,
        email : req.user.email,
        avatar : req.user.avatar,
    });
});

// Export the router
export default router;