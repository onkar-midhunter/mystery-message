import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "mystery message | verification code",
      react: VerificationEmail({ username: userName, otp: verifyCode }),
    });
    return {
      success: true,
      message: "verification email send succesfully ",
    };
  } catch (emailerror: any) {
    console.error("error sending verification email", emailerror);
    return {
      success: false,
      message: "failed to send verification email",
    };
  }
}
