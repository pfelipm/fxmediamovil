![Banner MEDIAMOVIL](https://user-images.githubusercontent.com/12829262/83059749-b147e080-a05a-11ea-8c56-ece164af0b2e.png)

# Medias móviles para las hojas de cálculo de Google

Este repositorio incluye el código Apps Script necesario para implementar la función personalizada para hojas de cálculo de Google `MEDIAMOVIL`.

Los cálculos de **media móvil** se emplean para analizar intervalos de datos típicamente asociados a una secuencia temporal. Para cada elemento del intervalo se calcula un valor obtenida como consecuencia de la ponderación de un subconjunto de los datos (o _ventana_) de la serie original. La estrategia de selección, el tamaño de esa venta y el tipo de ponderación realizada son parámetros que caracterizan el tipo de media móvil calculada.

De manera específica, los tipos de medias móviles soportados por `MEDIAMOVIL` son estos:

*   **Simple** (también llamada _previa_, es la empleada si no se indica lo contrario). Se tienen en cuenta los últimos n datos del intervalo.
*   **Central**. En este caso se utilizan para el cálculo los `(n - 1) / 2` datos anteriores y posteriores a cada elemento de la serie. Este tipo de media móvil requiere que la ventana sea de tamaño impar.
*   **Acumulada**. Similar a la media simple, pero ahora se tienen en cuenta _todos_ los valores previos del intervalo.
*   **Ponderada.** Los valores del intervalo pierden peso en el cálculo a medida que _envejecen_. `MEDIAMOVIL` utiliza directamente la posición de valor dentro de la ventana como factor de ponderación, el más antiguo por tanto tendrá un peso de 1.
*   **Exponencial**. Ahora los valores previos de la serie van perdiendo peso en el cálculo de manera proporcional a su antigüedad. La implementación de `MEDIAMOVIL` utiliza un factor de decrecimiento del tipo `2 / (n + 1)` y una ventana que pondera todos los valores anteriores del intervalo.

Además, en el caso de las medias **simple**, **central** y **ponderada** es posible:

*   Indicar el nº de puntos que se tienen en cuenta dentro de la ventana de cálculo.
*   Determinar cómo se tratará el cálculo de aquellos elementos de la serie de datos para los que no se dispone, por su posición en ella, del número de una ventana de tamaño suficiente.

# Función MEDIAMOVIL()

```
=MEDIAMOVIL( intervalo ; [tipo] ; [n_puntos] ; [rellenar] )
```

*   `intervalo`: Rango de datos sobre los que se debe calcular la media móvil. Se admiten rangos con varias columnas, en ese caso se obtendrá un intervalo con tantas series calculadas como columnas.
*   `tipo`: Tipo de media móvil a calcular (literal): "`ACUMULADA"` | `"CENTRAL"` | `"EXPONENCIAL"` | \[`"SIMPLE"`\] | `"PONDERADA"`. Este parámetro (literal) es opcional, de no especificarse se utiliza la media simple.
*   `n_puntos`: Tamaño de la ventana (número entero). Si no se indica se toma como valor predeterminado 3. Este parámetro no tiene efecto en las medias de tipo acumulado y exponencial.
*   `rellenar`: Especifica qué debe hacerse con aquellos elementos de la secuencia de datos para los que no puede realizarse el cálculo dado que no hay suficientes elementos en la ventana indicada (booleano). Si es `VERDADERO` se utiliza el valor del propio elemento. Si es `FALSO` se deja un espacio en blanco en la serie calculada.

Ejemplo:

```
=MEDIAMOVIL( A1:B10 ; "CENTRAL" ; 3 ; FALSO)
```

![fx MEDIAMOVIL - Hojas de cálculo de Google](https://user-images.githubusercontent.com/12829262/86264208-82290f80-bbc2-11ea-8f0c-84c597f8600d.gif)

# **Modo de uso**

Dos posibilidades distintas:

1.  Abre el editor GAS de tu hoja de cálculo (`Herramientas` :fast\_forward: `Editor de secuencias de comandos`), pega el código que encontrarás dentro del archivo `Código.gs` de este repositorio y guarda los cambios. Debes asegurarte de que se esté utilizando el nuevo motor GAS JavaScript V8 (`Ejecutar`  :fast\_forward: `Habilitar ... V8`).
2.  Hazte una copia de esto :point\_right: [fx MEDIAMOVIL # demo](https://docs.google.com/spreadsheets/d/1rioEO9zZ4RqzQidTgrPzpTu7-m6wmjnBem5iV5u2qK4/template/preview) :point\_left: y elimina su contenido.

Esta función estará en breve disponible en mi complemento para hojas de cálculo [HdC+](https://tictools.tk/hdcplus/).

# Mirando bajo el capó (implementación)

Aunque no hay nada especialmente reseñable, echemos un vistazo a la implementación. Si no estás familiarizado con el modo en que se construyen las funciones personalizadas en Apps Script puedes empezar por pegarle un vistazo a la [documentación oficial](https://developers.google.com/apps-script/guides/sheets/functions). No te pierdas las limitaciones de este tipo de funciones, hay unas cuantas, entre ellas:

*   El tiempo de ejecución está limitado a 30 segundos.
*   Solo pueden modificar los datos contenidos en las celdas de los intervalos (rangos) que se pasan como parámetros.
*   No es posible hacer ciertas cosas. Qué digo ciertas, ¡muchas cosas! La realidad es que el código dentro de una de estas funciones tiene prohibido utilizar [numerosos](https://developers.google.com/apps-script/guides/sheets/functions#using_apps_script_services) servicios Apps Script habituales, lo que sin duda limita 

Pero sigamos... Verás que en realidad cualquier función GAS asociada a una hoja de cálculo puede ser invocada directamente utilizando su nombre en cualquier fórmula, así de sencillo. Pero en ese caso aplican las anteriores (y otras) limitaciones y particularidades.

Para que la experiencia de uso de estas funciones personalizadas GAS sea lo más parecida posible a la del resto de funciones integradas en las hojas de cálculo de Google conviene incorporar en ellas la típica [ayuda contextual,](https://developers.google.com/apps-script/guides/sheets/functions#autocomplete) según se escribe, que nos va indicando cómo utilizar la función. Esto se consigue con la etiqueta especial `@customfunction` en su encabezado, que debe ir acompañada de toda una serie de marcadores JSDoc adicionales.Dado que la documentación oficial de Google se queda bastante corta, te sugiero que leas detenidamente este excelente [artículo](https://mogsdad.wordpress.com/2015/07/08/did-you-know-custom-functions-in-google-apps-script/) en su lugar para entender bien todo o casi todo lo que se puede hacer con JSDoc y estas funciones personalizadas Apps Script (:warning: el uso de etiquetas HTML parece que ya no está soportado).

Veamos qué pinta tiene esto del JSDoc en esta función:

```javascript
/**
* Calcula la media móvil de un intervalo de datos utilizando diversos métodos.
* Para el cálculo de la media móvil EXPONENCIAL se utiliza el factor de decrecimiento 2 / ( n + 1).
* Para el cálcula de la media móvil PONDERADA se utiliza la posición del valor como peso.
* Los parámetros n_puntos y rellenar no se utilizan cuando se calculan medias móviles ACUMULADA o EXPONENCIAL.
*
* @param {A2:A10} intervalo Intervalo de datos, que se suponen en columnas.
* @param {4} n_puntos Número de valores a promediar (3 por defecto). Solo tiene efecto en
* el cálculo de las medias móviles SIMPLE, CENTRAL y PONDERADA.
* @param {"SIMPLE"} tipo Tipo de media a calcular (ACUMULADA | CENTRAL | EXPONENCIAL | [SIMPLE] | PONDERADA).
* @param {true} rellenar Indica si se deben tomar los valores del conjunto de datos de origen cuando no se dispone del
* número de puntos necesario para calcular el valor de la media móvil ([VERDADERO] | FALSO). Solo tiene efecto en
* el cálculo de las medias móviles SIMPLE, CENTRAL y PONDERADA.
*
* @return Intervalo de datos calculados
*
* @customfunction
*
* MIT License
* Copyright (c) 2020 Pablo Felip Monferrer(@pfelipm)
*/ 
```

# **Licencia**

© 2020 Pablo Felip Monferrer ([@pfelipm](https://twitter.com/pfelipm)). Se distribuye bajo licencia MIT.
