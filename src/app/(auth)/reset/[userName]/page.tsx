"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

const ResetPage = () => {
  const { userName } = useParams<{ userName: string }>(); // ✅ Get email from URL
  const { toast } = useToast();
  const router = useRouter()
  const [otpVerified, setOtpVerified] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // OTP form
  const otpForm = useForm({
    defaultValues: { verifyCode: "" },
  });

  // Password form
  const passwordForm = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // =====================================
  //           SUBMIT OTP
  // =====================================
  const submitOtp = async (data: any) => {
    setOtpLoading(true);

    try {
      const res = await axios.post("/api/reset", {
        userName,
        verifyCode: data.verifyCode,
      });

      if (res.data.success) {
        toast({ description: "OTP Verified Successfully" });
        setOtpVerified(true);
      } else {
        toast({ variant: "destructive", description: res.data.message });
      }
    } catch {
      toast({ variant: "destructive", description: "Server error" });
    }

    setOtpLoading(false);
  };

  // =====================================
  //       SUBMIT NEW PASSWORD
  // =====================================
  const submitNewPassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({ variant: "destructive", description: "Passwords do not match" });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await axios.post("/api/reset", {
        userName,
        newPassword: data.newPassword,
        verifyCode: otpForm.getValues("verifyCode"),
      });

      if (res.data.success) {
        toast({ description: "Password changed successfully!" });
        setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
      } else {
        toast({ variant: "destructive", description: res.data.message });
      }
    } catch {
      toast({ variant: "destructive", description: "Server error" });
    }

    setPasswordLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        {!otpVerified ? (
          <>
            <h1 className="text-xl font-bold text-center">Enter OTP</h1>
            <p className="text-center text-sm text-gray-500 mb-4">
              OTP sent to <strong>{userName}</strong>
            </p>

            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(submitOtp)} className="space-y-6">

                {/* OTP INPUT */}
                <FormField
                  control={otpForm.control}
                  name="verifyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SUBMIT OTP */}
                <Button type="submit" disabled={otpLoading} className="w-full">
                  {otpLoading ? <span className="animate-spin">⏳</span> : "Verify OTP"}
                </Button>

              </form>
            </Form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-center">Set New Password</h1>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(submitNewPassword)} className="space-y-6">

                {/* NEW PASSWORD */}
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={passwordLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CONFIRM PASSWORD */}
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={passwordLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SUBMIT PASSWORD */}
                <Button type="submit" disabled={passwordLoading} className="w-full">
                  {passwordLoading ? <span className="animate-spin">⏳</span> : "Update Password"}
                </Button>

              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPage;
