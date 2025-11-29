'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleForgotPassword = async () =>{
    setLoading(true);
    try {
      const res = await axios.patch<ApiResponse>('/api/forgot-password',{userName});
      toast({
        title: "successfully otp send to the email",
        description: res.data.message
      })
      router.push(`/reset/${userName}`)
    } catch (error) {
       console.error("error in forgot password", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "forgot password failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }
  return (
     <div className="bg-gray-700 w-full h-screen flex flex-col justify-center items-center text-white px-4">
      <h2 className="absolute top-10 text-3xl lg:text-5xl font-bold text-center">
        Enter Your Email to Reset Password
      </h2>
       <div className="relative mt-16 flex gap-2 items-center w-full max-w-md">
        <Input
          type="text"
          placeholder="Email"
          className="bg-gray-900 border-gray-600 text-white"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <Button
          onClick={handleForgotPassword}
          disabled={loading || !userName}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <ArrowBigRight />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
