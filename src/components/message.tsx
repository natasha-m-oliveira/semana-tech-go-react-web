import { ArrowUp } from "lucide-react";
import { useState } from "react";

interface MessageProps {
  text: string
  amountOfReactions: number
  answered?: boolean
}

export function Message({ text, amountOfReactions, answered = false }: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false)

  function handleToggleReactToMessage() {
    setHasReacted((value) => !value)
  }

  return (
    <li data-answered={answered} className='ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none'>
      {text}

      <button
        onClick={handleToggleReactToMessage}
        type="button"
        data-has-reacted={hasReacted}
        className="mt-3 flex items-center gap-2 text-zinc-400 data-[has-reacted=true]:text-orange-400 text-sm font-medium transition-colors hover:text-zinc-300 data-[has-reacted=true]:hover:text-orange-500">
        <ArrowUp className="size-4" />
        Curtir pergunta ({amountOfReactions})
      </button>
    </li>
  )
}