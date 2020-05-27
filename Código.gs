/**
 * Calcula la media móvil de un intervalo de datos utilizando diversos métodos.
 * Para el cálculo de la media móvil EXPONENCIAL se utiliza el factor de decrecimiento 2 / ( n + 1).
 * Para el cálcula de la media móvil PONDERADA se utiliza la posición del valor como peso.
 * Los parámetros n_puntos y rellenar no se utilizan cuando se calculan medias móviles ACUMULADA o EXPONENCIAL.
 * 
 * @param {A2:A10} intervalo Intervalo de datos, que se suponen en columnas.
 * @param {4} n_puntos Número de valores a promediar (3 por defecto). Solo tiene efecto en
 * el cálculo de las medias móviles NORMAL, CENTRAL y PONDERADA.
 * @param {"NORMAL"} tipo Tipo de media a calcular (ACUMULADA | CENTRAL | EXPONENCIAL | [NORMAL] | PONDERADA).
 * @param {true} rellenar Indica si se deben tomar los valores del conjunto de datos de origen cuando aún no se dispone del 
 * número de puntos necesario para calcular el valor de la media móvil ([TRUE] | FALSE). Solo tiene efecto en
 * el cálculo de las medias móviles NORMAL, CENTRAL y PONDERADA.
 *
 * @return Intervalo de datos calculados
 *
 * @customfunction
 *
 * MIT License
 * Copyright (c) 2020 Pablo Felip Monferrer(@pfelipm)
 */ 

function MEDIAMOVIL(intervalo, tipo = 'NORMAL', n_puntos = 3, rellenar = true) {

  // Control de parámetros inicial
  
  if (typeof intervalo == 'undefined') throw('No se ha indicado el intervalo.');
  if (typeof n_puntos != 'number') throw('Falta número de elementos o no es número.');
  if (n_puntos < 2) throw ('N debe ser mayor que 1.');
  if (typeof tipo != 'string') throw('Tipo de media incorrecto.');
  tipo = tipo.toUpperCase();
  if (!(["NORMAL", "ACUMULADA", "CENTRAL", "EXPONENCIAL", "PONDERADA"].some(t => t == tipo))) throw('Tipo de media desconocido');
  if (typeof rellenar != 'boolean') throw('Indicación de relleno de datos errónea, debe ser VERDADERO o FALSO');
  if (intervalo.length < n_puntos) throw('No hay suficientes valores en el intérvalo.');
  if (tipo == 'CENTRAL' && n_puntos % 2 == 0) throw('El nº de puntos debe ser impar al utilizar una media móvil central.');
  
  
  // Parece que todo correcto, calculemos la media móvil
  
  let matrizResultado = [];
  let nf = intervalo.length;
  let nc = intervalo[0].length;
  
  for (let f = 0; f < nf; f++) {
    
    let fila = [];
    
    for (let c = 0; c < nc; c++) {
      
      switch (tipo) {
      
        // Media móvil NORMAL
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case 'NORMAL':
          
          // [posición_valor_en_serie < n] Aún no disponemos de suficientes puntos para calcular la MM
          if (f < n_puntos - 1) {
            if (rellenar) fila.push(intervalo[f][c]);
            else fila.push('');
            continue;
          }          
          // [posición_valor_en_serie = n] 1er valor para el que puede ser calculada la media móvil            
          if ( f == n_puntos - 1) {
            let acumulado = 0;
            for (let i = 0; i < n_puntos; i++) acumulado += intervalo[f - i][c];
            fila.push(acumulado / n_puntos);
            continue;
          }         
          // [posición_valor_en_serie > n] Resto de valores se calculan iterativamente (mejor que fuerza bruta)
          fila.push(matrizResultado[f - 1][c] + (intervalo[f][c] - intervalo[f - n_puntos][c]) / n_puntos);
          
          break;
        
        // Media móvil ACUMULADA
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case 'ACUMULADA':
          
          // [posición_valor_en_serie = 1] Aún no disponemos de suficientes puntos para calcular la MM       
          if (f == 0) {
            fila.push(intervalo[f][c]);
            continue;
          }
          // [posición_valor_en_serie > 1] Resto de valores se calculan iterativamente (mejor que fuerza bruta)
          fila.push((intervalo[f][c] + f * matrizResultado[f - 1][c]) / (f + 1));
                      
          break;

        // Media móvil CENTRAL          
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case 'CENTRAL':
          
          const ventana = (n_puntos - 1) / 2;
          
          // [posición_valor_en_serie < (n - 1) / 2] Aún no disponemos de suficientes puntos para calcular la MM
          if (f < ventana) {
            if (rellenar) fila.push(intervalo[f][c]);
            else fila.push('');
            continue;
          }          
          // [posición_valor_en_serie dispone de suficientes valores pasados y futuros] Intervalo en el que es posible calcular la media central
          if ( f >= ventana && f < nf - ventana) {
            let acumulado = intervalo[f][c];
            for (let i = 1; i <= ventana; i++) acumulado += intervalo[f - i][c] +  intervalo[f + i][c];
            fila.push(acumulado / n_puntos);
            continue;
          }         
          // [posición_valor_en_serie no tiene suficientes valores futuros] Ya no disponemos de suficientes puntos para calcular la MM
          if (rellenar) fila.push(intervalo[f][c]);
          else fila.push('');
          
          break;

        // Media móvil EXPONENCIAL
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case 'EXPONENCIAL':
          
          // [posición_valor_en_serie = 1] Aún no disponemos de suficientes puntos para cálculo iterativo
          if (f == 0) {
            fila.push(intervalo[f][c]);
            continue;
          }        
          // [posición_valor_en_serie > 1] Calculamos MM de manera iterativo
          const k = 2 / (n_puntos + 1); // factor de decrecimiento
          fila.push(intervalo[f][c] * k + matrizResultado[f - 1][c] * (1 - k));
          
          break;
 
        // Media móvil PONDERADA
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case 'PONDERADA':
          
          // [posición_valor_en_serie < n] Aún no disponemos de suficientes puntos para calcular la MM
          if (f < n_puntos - 1) {
            if (rellenar) fila.push(intervalo[f][c]);
            else fila.push('');
            continue;
          }          
          // [posición_valor_en_serie >= n] Calculamos MM de manera no iterativa (hacerlo rompería estructura función).          
          const denominador = n_puntos * (n_puntos + 1) / 2; // peso = posición en la serie temporal
          let acumulado = 0;
          for (let i = 0; i < n_puntos; i++) acumulado += intervalo[f - i][c] * (n_puntos - i);
          fila.push(acumulado / denominador);
       
          break;      
      }     
    }
       
    matrizResultado.push(fila);
  }
  
  return matrizResultado;    
  
}