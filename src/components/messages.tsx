import { useParams } from "react-router-dom";

import { Message } from "./message";
import { useMessages } from "../hooks/use-messages";

export function Messages() {
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error('Messages components must be used within room page')
  }

  const { messages } = useMessages(roomId)

  return (
    <ol className="list-decimal list-inside px-3 space-y-8">
      {messages.map((message) => {
        return (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            amountOfReactions={message.amountOfReactions}
            answered={message.answered} />
        )
      })}
    </ol>
  )
}