import { Ionicons } from "@expo/vector-icons";

import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { cores } from "../../theme";

import Botao, { NomeIcone } from "../ui/Botao";
import Card from "../ui/Card";

import { styles } from "./styles";
import TituloPasso from "./TituloPasso";


type Props = {
  analise: AnaliseState;
};


// Botão grande para usar com uma mão (câmera / galeria)
function BotaoFoto({
  icone,
  titulo,
  primario,
  onPress,
}: {
  icone: NomeIcone;
  titulo: string;
  primario?: boolean;
  onPress: () => void;
}) {
  const corTexto = primario ? cores.sobrePrimaria : cores.primariaEscura;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botaoFoto,
        primario ? styles.botaoFotoPrimario : styles.botaoFotoSecundario,
        pressed && styles.pressionado,
      ]}
    >
      <Ionicons
        name={icone}
        size={36}
        color={corTexto}
      />

      <Text style={[styles.botaoFotoTexto, { color: corTexto }]}>
        {titulo}
      </Text>
    </Pressable>
  );
}


// ============================================================
// 1. FOTO
// ============================================================

export default function SecaoFoto({ analise }: Props) {
  const {
    fotoUri,
    origemFoto,
    tirarFoto,
    selecionarFoto,
  } = analise;

  return (
    <View style={styles.secao}>
      <TituloPasso
        numero={1}
        titulo="Foto da vegetação"
        concluido={fotoUri !== null}
      />

      {fotoUri ? (
        <Card>
          <Image
            source={{ uri: fotoUri }}
            style={styles.previewImagem}
            accessibilityLabel="Prévia da foto registrada"
          />

          <View style={styles.fotoOk}>
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={cores.sucesso}
            />

            <View>
              <Text style={styles.fotoOkTexto}>
                Foto registrada
              </Text>

              <Text style={styles.textoPequeno}>
                {origemFoto === "camera"
                  ? "Foto tirada agora"
                  : "Imagem selecionada da galeria"}
              </Text>
            </View>
          </View>

          <View style={styles.linha}>
            <Botao
              titulo="Tirar nova foto"
              icone="camera-outline"
              variante="contorno"
              onPress={tirarFoto}
              estilo={styles.colunaFlex}
            />

            <Botao
              titulo="Outra da galeria"
              icone="images-outline"
              variante="contorno"
              onPress={selecionarFoto}
              estilo={styles.colunaFlex}
            />
          </View>
        </Card>
      ) : (
        <View style={styles.botoesFoto}>
          <BotaoFoto
            icone="camera"
            titulo="Tirar foto agora"
            primario
            onPress={tirarFoto}
          />

          <BotaoFoto
            icone="images-outline"
            titulo="Escolher da galeria"
            onPress={selecionarFoto}
          />
        </View>
      )}
    </View>
  );
}
