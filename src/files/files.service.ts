import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

    getStaticProductImage( imageName : string ) {        
        const path = join(__dirname, '../../static/uploads', imageName)

        if( !existsSync(path) ) {
            throw new BadRequestException(`La imagen ${imageName} no ha sido encontrada`)
        }
        return path
    }   
}

