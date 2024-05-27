import { resend } from "@/app/lib/resend";
import  VerificationEmail from  "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
    email:string ,
    username:string,
    verifyCode:string
    // this function is returning promise which is of type ApiResponse(it should have all field which are their in ApiResponse)
):Promise<ApiResponse>{
    try {
        console.log("Email is" ,email);
        await resend.emails.send({
         
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code for Anonymous sender',
            react: VerificationEmail({username ,otp:verifyCode}),
          });
        return {
            success:true,
            message:"Verification code sent successfully. 🎉"
            
        }
        
    } catch (error) {
        console.log("Unable to  send Verification code ")
        return {
            success:false,
            message:"Unable to send  Verification code."
        }
    }
    

}