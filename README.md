# Martian Robots 🪐

Este programa determina cada posición de los robots introducidos y su posición final.  
Se compone de dos partes principales:
## 1. Proceso de desarrollo

1. Especificación de requisitos y análisis.
2. Diseño de la arquitectura.
3. Aproximación de implementación con `Python` y CLI.
4. Migración a `Node.js`.
5. Implementación de la persistencia.
6. Desplegar REST API.
7. Contenerizar (`Docker`).
8. Deployment en nube (`AWS`).
9. Planteamiento de ejecución serverless.

## 2. Instrucciones para su ejecucion

*-------------------------------------------------------------------------*

### *1. Proceso de desarrollo* 🧰

#### 1. Especificación de requisitos y análisis
##### **Casos de Uso:**

| Caso de Uso | Descripción |
| ------------- | ------------- |
| **CU-1:** Introducir coordenada sup-dcha  | El usuario puede introducir las coordenadas iniciales del "mundo" |
| **CU-2:** Introducir posición robot | El usuario puede fijar la posición para el robot con el formato (int int, 'orientation') |
| **CU-3:** Introducir instrucción robot | El usuario puede determinarla instrucción para el robot |
| **CU-4:** Consultar robots | El usuario puede consultar los robots del sistema |
| **CU-4-ext:** Consultar robots perdidos | El usuario puede consultar los robots marcados con la etiqueta "LOST" |

##### **Reglas de Negocio:**

- RU-1: La posición de un robot consiste en una coordenada en el mapa(formato x, y) y una orientación(norte, sur, este, oeste).
- RU-2: La instrucción para un robot consiste en una cadena de caracteres formado por las letras: “L”,”R”, “F”.
- RU-3: El mapa es rectangular y delimitado.
- RU-4: Un robot que se mueve fuera de los límites es “perdido” para siempre.
- RU-5: La posición de “LOST” de un robot implica que el resto de robots ya no pueden ser perdidos en esa posición.
- RU-6: El valor máximo de cualquier coordenada es 50
- RU-7: Cualquier instrucción será de menos de 100 caracteres de longitud.
- RU-8: El “output” estará compuesto por la posición final del robot y su orientación. Si el robot se pierde se imprimirá por pantalla la palabra “LOST”.
- RU-9: El sistema debe ser extensible para que, en el caso de implementaciones adicionales, su incorporación no resulte costosa.


##### Diagrama de análisis:
 
En la carpeta `/diagramas/Analisis`  

#### 2. Diseño de la arquitectura
##### Diagrama de diseño:

Se elige una arquitectura con un modelo multicapa. En concreto, de tres capas:

- Interfaz
- Lógica o de negocio
- Persistencia

En la carpeta `/diagramas/Disenyo`  

Además, se incluye un boceto de una implementación con AWS:
- Instancia `EC2`
- Persistencia con `DynamoDB`



#### 3. Aproximación de implementación con `Python` y CLI.

Se realiza una implementación en python para contruir el esqueleto de la aplicación. Para su ejecución se hace uso de la interfaz de comandos de cualquier SO.  
En la sección de instrucciones se explica como [ejecutar](#2-instrucciones-para-su-ejecucion) esta aplicación.

#### 4. Migración a Node.js

La implementación realizada en python se pasa a JavaScript para `Node.js`.  
Se optimiza para adaptarse a Node. Aspectos y características de Python tienen que ser "repensadas" para poder implementarse con JavaScript.  
Además, se escriben tests con Jest para comprobar el correcto funcionamiento.