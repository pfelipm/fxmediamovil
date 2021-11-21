![Banner MEDIAMOVIL](https://user-images.githubusercontent.com/12829262/83059749-b147e080-a05a-11ea-8c56-ece164af0b2e.png)

# Medias móviles para las hojas de cálculo de Google

Este repositorio contiene el código Apps Script necesario para implementar la función personalizada para hojas de cálculo de Google `MEDIAMOVIL`. Si has llegado aquí directamente quizás quieras, antes de seguir leyendo, echarle un vistazo a este [artículo introductorio](https://pablofelip.online/medias-moviles-gas/) sobre las medias móviles.

Los cálculos de **media móvil** se emplean para analizar intervalos de datos típicamente asociados a una secuencia temporal. Para cada elemento del intervalo se calcula un valor obtenido como consecuencia de la ponderación de un subconjunto de los datos (o _ventana_) de la serie original. La estrategia de selección, el tamaño de esa venta y el tipo de ponderación realizada son parámetros que caracterizan el tipo de media móvil calculada.

De manera específica, los tipos de medias móviles soportados por `MEDIAMOVIL` son estos:

*   **Simple** (también llamada _previa_, es la empleada si no se indica lo contrario). Se tienen en cuenta los últimos n datos del intervalo.
*   **Central**. En este caso se utilizan para el cálculo los `(n - 1) / 2` datos anteriores y posteriores a cada elemento de la serie. Este tipo de media móvil requiere que la ventana sea de tamaño impar.
*   **Acumulada**. Similar a la media simple, pero ahora se tienen en cuenta _todos_ los valores previos del intervalo.
*   **Ponderada.** Los valores del intervalo se ponderan de acuerdo a ciertos pesos preestablecidos. `MEDIAMOVIL` utiliza directamente la posición del valor dentro de la ventana como factor de ponderación, de modo que el más antiguo tendrá un peso de 1. Los valores más recientes, por tanto, tendrán más influencia en el cálculo de la media móvil.
*   **Exponencial**. Ahora los valores previos de la serie van perdiendo peso en el cálculo de manera proporcional a su antigüedad, desde el más reciente al más antiguo, utilizando un factor de decrecimiento del tipo `2 / (n + 1)`.

Además, en el caso de las medias **simple**, **central** y **ponderada** es posible:

*   Indicar el nº de puntos que se tienen en cuenta dentro de la ventana de cálculo.
*   Determinar cómo se tratará el cálculo de aquellos elementos de la serie de datos para los que no se dispone, por su posición en ella, de una ventana móvil de tamaño suficiente.

# Función MEDIAMOVIL()

```
=MEDIAMOVIL( intervalo ; [tipo] ; [n_puntos] ; [rellenar] )
```

*   `intervalo`: Rango de datos sobre los que se debe calcular la media móvil. Se admiten rangos con varias columnas, en ese caso se obtendrá un intervalo con tantas series calculadas como columnas.
*   `tipo`: Tipo de media móvil a calcular (literal): "`ACUMULADA"` | `"CENTRAL"` | `"EXPONENCIAL"` | \[`"SIMPLE"`\] | `"PONDERADA"`. Este parámetro (literal) es opcional, de no especificarse se utiliza la media simple.
*   `n_puntos`: Tamaño de la ventana (número entero). Si no se indica se toma como valor predeterminado 3. Este parámetro no tiene efecto en las medias de tipo acumulado y exponencial, que siempre tienen en cuenta todos los elementos previos de la serie.
*   `rellenar`: Especifica qué debe hacerse con aquellos elementos de la secuencia de datos para los que no puede realizarse el cálculo dado que no hay suficientes elementos en la ventana indicada (booleano). Si es `VERDADERO` se utiliza el valor del propio elemento. Si es `FALSO` se deja un espacio en blanco en la serie calculada. Si se omite se asume `VERDADERO`. Este parámetro tampoco tiene efecto en las medias de tipo acumulado y exponencial.

Ejemplo:

```
=MEDIAMOVIL( A1:B10 ; "CENTRAL" ; 3 ; FALSO)
```

![fx MEDIAMOVIL - Hojas de cálculo de Google](https://user-images.githubusercontent.com/12829262/86271246-dafda580-bbcc-11ea-90ae-9536ca8fbf7c.gif)

# **Modo de uso**

Dos posibilidades distintas:

1.  Abre el editor GAS de tu hoja de cálculo (`Herramientas` :fast\_forward: `Editor de secuencias de comandos`), pega el código que encontrarás dentro del archivo `Código.gs` de este repositorio y guarda los cambios. Debes asegurarte de que se esté utilizando el nuevo motor GAS JavaScript V8 (`Ejecutar` :fast\_forward: `Habilitar ... V8`).
2.  Hazte una copia de esto :point\_right: [fx MEDIAMOVIL # demo](https://docs.google.com/spreadsheets/d/1rioEO9zZ4RqzQidTgrPzpTu7-m6wmjnBem5iV5u2qK4/template/preview) :point\_left:, elimina su contenido y edita a tu gusto.

Esta función, `MEDIAMOVIL`, estará en breve disponible en mi complemento para hojas de cálculo [HdC+](https://gsuite.google.com/marketplace/app/hdc+/410659432888), junto con otras nuevas características que tengo previsto implementar próximamente.

![Selección_091](https://user-images.githubusercontent.com/12829262/86293166-64739e80-bbf2-11ea-8030-2e5f5c37fcaa.png)

# Mirando bajo el capó :gear: (implementación)

Aunque no hay nada especialmente reseñable, echemos un vistazo a la implementación de `MEDIAMOVIL`. Si no estás familiarizado con el modo en que se construyen las **funciones personalizadas** en Apps Script puedes empezar por pegarle un vistazo a la [documentación oficial](https://developers.google.com/apps-script/guides/sheets/functions). No te pierdas las limitaciones de este tipo de funciones, hay unas cuantas, entre ellas:

*   Su tiempo de ejecución está limitado a 30 segundos.
*   Solo pueden modificar las celdas que en las que se escriben los valores que retornan, es decir, las situadas hacia la derecha y hacia abajo a partir de la celda que contiene la fórmula en la que se usa la función.
*   No es posible hacer _ciertas_ cosas. Qué digo ciertas, ¡muchas cosas! La realidad es que el código dentro de una de estas funciones tiene prohibido utilizar [numerosos](https://developers.google.com/apps-script/guides/sheets/functions#using_apps_script_services) servicios Apps Script habituales, lo que sin duda limita su capacidad. Pero eso no quiere decir en absoluto que carezcan de utilidad, todo lo contrario, a menudo resultan extremadamente convenientes.

Pero sigamos... Verás que en realidad cualquier función GAS asociada a una hoja de cálculo puede ser invocada directamente utilizando su nombre en una fórmula, así de sencillo. Pero, recuerda, en ese caso aplican las anteriores (y otras) limitaciones y particularidades.

Para que la experiencia de uso de estas funciones personalizadas GAS sea lo más parecida posible a la del resto de funciones integradas en las hojas de cálculo de Google conviene incorporar en ellas la típica [ayuda contextual,](https://developers.google.com/apps-script/guides/sheets/functions#autocomplete) según se escribe, que nos va indicando cómo utilizar la función.

![Selección_092](https://user-images.githubusercontent.com/12829262/86293368-c7fdcc00-bbf2-11ea-930b-77ab555cbbfc.png)

Esto se consigue con la etiqueta especial `@customfunction` en su encabezado, que debe ir acompañada de toda una serie de marcadores [JSDoc](https://jsdoc.app/index.html) adicionales. Dado que la documentación oficial de Google se queda bastante corta, te sugiero que leas detenidamente este excelente [artículo](https://mogsdad.wordpress.com/2015/07/08/did-you-know-custom-functions-in-google-apps-script/) en su lugar para entender bien todo o casi todo lo que se puede hacer con JSDoc y estas funciones personalizadas Apps Script (:warning: el uso de etiquetas HTML parece que ya no está soportado).

Veamos qué pinta tienen estos códigos JSDoc en esta función. Fíjate en las etiquetas que comienzan con @ y en cómo se relacionan con los parámetros definidos en la declaración de la función, justo en la última línea del fragmento de código de aquí abajo:

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
* @param {VERDADERO} rellenar Indica si se deben tomar los valores del conjunto de datos de origen cuando no se dispone del
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

function MEDIAMOVIL(intervalo, tipo = 'SIMPLE', n_puntos = 3, rellenar = true) { 
```

Estamos usando el motor de ejecución V8 de Apps Script, eso nos permite declarar parámetros opcionales con valores por defecto (`tipo`, `n_puntos`, `rellenar`) e invocar rápidamente nuestra función con algo tan sencillo como esto:

```
=MEDIAMOVIL( A1:B10 )
```

Los parámetros no explicitados adaptarán los valores indicados en la declaración de la función: `tipo = 'SIMPLE', n_puntos = 3, rellenar = true`. Tremendamente práctico.

Aunque hace unos meses no era posible usar ambas cosas (V8 y parámetros por defecto) sin romper la ayuda contextual, afortunadamente eso ya es cosa del pasado. En fin, que V8 mola mucho. Si aún no te has pasado a la sintaxis V8, que sea por alguno de sus _bugs_, que aún le quedan unos cuantos.

A continuación, alcanzamos los inevitables controles sobre los parámetros de entrada para evitar errores en tiempo de ejecución, controles que nunca parecen ser lo suficientemente exhaustivos como para impedir totalmente que llegue algún manazas capaz de dar con un caso no contemplado que se salte su lógica de seguridad ¿verdad? :facepalm:

```javascript
 // Control de parámetros inicial

  if (typeof intervalo == 'undefined' || !Array.isArray(intervalo)) throw('No se ha indicado un intervalo de datos.');
  if (typeof n_puntos != 'number') throw('Falta número de elementos o no es número.');
  if (n_puntos < 2) throw ('N debe ser mayor que 1.');
  if (typeof tipo != 'string') throw('Tipo de media incorrecto.');
  tipo = tipo.toUpperCase();
  if (!(["SIMPLE", "ACUMULADA", "CENTRAL", "EXPONENCIAL", "PONDERADA"].some(t => t == tipo))) throw('Tipo de media desconocido');
  if (typeof rellenar != 'boolean') throw('Indicación de relleno de datos errónea, debe ser VERDADERO o FALSO');
  if (["SIMPLE", "CENTRAL", "PONDERADA"].some(t => t == tipo) && intervalo.length < n_puntos) throw('No hay suficientes valores en el intervalo.');
  if (tipo == 'CENTRAL' && n_puntos % 2 == 0) throw('El nº de puntos debe ser impar al utilizar una media móvil central.');
```

Sí, uso `throw` para desencadenar una excepción. Bueno, varios. Y no, no tengo ningún manejador (`try` .. `catch`) escondido en el código. Lo interesante es que la excepción es interceptada _automágicamente_ por alguna capa supervisora, que recoge el literal de texto que pasamos como parámetro y lo muestra dentro de ese mismo bonito recuadro flotante que despliegan las funciones integradas en las hojas de cálculo. La indicación del número de línea donde se ha producido la excepción parece ser inevitable, o al menos yo [no he conseguido](https://twitter.com/pfelipm/status/1228011092804329472) hacerlo desaparecer.

![Selección_089](https://user-images.githubusercontent.com/12829262/86272131-5e6bc680-bbce-11ea-88b9-c18da643da4a.png)

Ni que decir tiene que una vez se lanza un error la ejecución del código finaliza inmediatamente. Una alternativa a esta estrategia es la de simplemente devolver como resultado de la función una cadena de texto con el mensaje de error, que quedará en la celda donde hemos utilizado la función. De hecho yo en ocasiones lo he hecho así. No obstante creo que este método es más elegante... salvo por lo del numerito, que es un detalle de implementación que solo interesa al desarrollador.

Este control de parámetros inicial es realmente innecesario: si el usuario utiliza mal la función pues... aparecerá algún error feote y ya está. Pero en mi opinión son los pequeños detalles como este los que contribuyen a mejorar la experiencia de uso. Fíjate también en que convertimos el parámetro literal de texto (`tipo`) que indica el tipo de media móvil a calcular a mayúsculas (`tipo.toUpperCase())` para ponerle las cosas fáciles al sufrido usuario. El diablo está en los detalles.

Salvado este escollo, comienza el trabajo de cálculo dentro del bucle principal de la función:

```javascript
 let matrizResultado = [];
 let nf = intervalo.length;
 let nc = intervalo[0].length;

 for (let f = 0; f < nf; f++) {

   let fila = [];

   for (let c = 0; c < nc; c++) {

     switch (tipo) {

       // Media móvil SIMPLE
       case 'SIMPLE':
       ...
       // Guardar valor calculado para columna actual en vector fila
       break;

       // Media móvil ACUMULADA
       case 'ACUMULADA':
       ...
       // Guardar valor calculado para columna actual en vector fila
       break;

       // Media móvil CENTRAL
       case 'CENTRAL':
       ...
       // Guardar valor calculado para columna actual en vector fila
       break;

       // Media móvil EXPONENCIAL
       case 'EXPONENCIAL':
       ...
       // Guardar valor calculado para columna actual en vector fila
       break;

       // Media móvil PONDERADA
       case 'PONDERADA':
       ...
       // Guardar valor calculado para columna actual en vector fila
       break;       

     }     
   }

   matrizResultado.push(fila);
 }

 return matrizResultado;    
```

Tenemos pues un bucle principal sencillo como el mecanismo de un botijo:

1.  Preparamos la matriz que recogerá los valores de las series calculadas (`matrizResultado)`.
2.  Identificamos las dimensiones del intervalo de datos de entrada (`intervalo.length`, `intervalo[0].length`). Y ojo con esto :warning: , la representación es siempre de tipo matricial. Un intervalo que cuente con tan solo una fila o columna llegará igualmente a nuestra función como un vector de vectores. Cuando se empieza a programar en GAS es habitual no caer en la cuenta de esta circunstancia aparentemente obvia, tratar el intervalo como una matriz unidimensional y... pasarse un rato mirando con estupor el estupendo error que aparece en pantalla al tratar de ejecutar el código.
3.  Iteramos con sendos bucles `for` a lo ancho y largo (en ese orden) del intervalo de entrada. Sí, ya sé que `map` o `forEach` tienen más clase, pero la naturaleza iterativa del cálculo de algunas de las medias móviles me ha hecho preferir en esta ocasión volver a los clásicos.
4.  Mediante un `switch` se identifica el tipo de media móvil a calcular y se ejecuta el `case` adecuado, cuya implementación es puramente aritmética, para determinar el valor de la media móvil del elemento del intervalo en la fila y columna correspondiente.
5.  Se guarda en la matriz de resultados los valores calculados para cada fila: `matrizResultado.push(fila)`.
6.  Se devuelve como resultado de la función las series (matriz) de medias móviles calculadas: `return matrizResultado`.

Probablemente se podría haber construido una estructura más eficiente a costa de separar los cálculos de cada tipo de media móvil, pero creo que de este modo la estructura de la función resulta clara y fácilmente ampliable.

Aunque probablemente no era necesario, he tratado de optimizar los cálculos de modo que se utilice, excepto en el caso de la media móvil ponderada, una estrategia iterativa. Por ejemplo, veamos qué aspecto tiene el bloque de código que calcula la **media simple**:

```javascript
        case 'SIMPLE':

         // [posición_valor_en_serie < n] Aún no disponemos de suficientes puntos para calcular la MM
         if (f < n_puntos - 1) {
           if (rellenar) fila.push(intervalo[f][c]);
           else fila.push('');
           continue;
         }          
         // [posición_valor_en_serie = n] 1er valor para el que puede ser calculada la media móvil            
         if (f == n_puntos - 1) {
           let acumulado = 0;
           for (let i = 0; i < n_puntos; i++) acumulado += intervalo[f - i][c];
           fila.push(acumulado / n_puntos);
           continue;
         }        
         // [posición_valor_en_serie > n] Resto de valores se calculan iterativamente (mejor que fuerza bruta)
         fila.push(matrizResultado[f - 1][c] + (intervalo[f][c] - intervalo[f - n_puntos][c]) / n_puntos);

         break; 
```

La variable `f` representa la fila en la que nos encontramos, esto es, la posición del elemento actual en la serie de datos cuyas medias móviles desean calcularse. Analicemos qué pasa:

1.  La primera comprobación (`f < n_puntos - 1)` detecta, en función del tamaño especificado para nuestra bonita ventana móvil, si aún no podemos realizar el cálculo. En esa caso hará una cosa u otra dependiendo del parámetro `rellenar` ¿recuerdas?
2.  La segunda comprobación (`f == n_puntos - 1`) determina el primer elemento de la serie sobre el que debe realizarse el calculo de la media móvil de manera completa, sumando los `f - 1` valores anteriores de la serie con el actual y dividiendo entre el tamaño de la ventana.
3.  Para el resto de valores (`f > n_puntos - 1`), se calcula la media móvil del valor en función de la obtenida en la iteración inmediatamente anterior más la diferencia entre el valor actual de la serie y el más antiguo, dentro de la ventana, que ahora quedará fuera de ella (por algo esto es una media móvil), dividido por el tamaño de dicha venta. Como diría un célebre humorista hispano, _los que entran por los que van saliendo_.

# Mejoras

Se me ocurren un par de modificaciones:

*   Contemplar la posibilidad de utilizar una ventana de datos de tamaño facilitado por el usuario como parámetro también en el caso del cálculo de la media móvil exponencial.
*   Introducir la posibilidad de que el usuario proporcione un vector de pesos totalmente libre para el cálculo de la media móvil ponderada. Alguno o alguna estará pensando... ¡espera, si eso es una [convolución](https://es.wikipedia.org/wiki/Convoluci%C3%B3n)! Premio.

Creo que ambas mejoras son fácilmente encajables en la implementación actual.

# **Licencia**

© 2020 Pablo Felip Monferrer ([@pfelipm](https://twitter.com/pfelipm)). Se distribuye bajo licencia MIT.
