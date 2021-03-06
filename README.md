# Martian Robots 馃獝

Este programa determina cada posici贸n de los robots introducidos y su posici贸n final.  
Se compone de dos partes principales:
- 1 - **[Proceso](#1-proceso-de-desarrollo-) de desarrollo**:

1. Especificaci贸n de requisitos y an谩lisis.
2. Dise帽o de la arquitectura.
3. Aproximaci贸n de implementaci贸n con `Python` y CLI.
4. Migraci贸n a `Node.js`.
5. Implementaci贸n de la persistencia.
6. Desplegar REST API.
7. Contenerizar (`Docker`).
8. Deployment en nube (`AWS`).
9. Planteamiento de ejecuci贸n serverless.

- 2 - **[Instrucciones](#2-instrucciones-para-su-ejecucion-) para su ejecucion**

*-------------------------------------------------------------------------*

## *1. Proceso de desarrollo* 馃О

#### 1. Especificaci贸n de requisitos y an谩lisis
##### **Casos de Uso:**

| Caso de Uso | Descripci贸n |
| ------------- | ------------- |
| **CU-1:** Introducir coordenada sup-dcha  | El usuario puede introducir las coordenadas iniciales del "mapa" |
| **CU-2:** Introducir posici贸n robot | El usuario puede fijar la posici贸n para el robot con el formato (int x int y, 'orientacion') |
| **CU-3:** Introducir instrucci贸n robot | El usuario puede determinar la instrucci贸n para el robot |
| **CU-4:** Consultar robots | El usuario puede consultar los robots del sistema |
| **CU-4-ext:** Consultar robots perdidos | El usuario puede consultar los robots marcados con la etiqueta "LOST" |

##### **Reglas de Negocio:**

- RU-1: La posici贸n de un robot consiste en una coordenada en el mapa(formato: x, y) y una orientaci贸n(norte, sur, este, oeste).
- RU-2: La instrucci贸n para un robot consiste en una cadena de caracteres formado por las letras: 鈥淟鈥?,鈥漅鈥?, 鈥淔鈥?.
- RU-3: El mapa es rectangular y delimitado, con la coordenada inf.izq fijada a '0, 0'.
- RU-4: Un robot que se mueve fuera de los l铆mites es 鈥減erdido鈥? para siempre.
- RU-5: La posici贸n de 鈥淟OST鈥? de un robot implica que el resto de robots ya no pueden ser perdidos en esa posici贸n.
- RU-6: El valor m谩ximo de cualquier coordenada es 50.
- RU-7: Cualquier instrucci贸n ser谩 de menos de 100 caracteres de longitud.
- RU-8: El 鈥渙utput鈥? estar谩 compuesto por la posici贸n final del robot y su orientaci贸n. Si el robot se pierde se imprimir谩 por pantalla la palabra 鈥淟OST鈥?.
- RU-9: El sistema debe ser extensible para que, en el caso de implementaciones adicionales, su incorporaci贸n no resulte costosa.


##### Diagrama de an谩lisis:
 
Siguiendo los casos de uso y las principales reglas de dise帽o se modela el diagrama de clases.  
  

![Analisis diagrama](diagramas/Analisis/clases.jpg "Analisis diagrma")   

#### 2. Dise帽o de la arquitectura
##### Diagrama de disenyo:

Se elige una arquitectura con un modelo multicapa. En concreto, de tres capas:

- Interfaz
- L贸gica o de negocio
- Persistencia

![3-layer](diagramas/Disenyo/3-capas.png "3-layer")

Adem谩s, se incluye un boceto de una implementaci贸n con AWS:
- Instancia `EC2` para el despliegue de la API REST con el servidor de `Node.js`.
- Instancia en `EC2` para el despliegue de la Base de Datos de `MongoDB`.

![Cloudcraft Diagram](diagramas/Disenyo/MartianRobots_AWS.png "Cloudcraft Diagram")



#### 3. Aproximaci贸n de implementaci贸n con `Python` y CLI.

Se realiza una implementaci贸n en python para contruir el esqueleto de la aplicaci贸n. Para su ejecuci贸n se hace uso de la interfaz de comandos de cualquier SO.  
En la secci贸n de instrucciones se explica como [ejecutar](#1-ejecucion-en-python) esta aplicaci贸n.

#### 4. Migraci贸n a `Node.js`

La implementaci贸n realizada en python se pasa a JavaScript para ejecutarse en `Node.js`  
Se optimiza el dise帽o para adaptarse. Aspectos y caracter铆sticas de Python tienen que ser "redise帽adas" para poder implementarse con JavaScript.  
Adem谩s, se escriben tests con Jest para comprobar el correcto funcionamiento.

#### 5. Implementaci贸n de la persistencia.

La persistencia se implementa mediante el uso de base de datos No-SQL orientada a documentos. En concreto, con MongoDB.

![Mongo Diagram](diagramas/database/database.png "Mongo Diagram")  
  
La BD es muy sencilla. Tan solo es necesaria una colecci贸n, donde se almacenan:
- Id del robot (generado en tiempo de ejecuci贸n con uuid).
- La posici贸n (formada por los mismos par谩metros que el c贸digo).
- Un valor booleano que determina si el robot se ha perdido.
- El set de instrucciones asociado a ese robot.

#### 6. Desplegar API REST

Con el objetivo de proveer una mayor interfaz de acceso y visualizaci贸n de los datos, se implementa una API. Sin embargo, est谩 en fase inicial; y solo permite la consulta de los robots existentes y los que est谩n perdidos. El funcionamiento es explicado en la [secci贸n](#2-ejecucion-de-la-segunda-version) de instrucciones de ejecuci贸n.  
Para crear una API de forma r谩pida se hace uso del framework `express`.  
Se implementan dos rutas:
- GET /robots --> devuelve todos los robots en la BD.
- GET /robots/lost --> devuelve los robots perdidos. 

#### 7. Contenerizar (`Docker`).

Una vez terminada la API, se contenerizan los servicios para una mayor comodidad de uso y despliegue. Para ello se usan dos contenedores:
- API REST container: se compila una imagen de contenedor con Dockerfile ==> `migue9b/martian-api:1.0`  
  馃惓 https://hub.docker.com/r/migue9b/martian-api 馃惓
- MongoDB database container: se usa la propia imagen de `mongo:5.0.3`

#### 8. Despliegue en nube `AWS`

Los contenedores se despliegan en nube. En concreto, en AWS. Cada contenedor se implementa en una instancia EC2(`Elastic Compute`); y cada instancia se lanza en una AZ(zona de disponibilidad de AWS) distinta.  
Est谩n bajo la misma red, pero en subredes distintas. En el [diagrama](#diagrama-de-disenyo) de dise帽o se puede apreciar.

#### 9. Planteamiento serverless.

A continuaci贸n se plantea un modelo de arquitectura serverless. Es decir, sin necesidad de un servidor. En concreto, con una p谩gina HTML est谩tica que tenga una serie de opciones; un "almac茅n" para ese HTML; y unas funciones lambda.  
  
![serverless Diagram](diagramas/Serverless-MartianRobots.png "serverless Diagram") 

**USER** --> **HTML** --> **API REQUEST** --> **LAMBDA FUNCTION** 

Cada una de las funciones se encargar铆a de procesar:
- Coordenadas de Mapa
- Posicion y orientaci贸n del robot
- Instrucciones
- GET robots


## 2. *Instrucciones para su ejecucion* 猬?

### 1. Ejecuci贸n de la primera `Release: v1.0`

Para ejecutar la primera versi贸n de la aplicaci贸n simplemente se descarga el `.zip` de la release.  
Hay dos versiones:
- Python
- Node.js

#### 1. Ejecucion en python

En la carpeta `python` del proyecto:

        python3 app.py

#### 2. Ejecucion en Node

En la carpeta `node/src`

      node app.js


### 2. Ejecucion de la segunda version

Para la segunda versi贸n se ampl铆a la primera release con soporte API y persistencia.  
Es decir, la aplicaci贸n se compone de:
- "N煤cleo" l贸gico: formado por la aplicaci贸n en la l铆nea de comandos, que almacena  
la informaci贸n necesaria de los robots.
- Interfaz de acceso de datos: conformado por la API REST, que proporciona la consulta  
de los robots.

Por lo tanto, el esquema de ejecuci贸n para esta versi贸n final de la app ser铆a:  


El usuario ejecuta e interact煤a con la aplicaci贸n desde CLI. Por cada robot e instrucciones  
que introduce, 茅stas son almacenadas en la BD.  
Si el usuario quisiera ver informaci贸n acerca de los robots o filtrar los robots perdidos,  
puede hacer uso de la API. Es importante destacar que el registro de las posiciones de  
los robots perdidos(que sirve para evitar la p茅rdida de los dem谩s robots en esa posici贸n)  
se realiza en tiempo de ejecuci贸n. Por tanto, si, hist贸ricamente ya hay un robot perdido  
en la BD; cuando se interaccione con la app, esa posici贸n no ser谩 tomada en cuenta.  
En resumen, la aplicaci贸n no precarga ning煤n dato de la BD.  


Hay dos opciones para "usar" la app:

#### 1. Ejecucion con despliegue en la nube

Es la opci贸n por defecto y la m谩s c贸moda.  
Para ello, se descarga el `.zip` de la release final y se ejecuta, sobre la ruta ra铆z:
    
    npm install

Tras ello, sobre la carpeta `node/src/logica/`:

    node main.js

Los datos son almacenados en una BD desplegada en una instancia de EC2 de AWS.  
Si se desea acceder a los datos, seguir las [rutas](#6-desplegar-api-rest) en la URL:  
http://ec2-13-37-163-6.eu-west-3.compute.amazonaws.com

#### 2. Ejecucion con despliegue en local

Si se desea usar la app en local:
1. Descargar el `.zip` de la release final
2. Modificar la URL de la BD. Al ser en local, la BD ya no se encuentra en remoto. Para ello, basta con  
cambiarla al valor por defecto en el archivo `node/src/database/database.js`:  
`mongodb://localhost:27017/`
3. Desplegar los contenedores con `docker-compose`. Sobre la carpeta ra铆z del proyecto,  
`docker-compose up -d`  
En caso de error: `docker-compose up -d --force-recreate`

Tras esto, se habr谩n desplegado la API REST(en `localhost`) y la BD. Por tanto, el paso final es ejecutar la parte de CLI:  
En la ruta ra铆z:
    
    npm install

Tras ello, sobre la carpeta `node/src/logica/`:

    node main.js



