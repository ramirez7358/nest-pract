import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.messageWsService.registerClient(client);

    this.wss.emit(
      'clients-update',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-update',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite únicamente al client
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!',
    // });

    //! emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!',
    // });

    this.wss.emit('message-from-server', {
      fullName: 'Soy yo!',
      message: payload.message || 'no-message!!',
    });
  }
}
