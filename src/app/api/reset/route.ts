import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { verifyCode, userName, newPassword } = body;
    console.log(userName);
    

    // validate incoming fields
    if (!userName) {
      return Response.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const user = await UserModel.findOne({ userName });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isValid = user.forgotPasswordVerifyCode === verifyCode;
    const isCodeExpired = new Date(user.forgotPasswordVerifyCodeExpiry) > new Date();

    // Step 1: verifying OTP only (no new password yet)
    if (!newPassword) {
      if (isValid && isCodeExpired) {
        return Response.json({ success: true, verified: true, message: "OTP verified" }, { status: 200 });
      }

      if (!isCodeExpired) {
        return Response.json({ success: false, message: "Code expired" }, { status: 400 });
      }

      return Response.json({ success: false, message: "Invalid code" }, { status: 400 });
    }

    // Step 2: save new password
    if (newPassword && isValid && isCodeExpired) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;

      user.forgotPasswordVerifyCode = "";

      await user.save();

      return Response.json({ success: true, message: "Password changed" }, { status: 200 });
    }

    return Response.json({ success: false, message: "Invalid attempt" }, { status: 400 });

  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
