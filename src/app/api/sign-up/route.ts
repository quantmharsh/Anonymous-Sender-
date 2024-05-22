import dbConnect from "@/app/lib/dbConnect";
//db connection is required in every route because next js runs on edge 
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { REPLCommand } from "repl";
import { messageSchema } from "@/schemas/messageSchema";

export async function  POST(request:Request)
{
    await dbConnect();
    try {
        const{username ,email , password }=await request.json()
        // in db find whether user exists with this username or not and whether its verified or not
        
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username ,
            isVerified:true
        })
        if(existingUserVerifiedByUsername)
            {
                return Response.json({
                    success:false,
                    message:"Username is already taken 🥲"
                },{
                    status:400
                })
            }
            // now if user is not their .then find by email 
            const existingUserByEmail=await UserModel.findOne({
                email
            })
            //generating verification code
            const verifyCode=Math.floor(100000+Math.random()*900000).toString();
            
            if(existingUserByEmail)
                {
                    //  return true;  // TODO
                     //user exist with this email id but is also verified  
                    if(existingUserByEmail.isVerified)
                        {
                            return Response.json({
                                success:false,
                                message:"User already exists with this email "
                            },
                        {
                            status:401
                        }) 
                        }
                        //user exist with this email id but is not verified  
                        else{
                            const hashedPassword=await bcrypt.hash(password , 10)
                            //overrride the pasword fill . this means user exists but may hae forgotten password so override new password
                            existingUserByEmail.password=hashedPassword
                            existingUserByEmail.verifyCode=verifyCode
                            existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                            await existingUserByEmail.save();


                        }
                }
                //IF NO user found then add it in db 
                else{
                    const hashedPassword=await  bcrypt.hash(password ,10);
                    //getting expiry time of verification token 
                    const expiryDate= new Date();
                    //add 1 hr to the current time which will be valid period for token 
                    expiryDate.setHours(expiryDate.getHours()+1);
                    const newUser= await  new UserModel({
                        username,
                        email,
                        password:hashedPassword,
                        verifyCode,
                        verifyCodeExpiry:expiryDate,
                        isVerified:false ,
                        isAcceptingMessage:true,
                        // all message in form of array
                        messages:[]
                    })
                    await newUser.save()

                    //sending verification  code on email
                     const emailResponse= await sendVerificationEmail(email,
                        username ,
                        verifyCode
                    )
                    if(!emailResponse)
                        {
                            return Response.json({
                                success:false,
                                message:"Unable to get email response "
                            },
                        {
                            status:500
                        }) 
                        }
                        else{
                            return Response.json({
                                success:true,
                                message:"User registered successfully please verify the email  "
                            },
                        {
                            status:201
                        }) 

                        }


                }
        
    } catch (error) {
        console.error("Error while registering user", error)
        return Response.json({
            success:false,
            message:"Error Registering user"
        },{
            status:500
        })
        
    }
}