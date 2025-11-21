import UserModel from "@/model/User.model";
import {getServerSession} from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/option"; 
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = user._id;

  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessage,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status changed succesfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const getUser = await UserModel.findById(userId);
    if (!getUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: false,
        isAccepting: getUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while get message acceptance status", error);
    return Response.json(
      { success: false, message: "Error while get message acceptance status" },
      { status: 500 }
    );
  }
}
