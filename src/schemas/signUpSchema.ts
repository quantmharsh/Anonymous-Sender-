import {z} from 'zod';

//only checking useename
export const usernameValidation= z
    .string()
    .min(4,"username must be atleast 4 characters")
    .max(8,"username must be at max 8 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters")


    // since we have to check 3 fields usernae , email ,password so we are using object 
export const signUpSchema=z.object({
     username:usernameValidation,
     email:z.string().email({message:"Invalid email message"}),
     password:z.string().min(3,{message:"Password must be at least 3 characters"})

})