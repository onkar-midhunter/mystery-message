"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Lock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function SignUpPage() {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUserName, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUniqueness = async () => {
      if (userName) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(
            `/api/check-userName-unique?userName=${userName}`
          );
          setUserNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(
            axiosError?.response?.data.message ??
              "Error while checking userName"
          );
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };
    checkUserNameUniqueness();
  }, [userName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: response.data.success ? "Success" : "Error",
        description: response.data.message,
      });
      router.replace(`/verify/${userName}`);
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "SignUp Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameAvailable = userNameMessage === "UserName is available";

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-400 mb-2">
              Join True Feedback
            </h1>
            <p className="text-gray-400">Start your anonymous adventure today</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Username</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                      <Input
                        placeholder="Choose a username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                      {isCheckingUserName && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-400" />
                      )}
                      {!isCheckingUserName && userNameMessage && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isUsernameAvailable ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {!isCheckingUserName && userNameMessage && (
                      <p
                        className={`text-sm mt-1 flex items-center gap-1 ${
                          isUsernameAvailable
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {userNameMessage}
                      </p>
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input 
                        {...field} 
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      We'll send you a verification code
                    </p>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input 
                        type="password" 
                        {...field} 
                        name="password"
                        placeholder="Create a strong password"
                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800/50 px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1">
                Sign in instead
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
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

export default SignUpPage;