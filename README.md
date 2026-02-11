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

Para crear la base de datos desde docker
```
  docker run --name teslo_shop -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=teslo_shop -p 5432:5432 -d postgres:17.2-alpine

```

Si tu NestJS está corriendo en tu PC (npm run start:dev) Debes usar: DB_HOST=localhost
Si tu NestJS está corriendo DENTRO de otro contenedor de Docker Debes usar: DB_HOST=teslo-shop (el nombre que le pusiste al contenedor)