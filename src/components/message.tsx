import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { removeMessageReaction } from "../http/remove-message-reaction";
import { createMessageReaction } from "../http/create-message-reaction";

interface MessageProps {
  id: string
  text: string
  amountOfReactions: number
  answered?: boolean
}

export function Message({ id: messageId, text, amountOfReactions, answered = false }: MessageProps) {
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error('Messages components must be used within room page')
  }

  const [hasReacted, setHasReacted] = useState(false)

  function toggleReactToMessageAction() {
    if (!roomId || !messageId) return

    try {
      if (hasReacted) {
        removeMessageReaction({ roomId, messageId })
      } else {
        createMessageReaction({ roomId, messageId })
      }

      setHasReacted((value) => !value)
    } catch {
      if (hasReacted) {
        toast.error('Falha ao remover reação, tente novamente!')
      } else {
        toast.error('Falha ao reagir, tente novamente!')
      }
    }
  }

  return (
    <li data-answered={answered} className='ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none'>
      {text}

      <button
        type="button"
        onClick={toggleReactToMessageAction}
        data-has-reacted={hasReacted}
        className="mt-3 flex items-center gap-2 text-zinc-400 data-[has-reacted=true]:text-orange-400 text-sm font-medium transition-colors hover:text-zinc-300 data-[has-reacted=true]:hover:text-orange-500">
        <ArrowUp className="size-4" />
        Curtir pergunta ({amountOfReactions})
      </button>
    </li>
  )
}