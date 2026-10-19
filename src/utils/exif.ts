import {
  Localizacao,
} from "../types/Analise";


// ============================================================
// LEITURA DO GPS SALVO NO EXIF DA FOTO
//
// Usado por src/hooks/useAnalise.ts quando a foto vem da galeria.
// Aceita os formatos de EXIF do iOS, do Android e do navegador.
// ============================================================


function normalizarNomeChave(
  chave: string
) {
  return chave
    .replace(
      /[^a-zA-Z0-9]/g,
      ""
    )
    .toUpperCase();
}


function obterValorExif(
  exif:
    Record<string, any> |
    null |
    undefined,

  nomes: string[]
) {
  if (!exif) {
    return undefined;
  }


  const nomesNormalizados =
    nomes.map(
      normalizarNomeChave
    );


  for (
    const [chave, valor]
    of Object.entries(exif)
  ) {
    const chaveNormalizada =
      normalizarNomeChave(
        chave
      );


    if (
      nomesNormalizados.includes(
        chaveNormalizada
      )
    ) {
      return valor;
    }
  }


  return undefined;
}


// ============================================================
// CONVERTER VALORES EXIF
// ============================================================

function converterRacional(
  valor: any
): number | null {

  if (
    typeof valor ===
      "number" &&
    Number.isFinite(
      valor
    )
  ) {
    return valor;
  }


  if (
    typeof valor ===
    "string"
  ) {
    const texto =
      valor.trim();


    if (!texto) {
      return null;
    }


    if (
      texto.includes("/")
    ) {
      const partes =
        texto.split("/");


      if (
        partes.length === 2
      ) {
        const numerador =
          Number(
            partes[0]
          );

        const denominador =
          Number(
            partes[1]
          );


        if (
          Number.isFinite(
            numerador
          ) &&
          Number.isFinite(
            denominador
          ) &&
          denominador !== 0
        ) {
          return (
            numerador /
            denominador
          );
        }
      }
    }


    const numero =
      Number(
        texto.replace(
          ",",
          "."
        )
      );


    if (
      Number.isFinite(
        numero
      )
    ) {
      return numero;
    }
  }


  if (
    valor &&
    typeof valor ===
      "object"
  ) {
    const numerador =
      Number(
        valor.numerator ??
        valor.numerador
      );

    const denominador =
      Number(
        valor.denominator ??
        valor.denominador
      );


    if (
      Number.isFinite(
        numerador
      ) &&
      Number.isFinite(
        denominador
      ) &&
      denominador !== 0
    ) {
      return (
        numerador /
        denominador
      );
    }
  }


  return null;
}


// ============================================================
// CONVERTER COORDENADA EXIF
// ============================================================

function converterCoordenadaExif(
  valor: any
): number | null {

  if (
    typeof valor ===
      "number" &&
    Number.isFinite(
      valor
    )
  ) {
    return valor;
  }


  if (
    Array.isArray(
      valor
    )
  ) {

    if (
      valor.length >= 3
    ) {
      const graus =
        converterRacional(
          valor[0]
        );

      const minutos =
        converterRacional(
          valor[1]
        );

      const segundos =
        converterRacional(
          valor[2]
        );


      if (
        graus !== null &&
        minutos !== null &&
        segundos !== null
      ) {
        return (
          Math.abs(
            graus
          ) +
          minutos / 60 +
          segundos / 3600
        );
      }
    }


    if (
      valor.length === 1
    ) {
      return converterRacional(
        valor[0]
      );
    }
  }


  if (
    typeof valor ===
    "string"
  ) {
    const texto =
      valor.trim();


    if (!texto) {
      return null;
    }


    if (
      /^-?\d+([.,]\d+)?$/.test(
        texto
      )
    ) {
      const numero =
        Number(
          texto.replace(
            ",",
            "."
          )
        );


      return Number.isFinite(
        numero
      )
        ? numero
        : null;
    }


    const partes =
      texto
        .replace(
          /[°'"]/g,
          " "
        )
        .split(
          /[\s,]+/
        )
        .filter(
          Boolean
        );


    if (
      partes.length >= 3
    ) {
      const graus =
        converterRacional(
          partes[0]
        );

      const minutos =
        converterRacional(
          partes[1]
        );

      const segundos =
        converterRacional(
          partes[2]
        );


      if (
        graus !== null &&
        minutos !== null &&
        segundos !== null
      ) {
        return (
          Math.abs(
            graus
          ) +
          minutos / 60 +
          segundos / 3600
        );
      }
    }
  }


  return null;
}


// ============================================================
// EXTRAIR GPS DA FOTO
// ============================================================

export function extrairLocalizacaoExif(
  exif:
    Record<string, any> |
    null |
    undefined
): Localizacao | null {

  if (!exif) {
    return null;
  }


  const valorLatitude =
    obterValorExif(
      exif,
      [
        "latitude",
        "gpslatitude",
      ]
    );


  const valorLongitude =
    obterValorExif(
      exif,
      [
        "longitude",
        "gpslongitude",
      ]
    );


  let latitude =
    converterCoordenadaExif(
      valorLatitude
    );

  let longitude =
    converterCoordenadaExif(
      valorLongitude
    );


  if (
    latitude === null ||
    longitude === null
  ) {
    return null;
  }


  const latitudeRef =
    String(
      obterValorExif(
        exif,
        [
          "gpslatituderef",
          "latituderef",
        ]
      ) ??
      ""
    )
      .trim()
      .toUpperCase();


  const longitudeRef =
    String(
      obterValorExif(
        exif,
        [
          "gpslongituderef",
          "longituderef",
        ]
      ) ??
      ""
    )
      .trim()
      .toUpperCase();


  if (
    latitudeRef === "S"
  ) {
    latitude =
      -Math.abs(
        latitude
      );
  }


  if (
    latitudeRef === "N"
  ) {
    latitude =
      Math.abs(
        latitude
      );
  }


  if (
    longitudeRef === "W"
  ) {
    longitude =
      -Math.abs(
        longitude
      );
  }


  if (
    longitudeRef === "E"
  ) {
    longitude =
      Math.abs(
        longitude
      );
  }


  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }


  return {
    latitude,
    longitude,
    precisao:
      null,
  };
}
