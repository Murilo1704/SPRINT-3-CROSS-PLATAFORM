import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        1. Foto da vegetação
      </Text>

      <View style={styles.card}>
        {fotoUri ? (
          <>
            <Image
              source={{ uri: fotoUri }}
              style={styles.previewImage}
            />

            <Text style={styles.successText}>
              ✓ Foto registrada
            </Text>

            <Text style={styles.smallText}>
              {origemFoto === "camera"
                ? "Foto tirada agora"
                : "Imagem selecionada da galeria"}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={tirarFoto}
            >
              <Text style={styles.primaryButtonText}>
                Tirar nova foto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={selecionarFoto}
            >
              <Text style={styles.secondaryButtonText}>
                Escolher outra da galeria
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.icon}>
              📷
            </Text>

            <Text style={styles.cardTitle}>
              Registre a vegetação
            </Text>

            <Text style={styles.cardText}>
              Tire uma foto ou selecione uma imagem existente.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={tirarFoto}
            >
              <Text style={styles.primaryButtonText}>
                Tirar foto agora
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={selecionarFoto}
            >
              <Text style={styles.secondaryButtonText}>
                Escolher da galeria
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
