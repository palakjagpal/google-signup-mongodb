//Import the Google OAuth 2.0 strategy for Passport.js that allows authentication using Google accounts
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
//Import dotenv to manage environment variables
import dotenv from "dotenv";
//Import the user model to interact with the database
import myModel from "../models/myModel.js";
//Import passport to use its functionalities that manage authentication like strategies and sessions
import passport from "passport";

//Load environment variables from a .env file into process.env like API keys and secrets client ID, client secret, and callback URL
dotenv.config();

//Configure Passport to use the Google OAuth 2.0 strategy for authentication
//Use the passport.use() method to register a new authentication strategy with Passport
//The strategy is created using the GoogleStratergy constructor
//This strategy allows users to authenticate using their Google accounts
//The strategy requires configuration options and a callback function to handle the authentication process
//The configuration options include the client ID, client secret, and callback URL
//The callback function is called after Google has authenticated the user and receives the access token, refresh token, and user's profile information
//The callback function checks if the user already exists in the database and creates a new user if they do not exist
//Finally, the callback function calls the done function to complete the authentication process
//The done function is called with either an error or the authenticated user object
//This setup allows users to log in to the application using their Google accounts
passport.use(
    //Create a new Google OAuth 2.0 strategy instance to handle authentication with Google with the following configuration options that are passed as an object to the constructor
    new GoogleStrategy(
        {
            clientID : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            /*callbackURL : "http://localhost:3000/auth/google/callback",*/
            callbackURL : `${process.env.BASE_URL}/auth/google/callback`,
        },
         
        //This is a callback function that is called after Google has authenticated the user. It receives the access token, refresh token, and the user's profile information from Google
        //The async function allows us to perform asynchronous operations, such as database queries, within the callback function 
        async (accessToken, refreshToken, profile, done) => {
            try{
                //Check if a user with the given Google ID already exists in the database
                let user = await myModel.findOne({
                    googleID : profile.id // profile contains the user's information returned by Google
                });

                //If the user exists, call the done function to complete the authentication proces
                if(!user){
                    //If the user does not exist, create a new user in the database with the information from the Google profiles
                    user = await myModel.create({
                        //The googleID is set to the profile.id, which is the unique identifier for the user provided by Google
                        googleID : profile.id,
                        // name is set to profile.displayName, which is the user's full name as provided by Google
                        name : profile.displayName,
                        // email is set to profile.emails[0].value, which is the user's primary email address as provided by Google, [0] indicates the first email in the array of emails
                        email : profile.emails[0].value,
                        // avatar is set to profile.photos[0].value, which is the URL of the user's profile picture as provided by Google, [0] indicates the first photo in the array of photos
                        avatar : profile.photos[0].value,
                    })
                }

                //Call the done function to complete the authentication process, passing in the user object
                return done(null, user);
            }catch(err){
                //If an error occurs during the process, call the done function with the error
                return done(err, null);
            }
        }
    )
);