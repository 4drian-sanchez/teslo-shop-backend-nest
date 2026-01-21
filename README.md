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