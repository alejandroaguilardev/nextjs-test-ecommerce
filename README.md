# Next.js Teslo Shop App

Para correr localmente, se necesita la base de datos.

```
docker-compose up -d
```

El -d siginifica **detached**

Base de datos:
```
mongodb://localhost:27017
```

## COnfigurar las variables de entorno
Renombrear el archivo __.env.template__ a __.env__

## LLenar la base de datos con información de pruebas
```
http://localhost:3000/api/seed
```