import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
 
  
  const _user: User = session?.user as User;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  
  
  const userId = _user._id;
  try {
   
    const user = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$messages" },
      { $sort: { "messages.created.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();
    if (!user || user.length === 0) {
      return Response.json(
        { message: "Messages not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Messages received",
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("error while getting a messages", error.message);
    return Response.json(
      { success: false, message: "Error while getting a messages" },
      { status: 500 }
    );
  }
}
