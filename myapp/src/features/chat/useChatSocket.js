import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useChatSocket({ roomId, onMessage }) {
  const clientRef = useRef(null);

  useEffect(() => {
    const socketUrl = 'http://localhost:8080/ws'; // Spring Boot WebSocket 엔드포인트
    const stompClient = new Client({ // Client는 WebSocket 연결을 하고, 메시지를 주고받기 위한 객체
      webSocketFactory: () => new SockJS(socketUrl), // webSocketFactory는 WebSocket 연결을 어떻게 생성할지를 정의하는 함수
      reconnectDelay: 5000, // 재연결 시도
      onConnect: () => {
        console.log('✅ WebSocket 연결됨');
        stompClient.subscribe(`/topic/chat/${roomId}`, (message) => { //subcricbe는 STOMP 프로토콜에서 특정 "주제(topic)"를 구독하여 메시지를 실시간으로 받기 위한 함수
          const body = JSON.parse(message.body);
          onMessage(body);
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, onMessage]);

  const sendMessage = (msg) => {
    clientRef.current.publish({
      destination: `/app/chat/message`,
      body: JSON.stringify(msg),
    });
  };

  return { sendMessage };
}
