import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { success, z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnet();
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams);

    const queryParam = {
      userName: searchParams.get("userName"),
    };
    console.log(queryParam);

    const result = UserNameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const userNameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors.join(", ")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }
    console.log(result);

    const { userName } = result.data;
    const existingVerifyUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingVerifyUser) {
      return Response.json(
        {
          success: false,
          message: "UserName is aleready taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "UserName is available",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while checking userName" + error.message);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
