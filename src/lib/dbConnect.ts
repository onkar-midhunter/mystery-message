import mongoose from "mongoose";
import { number } from "zod";
type connectionObject = {
  isConnected?: number;
};

const connection:connectionObject = {};

async function dbConnect():Promise<void>{
  if(connection.isConnected){
    console.log("Aleready connected to the database");
    return
    
  }
  try {
   const db = await mongoose.connect(process.env.MONGODB_URI || '',{});
   
   
   connection.isConnected = db.connections[0].readyState;
   console.log("succesfully database connected");
   
  } catch (error) {
    console.error('database connection failed',error)
    process.exit(1)
  }
}

export default dbConnect;