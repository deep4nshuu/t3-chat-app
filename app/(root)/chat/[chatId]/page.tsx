import MessageViewWithForm from '@/modules/chat/components/messages/message-view-form';
import React from 'react'

const ChatPage = async({params}: {
  params: Promise<{chatId: string}>
}) => {

  const {chatId} = await params;

  return (
    <MessageViewWithForm chatId={chatId} />
  )
}

export default ChatPage
