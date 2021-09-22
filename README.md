# Martian Robots 🪐

Este programa determina cada posición de los robots introducidos y su posición final.  
Se compone de dos partes principales:
## 1. Proceso de desarrollo

1. Especificación de requisitos y análisis.
2. Diseño de la arquitectura.
3. Aproximación de implementación con `Python` y CLI.
4. Implementación de la persistencia.
5. Migración a `Node.js`.
6. Contenerizar (`Docker`).
7. Desplegar REST API.
8. Deployment en nube (`AWS`).
9. Planteamiento de ejecución serverless.

## 2. Instrucciones para su ejecución

*-------------------------------------------------------------------------*

## *1. Proceso de desarrollo*

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

- RU-1:  La posición de un robot consiste en una coordenada en el mapa(formato x, y) y una orientación(norte, sur, este, oeste).
- RU-2: La instrucción para un robot consiste en una cadena de caracteres formado por las letras: “L”,”R”, “F”.
- RU-3: El mapa es rectangular y delimitado.
- RU-4: Un robot que se mueve fuera de los límites es “perdido” para siempre.
- RU-5: La posición de “LOST” de un robot implica que el resto de robots ya no pueden ser perdidos en esa posición.
- RU-6: El valor máximo de cualquier coordenada es 50
- RU-7: Cualquier instrucción será de menos de 100 caracteres de longitud.
- RU-8: El “output” estará compuesto por la posición final del robot y su orientación. Si el robot se pierde se imprimirá por pantalla la palabra “LOST”.
- RU-9: El sistema debe ser extensible para que, en el caso de implementaciones adicionales, su incorporación no resulte costosa.


##### 3. Diagrama de análisis:
 





