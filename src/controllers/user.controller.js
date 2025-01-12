import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadonCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    //upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    
     const {fullName, email, username, password} = req.body
     console.log("email: ", email);

    //  if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    //  }
    //  if(email === ""){
    //     throw new ApiError(400, "email is required")
    //  }
    //  if(username === ""){
    //     throw new ApiError(400, "username is required")
    //  }
    //  if(password === ""){
    //     throw new ApiError(400, "password is required")
    //  }
    //  function hasAtSymbol(email){
    //     return email.includes('@');

    //  }
    //  if(!hasAtSymbol(email)){
    //     throw new ApiError(400, "email should contain a @ symbol")
    //  }

     //or advance method or code
     if (
        [fullName, email, username, password].some((field) => 
        field?.trim() === "")
     ) {
         throw new ApiError(400, "All fields are required")
     }
     
     const existedUser = User.findOne({
        $or: [{ username }, { email }]
     })
     if (existedUser) {
        throw new ApiError(409, "User with email or username are already exist")
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;
     const coverImagePath = req.files?.coverImage[0]?.path;

     if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
     }

     const avatar = await uploadonCloudinary(avatarLocalPath)
     const coverImage = await uploadonCloudinary(coverImagePath)
    
     if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user =  await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })

        const createdUser = await user.findById(username._id).select(
            "-password -refreshToken" //select method jo nhi chahta hai use delt karta he
        )
        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user")
        }
     

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )

} )


export {
    registerUser,
} 
