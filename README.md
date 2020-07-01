![Banner MEDIAMOVIL](https://user-images.githubusercontent.com/12829262/83059749-b147e080-a05a-11ea-8c56-ece164af0b2e.png)

# Medias móviles para las hojas de cálculo de Google

Este repositorio incluye el código Apps Script necesario para implementar la función personalizada para hojas de cálculo de Google `MEDIAMOVIL`.

Los cálculos de **media móvil** se emplean para analizar intervalos de datos típicamente asociados a una secuencia temporal. Para cada elemento del intervalo se calcula un valor obtenida como consecuencia de la ponderación de un subconjunto de los datos (o _ventana_) de la serie original. La estrategia de selección, el tamaño de esa venta y el tipo de ponderación realizada son parámetros que caracterizan el tipo de media móvil calculada.

De manera específica, los tipos de medias móviles soportados por `MEDIAMOVIL` son estos:

*   **Simple** (también llamada _previa_, es la empleada si no se indica lo contrario). Se tienen en cuenta los últimos n datos del intervalo.
*   **Central**. En este caso se utilizan para el cálculo los (n-1)/2 datos anteriores y posteriores a uno dado. Este tipo de media móvil requiere que la ventana sea de tamaño impar.
*   **Acumulada**. Similar a la media simple, pero ahora se tienen en cuenta _todos_ los valores previos del intervalo.
*   **Ponderada.** Los valores del intervalo pierden peso en el cálculo a medida que _envejecen_. `MEDIAMOVIL` utiliza directamente la posición de valor dentro de la ventana como factor de ponderación, el más antiguo por tanto tendrá un peso de 1.
*   **Exponencial**. Ahora los valores previos de la serie van perdiendo peso en el cálculo de manera proporcional a su antigüedad. La implementación de `MEDIAMOVIL` utiliza un factor de decrecimiento del tipo `2 / ( n + 1)` y una ventana que pondera todos los valores anteriores del intervalo.

Además, en el caso de las medias **simple**, **central** y **ponderada** es posible:

*   Indicar el nº de puntos que se tienen en cuenta dentro de la ventana de cálculo.
*   Determinar cómo se tratará el cálculo de aquellos elementos de la serie de datos para los que no se dispone, por su posición en ella, del número de una ventana de tamaño suficiente.

# Función MEDIAMOVIL()

```
=MEDIAMOVIL( intervalo ; [tipo] ; [n_puntos] ; [rellenar])
```

*   `intervalo`: Rango de datos sobre los que se debe calcular la media móvil. Se admiten rangos con varias columnas, en ese caso se obtendrá un intervalo con tantas series calculadas como columnas.
*   `tipo`: Tipo de media móvil a calcular (literal): "ACUMULADA" | "CENTRAL" | "EXPONENCIAL" | \["SIMPLE"\] | "PONDERADA". Este parámetro (literal) es opcional, de no especificarse se utiliza la media SIMPLE.
*   `n_puntos`: Tamaño de la ventana (número entero). Si no se indica se toma como valor predeterminado 3. Este parámetro no tiene efecto en las medias de tipo acumulado y exponencial.
*   `rellenar`: Especifica qué debe hacerse con aquellos elementos de la secuencia de datos para los que no puede realizarse el cálculo dado que no hay suficientes elementos en la ventana indicada (booleano). Si es `VERDADERO` se utiliza el valor del propio elemento. Si es `FALSO` se deja un espacio en blanco en la serie calculada.

Ejemplo:

```
=MEDIAMOVIL( A1:B10 ; "CENTRAL" ; 3 ; FALSO)
```

![fx MEDIAMOVIL - Hojas de cálculo de Google](https://user-images.githubusercontent.com/12829262/86264208-82290f80-bbc2-11ea-8f0c-84c597f8600d.gif)

# **Modo de uso**

Dos posibilidades distintas:

1.  Abre el editor GAS de tu hoja de cálculo (`Herramientas` :fast\_forward: `Editor de secuencias de comandos`), pega el código que encontrarás dentro del archivo `Código.gs` de este repositorio y guarda los cambios. Debes asegurarte de que se esté utilizando el nuevo motor GAS JavaScript V8 (`Ejecutar` :fast\_forward:`Habilitar ... V8`).
2.  Hazte una copia de esto :point\_right: [](https://docs.google.com/spreadsheets/d/1yq3KJGtQB4OX5y0Qz8FgM7Z88d00rXtP_aKc79Ki1BE/template/preview) [fx MEDIAMOVIL # demo](https://docs.google.com/spreadsheets/d/1rioEO9zZ4RqzQidTgrPzpTu7-m6wmjnBem5iV5u2qK4/template/preview) :point\_left: y elimina su contenido.

# **Licencia**

© 2020 Pablo Felip Monferrer ([@pfelipm](https://twitter.com/pfelipm)). Se distribuye bajo licencia MIT.
