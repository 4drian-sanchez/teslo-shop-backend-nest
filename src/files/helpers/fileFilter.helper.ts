
export const fileFilter = ( req: Express.Request, file: Express.Multer.File, cb: Function ) => {
    if( !file ) return cb( new Error('File is Empty'), false )

    const fileExptension = file.mimetype.split('/')[1]
    const exptensionArray = ['jpeg', 'png', 'jpg', 'svg', 'webp', 'avif']

    //* Si la extension resivida no esta en el array de extensiones permitidas no se acepta el archivo
    if( !exptensionArray.includes( fileExptension ) ) {
        return cb( new Error('Archivo no válido. Agrega solo imagenes jpeg, png, jpg, svg '), false )
    }

    cb( null, true )
}