import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordToken";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function PATCH(request:Request){
  //first get email id and 
  //perform check on email id
  //check email id present in the dataBase or verified or not 
  //if not verified then give error to user
  // if it's verified then create 6 digit otp and save it in the forgot password token and set expiry
  //send forgot password email to with prop email,userName,otp 
  await dbConnect();
  try {
    const body = await request.json();
    const {userName} = body;
    if(!userName){
       return Response.json(
        { success: false, message: "email id are required" },
        { status: 400 }
      );
    }
    const user = await UserModel.findOne({userName});
    if(!user){
      return Response.json(
        { success: false, message: "user is not present" },
        { status: 404 }
      );
    }
    if(!user.isVerified){
      return Response.json(
        { success: false, message: "email id is not verified" },
        { status: 400 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now()+ 60*10*1000); //10 minutes 
    
    user.forgotPasswordVerifyCode = verifyCode;
    user.forgotPasswordVerifyCodeExpiry= expiry;
    await user.save();
    const emailResponse = await sendForgotPasswordEmail(user.email, userName, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: "failed to send forgot password email" },
        { status: 500 }
      );
    }
    return Response.json(
      { success: true, message: "forgot password email sent successfully" },
      { status: 200 }
    );
  } catch (error:any) {
    console.error("error in forgot-password route:", error);
    return Response.json(
      { success: false, message: "server error" },
      { status: 500 }
    );
  }

}