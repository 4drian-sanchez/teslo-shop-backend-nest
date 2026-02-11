<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>



# Arrancar la apliacación en modo de desarrollo
1. Clonar el repositorio
2. ejecutar ``` npm i ```
3.  Cambia el nombre del archivo ``` .env.template ``` a ``` .env ``` y cambia los valores de las variables de entorno
4. Ejecuta el comando de docker para levantar la base de datos postgres
``` 
docker-compose up -d 
```
5. Colocar la aplicación en modo de desarrollo:
```
npm run start:dev
```
6. Ejecutar el Seed para tener datos ficticios en la BD
```
http://localhost:3000/api/seed
```

asegure de tener la network creada teslo-network. Verifica si existe con el comando `docker network ls` si no tienes la network creala con este comando `docker network create teslo-network`

Para crear la base de datos desde docker, se crea con el volume y todo lo necesario. No necesitas agregar la base de datos al `docker-compose` con esto es suficiente:
  El nombre solo debe contener letras minúsculas
```
  docker run `
  --name teslo-db `
  --network teslo-network `
  -e POSTGRES_PASSWORD=mysecretpassword `
  -e POSTGRES_DB=teslodb `
  -p 5432:5432 `
  -v "${PWD}/postgres:/var/lib/postgresql/data" `
  -d postgres:17.2-alpine
```

Si tu NestJS está corriendo en tu PC (npm run start:dev) Debes usar: DB_HOST=localhost
Si tu NestJS está corriendo DENTRO de otro contenedor de Docker Debes usar: DB_HOST=teslo-shop (el nombre que le pusiste al contenedor)

# Docker: Crear la imágen de prodcción:
1. Para crear la imagen de producción debes ejecutar el siguiente comando
```
docker build -t adrianolivo/teslo-shop:1.0.0 .
```

2. Crea el contenedor con la imagen de producción:
```
  docker run --name teslo-app `
  --network teslo-network `
  --env-file .env `
  -p 3000:3000 `
  -d adrianolivo/teslo-shop:1.0.0
```

  Cambia el tag según la versión que se desees crea. Ejem: 1.1.0, 2.2.1 3.0.0, etc
