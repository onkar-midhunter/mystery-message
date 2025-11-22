import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest) {
  //check if use logged in
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  console.log("ALL COOKIES:", request.cookies.getAll());
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not logged in" },
      { status: 401 }
    );
  }

  const response = NextResponse.json(
    {
      success: true,
      message: "log out succesfully",
    },
    {
      status: 200,
    }
  );
  response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
  response.cookies.set("next-auth.callback-url", "", { maxAge: 0 });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 });
  console.log("after removing cookies");
  
  const token1 = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  console.log(token1);
  
  return response;
}
