import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}
//type of it is connectionobject and initialy it will be empty
const connection : ConnectionObject={}

async function dbConnect():Promise<void>{
    // if already connected todb
    if(connection.isConnected)
        {
            console.log("Already connected to database");
            return ;
        }
  try {
     const db = await mongoose.connect(process.env.MONGODB_URI||"",{})
     console.log(db)
    //  we are getting ready state and storing it in connection.isconnected so that we can know that we have connected successsfuly
     connection.isConnected=db.connections[0].readyState
     console.log("Db connected Successfully 🚀")
  } catch (error) {
    console.log("Unable to connect to Database",error)
    process.exit(1)
    
  }

}
export default dbConnect