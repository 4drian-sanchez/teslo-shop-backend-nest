import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces';


@WebSocketGateway({cors : true, })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss : Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService : JwtService
  ) {}

  async handleConnection(client: Socket) {

    const authorization = client.handshake.headers.authentication as string
    try {
      const jwtPayload = this.jwtService.verify(authorization)
      await this.messagesWsService.registerCLient(client, jwtPayload.id)
      
    } catch (error) {
        client.disconnect()
        return
    }
    this.wss.emit( 'client-updated', this.messagesWsService.getConnectedClient() )
  }

  handleDisconnect(client: Socket) {
    return this.messagesWsService.removeCLient(client)
  }

  @SubscribeMessage('message-front')
  onMessageFromFront( client : Socket, payload : { fullName : string, message: string } ) {

    //! Emite únicamente al cliente actual inicial
    /* client.emit( 'message-server', {
      fullName: 'Adrian Sanchez',
      message: payload.message || 'Hola mundo'
    } ) */

    //! Emite a todos menos al cliente actual inicial
    /* client.broadcast.emit( 'message-server', {
      fullName: 'Adrian Sanchez',
      message: payload.message || 'Hola mundo'
    } ) */

    //* Emite el mensaje a todos los clientes
    this.wss.emit( 'message-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message 
    } )

  }
}
