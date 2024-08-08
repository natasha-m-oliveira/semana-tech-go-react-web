import { useEffect } from "react"

export enum MessageTypes {
  Created = 'message_created',
  Answered = 'message_answered',
  ReactionIncreased = 'message_reaction_increased',
  ReactionDecreased = 'message_reaction_decreased'
}

export type WebhookMessage =
  | { kind: MessageTypes.Created, value: { id: string, message: string } }
  | { kind: MessageTypes.Answered, value: { id: string } }
  | { kind: MessageTypes.ReactionIncreased, value: { id: string, count: number } }
  | { kind: MessageTypes.ReactionDecreased, value: { id: string, count: number } }

interface UseWebSocketParams {
  roomId: string
  onMessage: (message: WebhookMessage) => Promise<void> | void
}

export function useWebSocket({ roomId, onMessage }: UseWebSocketParams) {
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)

    ws.onopen = () => { console.log('Websocket connected!') }

    ws.onmessage = (event) => {
      const message: WebhookMessage = JSON.parse(event.data);

      onMessage(message)
    };

    return () => {
      ws.close();
    };
  }, [onMessage, roomId])
}