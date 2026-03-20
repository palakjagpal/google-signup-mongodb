import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

// Create a new router
//It initializes a new router object using Express's Router class
const router = express.Router();

// Test route to check if the auth route is working
//This route responds with a simple message to confirm that the authentication route is functioning correctly.
router.get("/test", (req,res) => {
    res.send("Auth route is connected and working properly");
})

//Step 1: Google OAuth route
//This route initiates the Google OAuth authentication process using Passport.js.
// It specifies the scopes "profile" and "email" to request access to the user's basic profile information and email address from Google.
//It works by redirecting the user to Google's OAuth consent screen.
//It uses the passport.authenticate middleware to handle the authentication flow.   
//This middleware takes care of redirecting the user to Google and handling the response.
router.get("/google", passport.authenticate("google", {
    scope : ["profile", "email"]
})
);

// Step 2: Google OAuth callback route
//This route handles the callback from Google after the user has authenticated.
// It uses passport.authenticate middleware to process the authentication response from Google.
// If authentication is successful, it generates a JWT token for the authenticated user.
// The token includes the user's id and email, is signed with a secret key, and has an expiration time of 7 days. 
// The generated token can then be sent to the client for use in subsequent authenticated requests.
//It does not create a session (session: false) since JWT is being used for stateless authentication.
//It responds with the generated JWT token.
//This token can then be used by the client to authenticate future requests to protected routes.
//It uses the jwt.sign method to create the token.
//This method takes three arguments: the payload (user id and email), the secret key, and options (expiration time).  
router.get("/google/callback", passport.authenticate("google", {session : false}), (req,res) => {
    const token = jwt.sign(
        {id : req.user._id, email : req.user.email},
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    );

    // Send the token to the client (you can also redirect or respond with JSON)
    // Here, we are redirecting to a frontend URL with the token as a query parameter
    // This allows the frontend to easily retrieve the token after successful authentication
    // The FRONTEND_URL is typically defined in environment variables for security and flexibility
    // The token can then be extracted from the URL by the frontend application
    //It uses res.redirect to send the user to the specified URL with the token included as a query parameter.
    //This is useful for passing the token to the frontend application after successful authentication.
    //The frontend can then use this token for subsequent authenticated requests.
    /*res.redirect(`${process.env.FRONTEND_URL}/success.html?token=${token}`);*/
    res.redirect(`${process.env.FRONTEND_URL}/success?token=${token}`);
});


export default router;