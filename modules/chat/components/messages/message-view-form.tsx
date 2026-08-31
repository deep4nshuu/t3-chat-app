"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useAiModels } from '../../hooks/use-ai-models';
import { useGetChatById } from '../../hooks/use-chats';
import { Spinner } from '@/components/ui/spinner';

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { ModelSelector } from '../chat-view/model-selector';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning';


function parseMessageToUI(msg){
    const basePart = {type: 'text', text: msg.content};

    try {
       const parts = JSON.parse(msg.content);

       return {
        id: msg.id,
        role: msg.messageRole.toLowerCase(),
        parts: Array.isArray(parts) ? parts : [basePart],
        createdAt: msg.createdAt
       }
    } catch (error) {
        return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: [basePart],
            createdAt: msg.createdAt
        }
    }
}

// this fn shows the msg or chat sent by user in message form but not ai response
function MessagePart({part, messageId, partIndex, role}){
    const key = `${messageId}-${partIndex}`

    if(part.type === 'text'){
        return (
            <Message from={role} key={key}>
                <MessageContent>
                    <MessageResponse>{part.text}</MessageResponse>
                </MessageContent>
            </Message>
        )
    }

    if(part.type === 'reasoning'){
        return (
            <Reasoning
                className={'max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50'}
                key={key}
            >
                <ReasoningTrigger />
                <ReasoningContent className={'mt-2 italic font-light text-muted-foreground'}>
                    {part.text}
                </ReasoningContent>
            </Reasoning>
        )
    }

    if(part.type === 'step-start' && partIndex > 0){
        return (
            <div key={key} className='my-4 text-gray-500'>
                <hr className='border-gray-300' />
            </div>
        )
    }

    return null;
}


const MessageViewWithForm = ({chatId}:string) => {
  
  const router = useRouter();
  const searchParams = useSearchParams()

  const shouldAutoTrigger = searchParams.get('autoTrigger') === 'true';
  const hasAutoTrigger = useRef(false)

  const [selectedModel, setSelectedModel] = useState(null)
  const [input, setInput] = useState("")

  const { data: models, isPending: isModelLoading} = useAiModels();
  const {data, isPending} = useGetChatById(chatId)

  const initialMessages = useMemo(() => {
    if(!data?.data?.messages) return [];

    return data.data.messages
    .filter((msg) => msg.content?.trim() && msg.id)
    .map(parseMessageToUI)
  }, [data])

  // if we have any default models selected, set that model to it
  useEffect(() => {
    if(data?.data?.model && !selectedModel){
        setSelectedModel(data.data.model)
    }
  }, [data, selectedModel])
  
  if(isPending){
    return (
        <div className='flex items-center justify-center h-full'>
            <Spinner />
        </div>
    )
  }

  const handleSubmit = () => {}
  const isStreaming = false;

  const allMessages = [...initialMessages];

  return (
    <div className='max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]'>
        <div className='flex flex-col h-full'>
            {/* Messages */}
            <Conversation className='h-full'>
                <ConversationContent>
                    {allMessages.length === 0 ? (
                        <div className='flex items-center justify-center h-full text-gray-500'>
                            Start a conversation...
                        </div>
                    ) : (
                        allMessages.map((message) => (
                            <Fragment key={message.id}>
                                {message.parts.map((part, i) => (
                                    <MessagePart 
                                        key={`${message.id}-${i}`}
                                        part={part}
                                        messageId={message.id}
                                        partIndex={i}
                                        role={message.role}
                                    />
                                ))}
                            </Fragment>
                        ))
                    )} 
                </ConversationContent>
            </Conversation>

            {/* Input */}
            <PromptInput onSubmit={handleSubmit} className='mt-4'>
                <PromptInputBody>
                    <PromptInputTextarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Type your message...'
                        disabled={false}
                    />
                </PromptInputBody>

                <PromptInputFooter>
                    <PromptInputTools className='flex items-center justify-center gap-2 w-full'>
                        <div className='flex-1'>
                            {isModelLoading ? (
                                <Spinner />
                            ) : (
                                <ModelSelector
                                    models={models?.models}
                                    selectedModelId={selectedModel}
                                    onModelSelect={setSelectedModel}
                                />
                            )}
                        </div>
                        <PromptInputSubmit status='ready' />
                    </PromptInputTools>
                </PromptInputFooter>
            </PromptInput>
        </div>
    </div>
  )
}

export default MessageViewWithForm
