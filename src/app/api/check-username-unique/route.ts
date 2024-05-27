import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from "zod"
//whenever we use zod then we also need  schema 
//we are  getting this schema from schemas folder
//for validating username we are using usernamevalidation schmea that we have made

const usernameQuerySchmea= z.object({
    username:usernameValidation
})
//we are making this GET  function to check  username  while user entering it. 
//it will  be checked before clickin on the button
export async  function GET(request:Request)
{
    await dbConnect();
    try {
        //we are getting all parameters 

        const{searchParams}= new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }
        // validating it using zod
       const result= usernameQuerySchmea.safeParse(queryParam)
       console.log("result ", result)
       if(!result.success)
        {
            const usernameErrors=result.error.format().username?._errors ||[]
            return Response.json({
                success:false,
                message:"Invalid query parameters"
            },
        {
            status:400
        })
        }
       
        
    } catch (error) {
        console.log("Error while checkin username" ,error)
        return Response.json ({
            success:false,
            message:"Error while checking username"

        },
    {
        status:500
    })
        
    }
}