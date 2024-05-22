import mongoose ,{Schema ,Document } from "mongoose";
// Document for type safety since using typescript in js it is not required

export interface Message extends Document{
    content:string,
    createdAt:Date
}
// const messageSchema : string= new Schema({

// })

// when using TS we are using interface of it .provides type safety
const MessageSchema :Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    } ,
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }

})
export interface  User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean ,
    isAcceptingMessage:boolean
    // all message in form of array
    messages:Message[]

}
const  UserSchema:Schema<User>= new Schema({
    username:{
        type:String,
        required:[true,"username is Required"],
        trim :true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true ,
        match:[/.+\@.+\..+/,"Please use a valid email address"]

    },
    password:{
        type: String,
        required:[true,"password is required"]
    },
    verifyCode:{
        type: String,
        required:[true,"verifyCode is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true,"verifyCode Expiry  is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    // it is an array with type MessageSchema. it have all field which are their in messageSchema
    messages:[MessageSchema]

})
// in Next.js to know whether previously have we created a model or not we are checking it
//if created then 1st part execute. otherwise model is created using mongoose.model
//its TS syntax 

const UserModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model("User",UserSchema)
export default  UserModel
