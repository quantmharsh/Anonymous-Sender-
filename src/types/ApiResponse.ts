import { Message } from "@/model/User";
// it is the standard formate of our APiresponse.here everytime we are sending succes ,message
//and in some situations we are sending messages and iAcceptingMessages
export interface ApiResponse{
    success:boolean ,
    message:string ,
    isAcceptingMessages?:boolean,
    messages?:Array<Message>
}