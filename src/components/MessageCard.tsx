'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Clock } from 'lucide-react';
import { Message } from '@/model/User.model';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/apiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="group bg-linear-to--br from-gray-800/40 to-gray-900/40 backdrop-blur-md border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-gray-100 leading-relaxed wrap-break-words">
              {message.content}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant='ghost' 
                size="icon"
                className="shrink-0 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Message?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. This will permanently delete this anonymous message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-500 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</span>
        </div>
      </CardContent>
    </Card>
  );
}