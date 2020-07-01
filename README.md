![Banner MEDIAMOVIL](https://user-images.githubusercontent.com/12829262/83059749-b147e080-a05a-11ea-8c56-ece164af0b2e.png)

# Medias móviles para las hojas de cálculo de Google

Este repositorio incluye el código Apps Script necesario para implementar la función personalizada para hojas de cálculo de Google `MEDIAMOVIL`.

Los cálculos de **media móvil** se emplean para analizar intervalos de datos típicamente asociados a una secuencia temporal. Para cada elemento del intervalo se calcula un valor obtenida como consecuencia de la ponderación de un subconjunto de los datos (o _ventana_) de la serie original. La estrategia de selección, el tamaño de esa venta y el tipo de ponderación realizada son parámetros que caracterizan el tipo de media móvil calculada.

De manera específica, los tipos de medias móviles soportados por `MEDIAMOVIL` son estos:

*   **Simple** (también llamada _previa_, es la empleada si no se indica lo contrario). Se tienen en cuenta los últimos n datos del intervalo.
*   **Central**. En este caso se utilizan para el cálculo los (n-1)/2 datos anteriores y posteriores a uno dado. Este tipo de media móvil requiere que la ventana sea de tamaño impar.
*   **Acumulada**. Similar a la media simple, pero ahora se tienen en cuenta _todos_ los valores previos del intervalo.
*   **Ponderada.** Los valores del intervalo pierden peso en el cálculo a medida que _envejecen_. `MEDIAMOVIL` utiliza directamente la posición de valor dentro de la ventana como peso, el más antiguo por tanto tendrá un peso de 1.
*   **Exponencial**. Ahora los valores previos de la serie van perdiendo peso en el cálculo de manera proporcional a su antigüedad. La implementación de `MEDIAMOVIL` utiliza un factor de decrecimiento del tipo `2 / ( n + 1)`.

Además, en el caso de las medias **simple**, **central** y **ponderada** es posible:

*   Indicar el nº de puntos que se tienen en cuenta dentro de la ventana de cálculo.
*   Determinar cómo se tratará el cálculo de aquellos elementos de la serie de datos para los que no se dispone, por su posición en ella, del número de una ventana de tamaño suficiente.

# Uso de MEDIAMOVIL()

```
=MEDIAMOVIL(intervalo, [tipo], [n_puntos], [rellenar])
```
