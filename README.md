![Banner MEDIAMOVIL](https://user-images.githubusercontent.com/12829262/83059749-b147e080-a05a-11ea-8c56-ece164af0b2e.png)

# Medias móviles para las hojas de cálculo de Google

Este repositorio incluye el código Apps Script necesario para implementar la función personalizada para hojas de cálculo de Google `MEDIAMOVIL`. 

`MEDIAMOVIL` permite obtener distintos tipos de **medias móviles** sobre un intervalo de datos arbitrario. Los cálculos de media móvil obtiene, para cada elemento del intervalo, un valor basado en en la ponderación de una serie de n valores, subconjunto del intervalo inicial, siguiendo distintas estrategias. A este valor de n se le suele denominar _tamaño de la ventana_.

De manera específica, los tipos de medias móviles soportados por `MEDIAMOVIL` son estos:

*   **Simple** (también llamada _previa_, es la empleada si no se indica lo contrario). Se tienen en cuenta los últimos n puntos del intervalo.
*   **Central**. En este caso se utilizan para el cálculo los (n-1)/2 puntos anteriores y posteriores a uno dado. Este tipo de media móvil requiere que la ventana sea de tamaño impar.
*   **Acumulada**. Similar a la media simple, pero ahora se tienen en cuenta _todos_ los valores previos del intervalo-
*   **Ponderada.** Los 
*   **Exponencial**. Ahora los valores previos de la serie van perdiendo peso en el cálculo de manera proporcional a su antigüedad. La implementación de `MEDIAMOVIL` utiliza un factor de decrecimiento del tipo `2 / ( n + 1)`.

Además, en el caso de las medias simple, central y ponderada es posible:

*   Indicar el nº de puntos que se tienen en cuenta dentro de la ventana de cálculo (medias simple, central y ponderada)
*   Dterminar cómo se tratará el cálculo de aquellos elementos de la serie de datos para los que no se dispone, por su posición en ella, del número de puntos necesarios .
