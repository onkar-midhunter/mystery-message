"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
function page() {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUserName = useDebounceValue(userName, 300);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const from = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUniqueness = async () => {
      if (debouncedUserName) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(
            `/api/check-userName-unique?userName=${debouncedUserName}`
          );
          console.log(response);

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
  }, [debouncedUserName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: response.data.success ? "sucess" : "unsuccess",
        description: response.data.message,
      });
      router.replace(`/verify/${userName}`);
    } catch (error) {
      console.error("error in signup of user",error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"signUp failed",
        description:errorMessage,
        variant:"destructive"
      })
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div>
        
      </div>
   );
}

export default page;
