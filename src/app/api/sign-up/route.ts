import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    if (!body.userName || !body.email || !body.password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const { userName, email, password } = body;

    // Prepare reusable values
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // ----------------------------------------------------------------
    // 1️⃣ CHECK USERNAME FIRST
    // ----------------------------------------------------------------
    const existedUsername = await UserModel.findOne({ userName });

    if (existedUsername) {
      if (existedUsername.isVerified) {
        // CASE 1: Username already taken by a verified user
        return Response.json(
          { success: false, message: "Username is already taken" },
          { status: 400 }
        );
      }
       console.log("userName exist bt not verified");
      // CASE 2: Username exists but unverified → REUSE THIS USER
      existedUsername.email = email;
      existedUsername.password = hashPassword;
      existedUsername.verifyCode = verifyCode;
      existedUsername.verifyCodeExpiry = expiry;
      await existedUsername.save();

      // send verification email
     const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

      return Response.json(
        {
          success: true,
          message: "Verification code sent again. Please verify your account.",
        },
        { status: 200 }
      );
    }

    // ----------------------------------------------------------------
    // 2️⃣ USERNAME DOES NOT EXIST → CHECK EMAIL
    // ----------------------------------------------------------------
    const existedEmail = await UserModel.findOne({ email });

    if (existedEmail) {
      if (existedEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }
      console.log("email exist bt not verified");
      
      // CASE: Email exists but unverified → update this record
      existedEmail.userName = userName;
      existedEmail.password = hashPassword;
      existedEmail.verifyCode = verifyCode;
      existedEmail.verifyCodeExpiry = expiry;
      await existedEmail.save();
    } else {
      // ----------------------------------------------------------------
      // 3️⃣ CREATE NEW USER
      // ----------------------------------------------------------------
      await UserModel.create({
        userName,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
    }

    // ----------------------------------------------------------------
    // SEND VERIFICATION EMAIL
    // ----------------------------------------------------------------
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while registering user", error);
    return Response.json(
      { success: false, message: "Error while registering user" },
      { status: 500 }
    );
  }
}
