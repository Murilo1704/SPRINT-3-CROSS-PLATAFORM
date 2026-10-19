import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


// ============================================================
// 3. LOCALIZAÇÃO
// ============================================================

export default function SecaoLocalizacao({ analise }: Props) {
  const {
    localizacao,
    qualidadeLocalizacao,
    latitudeManual,
    longitudeManual,
    alterarLatitudeManual,
    alterarLongitudeManual,
    buscandoLocalizacao,
    textoOrigemLocalizacao,
  } = analise;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        3. Localização
      </Text>

      <View style={[styles.card, styles.formCard]}>
        <View style={styles.locationStatus}>
          <Text style={styles.locationStatusTitle}>
            📍 {localizacao
              ? "Localização definida"
              : "Localização será identificada automaticamente"}
          </Text>

          <Text style={styles.locationStatusText}>
            {textoOrigemLocalizacao()}
          </Text>

          {qualidadeLocalizacao && (
            <Text style={styles.qualityText}>
              Qualidade: {qualidadeLocalizacao}
            </Text>
          )}
        </View>

        {localizacao && (
          <View style={styles.coordinatesBox}>
            <Text style={styles.coordinateText}>
              Latitude: {localizacao.latitude.toFixed(6)}
            </Text>

            <Text style={styles.coordinateText}>
              Longitude: {localizacao.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <View style={styles.optionalBox}>
          <Text style={styles.optionalTitle}>
            Coordenadas exatas (opcional)
          </Text>

          <Text style={styles.optionalHelp}>
            Se você souber a latitude e longitude exatas,
            pode informá-las para melhorar a precisão.
            Caso contrário, deixe os campos vazios e o
            VerdeScan usará a rodovia e o KM.
          </Text>

          <Text style={styles.inputLabel}>
            Latitude
          </Text>

          <TextInput
            style={styles.input}
            value={latitudeManual}
            onChangeText={alterarLatitudeManual}
            placeholder="-22.8866235"
            placeholderTextColor="#9AA39C"
            keyboardType="numbers-and-punctuation"
          />

          <Text style={[styles.inputLabel, styles.secondInputLabel]}>
            Longitude
          </Text>

          <TextInput
            style={styles.input}
            value={longitudeManual}
            onChangeText={alterarLongitudeManual}
            placeholder="-47.1231735"
            placeholderTextColor="#9AA39C"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        {buscandoLocalizacao && (
          <View style={styles.loadingLocation}>
            <ActivityIndicator
              size="small"
              color="#21894A"
            />

            <Text style={styles.loadingLocationText}>
              Localizando trecho...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
