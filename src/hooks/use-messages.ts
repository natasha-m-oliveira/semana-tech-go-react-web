import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { getRoomMessages, GetRoomMessagesResponse } from "../http/get-room-messages"
import { MessageTypes, useWebSocket, WebhookMessage } from "./use-web-socket"

export function useMessages(roomId: string) {
  const queryClient = useQueryClient()
  
  const { data } = useSuspenseQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getRoomMessages({ roomId }),
  })

  const onWebhookMessage = useCallback((message: WebhookMessage) => {
    switch(message.kind) {
      case MessageTypes.Created:
        queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], data => {
          return { 
            messages: [
              ...(data?.messages ?? []),  
              {
                id: message.value.id,
                text: message.value.message,
                amountOfReactions: 0,
                answered: false,
              }
            ],
          }  
        })

        break;
      case MessageTypes.Answered:
        queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], data => {
          if (!data) {
            return { messages: [] }
          }

          return { 
            messages: data.messages.map(item => {
              if (item.id === message.value.id) {
                return { ...item, answered: true }
              }

              return item
            }),
          }  
        })

        break;
      case MessageTypes.ReactionIncreased:
      case MessageTypes.ReactionDecreased:
        queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], data => {
          if (!data) {
            return { messages: [] }
          }

          return { 
            messages: data.messages.map(item => {
              if (item.id === message.value.id) {
                return { ...item, amountOfReactions: message.value.count }
              }

              return item
            }),
          }  
        })

        break;
    }
  }, [queryClient, roomId])

  useWebSocket({ roomId, onMessage: onWebhookMessage })

  return { 
    messages: data.messages.sort((a, b) => b.amountOfReactions - a.amountOfReactions)
  }
}