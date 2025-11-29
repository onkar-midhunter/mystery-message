import { resend } from "@/lib/resend";
import forgotPasswordEmail from "../../emails/forgotPasswordEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendForgotPasswordEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "mystery message | forgot Password code ",
      react: forgotPasswordEmail({ username: userName, otp: verifyCode }),
    });
    return {
      success: true,
      message: "forgot password email send succesfully ",
    };
  } catch (emailerror: any) {
    console.error("error sending Forgot password email", emailerror);
    return {
      success: false,
      message: "failed to send forgot password email",
    };
  }
}
