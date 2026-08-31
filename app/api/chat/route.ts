import { prisma } from "@/lib/db";
import { MessageRole } from "@/lib/generated/prisma/enums";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { convertToModelMessages, createIdGenerator, streamText } from "ai";
import { NextRequest } from "next/server";

/*  this createOpenRouter adapter helps to communicate with openrouter api's without directly making call to any LLM */
const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
})

/* helper fns */

/* Convert db msg to UI fornat for AI SDk */
function dbMessageToUI(msg) {
  try {
    const parts = JSON.parse(msg.content);
    const textParts = parts.filter((p) => p.type === "text");

    if (textParts.length === 0) return null;

    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: textParts,
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.createdAt,
    };
  }
}

const generateMessageId = createIdGenerator({prefix:"msg" , size:16})

/* Convert message parts to JSON string for DB storage  */
function partsToJSON(message: { parts?: unknown; content?: string }) {
  if (Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }
  return JSON.stringify([{ type: "text", text: message.content ?? "" }]);
}

/* Fallbac conversion when AI SD conversn fails */
function fallbackConversion(messages){
    return messages
        .map((msg) => ({
            role: msg.role,
            content: msg.parts
                .filter((p) => p.type === 'text')
                .map((p) => p.text)
                .join('\n')
        }))
        .filter((m) => m.content)
}


export async function POST(req:NextRequest){
    try {
        const {chatId, messages: newMessages, model, skipUserMessage} = await req.json()

        // 1. Load previous msgs from db
        const dbMsgs = await prisma.message.findMany({
            where: {chatId},
            orderBy: {
                createdAt: 'asc'
            }
        })

        // 2. Convert to Ui format and combine with new msgs
        const previousUI = dbMsgs.map(dbMessageToUI).filter(Boolean)
        const newUI = Array.isArray(newMessages) ? newMessages : [newMessages]
        const allMessages = [...previousUI, ...newUI]
        
        let modelMessages = await convertToModelMessages(allMessages)

        const result = streamText({
            model: openRouter.chat(model),
            system: CHAT_SYSTEM_PROMPT,
            messages: modelMessages
        })

        return result.toUIMessageStreamResponse({
            sendReasoning: true,
            originalMessages: allMessages,
            onFinish: async({responseMessage}) => {
                try {
                    const messageToSave = [];

                    // save user msg
                    if(!skipUserMessage){
                        const lastUserMsg = newUI[(newUI.length = 1)];
                        if(lastUserMsg?.role === 'user'){
                            messageToSave.push({
                                chatId,
                                content: partsToJSON(responseMessage),
                                messageRole: MessageRole.USER,
                                messageType: 'NORMAL',
                                model
                            })
                        }
                    }

                    // save assistant msg
                    if(responseMessage?.parts?.length > 0){
                        messageToSave.push({
                            chatId,
                            content: partsToJSON(responseMessage),
                            messageRole: MessageRole.ASSISTANT,
                            messageType: 'NORMAL',
                            model
                        })
                    }

                    if(messageToSave.length > 0){
                        await prisma.message.createMany({data: messageToSave})
                    }

                } catch (error) {
                    console.error("Error saving messages", error)
                }
            }
        })

    } catch (error) {
        console.error("Chat API error:", error);
        return Response.json(
            { error: (error as Error).message || "Internal server error"},
            { status: 500}
        )
    }
}