

# Auth MEAN - Nest Backend

## Ejecutar el backend de manera local

Para que el backend funcione se debe proporcionar una base de datos de mongoDB

1. Clonar el backend.
2. Entrar al archivo ```env.template``` y reemplazar ```Mongo_URI``` por la base de datos de mongo que utilizara y reemplazar ```JWT_SEED``` por una key_secret aleatoria que se utilizara para generar los JWT.
3. Renombrar el archivo a ```.env```
4. Ejecutar ```docker compose up -d``` para desplegar la base de datos en un contenedor de docker.
5. Ejecutar ```npm run start:dev``` para ejecutar el backend.

## Descripción del proyecto

Backend desarrollado en Nest que permite el registro y autenticación de usuarios. 