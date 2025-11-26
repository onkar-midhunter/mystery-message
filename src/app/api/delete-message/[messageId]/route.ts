import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/model/User.model";

export async function DELETE(
  request: Request,
  context: { params: { messageId: string } }
) {
  const messageId = context.params.messageId;
  console.log("message Id :", messageId);

  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "not authenticated" },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
