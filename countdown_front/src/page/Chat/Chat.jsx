import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    client.subscribe('/topic/chat/room-123', (msg) => {
      console.log(JSON.parse(msg.body));
    });
  },
});

client.activate();