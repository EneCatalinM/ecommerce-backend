// src/notifications/notifications.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private logger = new Logger(NotificationsGateway.name);
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('orderUpdates')
    handleOrderUpdate(client: Socket, payload: any) {
      this.logger.log(`Order update received: ${JSON.stringify(payload)}`);
    }
  
    notifyOrderUpdate(orderId: string, status: string) {
      this.server.emit('orderUpdate', { orderId, status });
    }
  }
  