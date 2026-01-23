// backend/models/myModel.js
import mongoose from "mongoose";

// Define the schema for the model
const userSchema = new mongoose.Schema({
    googleID : {type: String, required : true},
    name : String,
    email : String,
    avatar : String,
    createdAt : { type : Date, default : Date.now},
})

// Export the model
export default mongoose.model("MyModel", userSchema);
