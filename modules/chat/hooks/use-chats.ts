import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage, deleteChat, getAllChats, getChatById } from "../actions";
import {toast} from 'sonner'

export const useGetChats = () => {
    return useQuery({
        queryKey: ['chats'],
        queryFn: getAllChats
    })
}

export const useGetChatById = (chatId:string) => {
    return useQuery({
        queryKey: ['chats', chatId],
        queryFn: () => getChatById(chatId)
    })
}

export const useCreateChat = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: createChatWithMessage,
        onSuccess: (res: any) => {
            if(res.success && res.data){
                queryClient.invalidateQueries({queryKey:['chats']});
                router.push(`/chat/${res.data.id}?autoTrigger=true`)
            }
        },
        onError: (error) => {
            console.error("Create chat error:", error);
            toast.error("Failed to create chat")
        }
    })
}


export const useDeleteChat = (chatId: string) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: () => deleteChat(chatId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['chats']});
            router.push('/')
        },
        onError: () => {
            toast.error("Failed to delete chat")
        }
    })
}