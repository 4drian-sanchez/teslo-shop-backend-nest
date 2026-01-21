import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileNamer, fileFilter } from './helpers';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Get('product/:productName')
  getProductImage( 
    @Param('productName') imageName : string,
    @Res() res: Response
  ) {
    const path = this.filesService.getStaticProductImage(imageName)
    
    res.sendFile( path )
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: {fileSize: 10000}  → Límite del tamaño de la imagen
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductImages(
    @UploadedFile() file: Express.Multer.File
  ) {

    if( !file ) throw new BadRequestException('¡Agrega una imagen!')
    
    const secureUrl = `${this.configService.get('BASE_URL')}`


    return {
      message: 'Imagen subida correctamente',
      secureUrl: `${secureUrl}/files/product/${file.filename}`,
      fileName: file.filename
    }
  }

}
