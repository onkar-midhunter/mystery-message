"use client"
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ShieldCheck, ArrowRight } from "lucide-react";

function VerifyAccount() {
  const params = useParams<{ userName: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues:{
      verifyCode:""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        userName: params.userName,
        verifyCode: data.verifyCode,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
    } catch (error) {
      console.error("error in Verify user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-4">
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-green-400 mb-2">
              Verify Your Account
            </h1>
            <p className="text-gray-400">
              Enter the verification code sent to your email
            </p>
            <p className="text-sm text-blue-400 mt-2">
              @{params.userName}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-gray-300 text-lg mb-4">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <InputOTP 
                        maxLength={6} 
                        {...field}
                        className="gap-3"
                      >
                        <InputOTPGroup className="gap-3">
                          <InputOTPSlot 
                            index={0}
                            className="w-12 h-14 text-xl bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                          />
                          <InputOTPSlot 
                            index={1}
                            className="w-12 h-14 text-xl bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                          />
                          <InputOTPSlot 
                            index={2}
                            className="w-12 h-14 text-xl bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                          />
                          <InputOTPSlot 
                            index={3}
                            className="w-12 h-14 text-xl bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                          />
                          <InputOTPSlot 
                            index={4}
                            className="w-12 h-14 text-xl bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                          />
                          <InputOTPSlot 
                            index={5}
                            className="w-12 h-14 text-xl bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-gray-500 text-center mt-4">
                      Please enter the 6-digit code sent to your email
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit"
                className="w-full bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-6 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-[1.02]"
              >
                Verify Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Didn't receive the code?{" "}
              <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Resend Code
              </button>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Check your spam folder if you don't see the email
        </p>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default VerifyAccount;