import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnet();
  try {
    const body = await request.json();
    
    
    if (!body.verifyCode && !body.userName) {
      return Response.json(
        {
          success: false,
          message: "pls provide verify code",
        },
        {
          status: 400,
        }
      );
    }
    const { userName, verifyCode } = body;
   
    
    
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not available",
        },
        {
          status: 400,
        }
      );
    }
    const isValid = user.verifyCode === verifyCode;
    
    
    
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
   
    
    if(isValid && isCodeExpired){
      user.isVerified = true;
      await user.save();
      console.log("database save");
      
      return Response.json(
        {
          success: true,
          message: "user is verified Now",
        },
        {
          status: 200,
        }
      ); 
    }else if(!isCodeExpired){
      return Response.json(
        {
          success: false,
          message: "code expiry date is over please signup again || caution : userName might be available",
        },
        {
          status: 400,
        }
      ); 
    }else{
      return Response.json(
        {
          success: false,
          message: "code is incorrect",
        },
        {
          status: 400,
        }
      ); 
    }
  } catch (error: any) {
    console.error(error.message);
    return Response.json(
      {
        success: false,
        message: "errro while checking verify code",
      },
      {
        status: 500,
      }
    );
  }
}
