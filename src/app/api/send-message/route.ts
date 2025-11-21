import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  const { userName, content } = await request.json();
  if (!userName && !content) {
    return Response.json(
      { success: false, message: "userName and content required" },
      { status: 400 }
    );
  }
  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return Response.json(
        { success: false, message: "User is not available" },
        { status: 400 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 } // 403 Forbidden status
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
