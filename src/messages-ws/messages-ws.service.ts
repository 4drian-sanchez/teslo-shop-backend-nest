import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface connectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    private connectedClients: connectedClients = {}

    async registerCLient(client: Socket, userId: string) {

               try {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) throw new Error('User not found');
            if (!user.isActive) throw new Error('User not active');
                
            this.checkUserConnect( user )
                
            // Ahora sí podrás asignar propiedades
            this.connectedClients[client.id] = {
                socket: client,
                user
            };
            
        } catch (error) {
            console.log(error);
            // Manejar el error apropiadamente
            throw error; // O devolver algo específico
        }
    }

    removeCLient(client: Socket) {
        delete this.connectedClients[client.id]
    }

    getConnectedClient() {
        return Object.keys(this.connectedClients)
    }
    
    getUserFullName( id: string ) {
        return this.connectedClients[id].user.fullName
    }

    private checkUserConnect( user : User ) {
        for (const clientId of Object.keys( this.connectedClients )) {
            const connectedCLient = this.connectedClients[clientId]

            if( clientId === user.id ) {
                connectedCLient.socket.disconnect()
                break
            }
        }
    }
}
