import {
  ImageManipulator,
  SaveFormat,
} from "expo-image-manipulator";


// ============================================================
// GARANTIR JPEG
//
// No iPhone, fotos da galeria costumam vir em HEIC, mesmo com
// quality < 1 no expo-image-picker. A API (Pillow) não lê HEIC,
// então convertemos para JPEG antes de usar a imagem.
// O GPS do EXIF é lido antes da conversão, direto do picker.
// ============================================================

export function ehHeic(
  uri: string,
  mimeType?: string | null
) {
  const tipo =
    (mimeType ?? "").toLowerCase();

  const endereco =
    uri.toLowerCase().split("?")[0];

  return (
    tipo.includes("heic") ||
    tipo.includes("heif") ||
    endereco.endsWith(".heic") ||
    endereco.endsWith(".heif")
  );
}


export async function garantirJpeg(
  uri: string,
  mimeType?: string | null
): Promise<string> {

  if (!ehHeic(uri, mimeType)) {
    return uri;
  }

  try {
    const imagem =
      await ImageManipulator
        .manipulate(uri)
        .renderAsync();

    const convertida =
      await imagem.saveAsync({
        compress: 0.8,
        format: SaveFormat.JPEG,
      });

    return convertida.uri;

  } catch (erro) {
    console.log(
      "Não foi possível converter HEIC para JPEG:",
      erro
    );

    return uri;
  }
}
