import { Ionicons } from "@expo/vector-icons";

import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { cores } from "../../theme";

import Campo from "../ui/Campo";
import Card from "../ui/Card";

import { styles } from "./styles";
import TituloPasso from "./TituloPasso";


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
    <View style={styles.secao}>
      <TituloPasso
        numero={3}
        titulo="Localização"
        concluido={localizacao !== null}
      />

      <Card>
        <View style={styles.statusLocal}>
          <Ionicons
            name={localizacao ? "location" : "location-outline"}
            size={24}
            color={cores.primaria}
          />

          <View style={styles.colunaFlex}>
            <Text style={styles.statusLocalTitulo}>
              {localizacao
                ? "Localização definida"
                : "Localização será identificada automaticamente"}
            </Text>

            <Text style={styles.statusLocalTexto}>
              {textoOrigemLocalizacao()}
            </Text>

            {qualidadeLocalizacao && (
              <Text style={styles.statusLocalTexto}>
                Qualidade: {qualidadeLocalizacao}
              </Text>
            )}
          </View>
        </View>

        {localizacao && (
          <View style={styles.coordenadas}>
            <Text style={styles.coordenadaTexto}>
              Latitude: {localizacao.latitude.toFixed(6)}
            </Text>

            <Text style={styles.coordenadaTexto}>
              Longitude: {localizacao.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <Text style={styles.ajudaOpcional}>
          Coordenadas exatas (opcional): se você souber a latitude e a
          longitude, informe abaixo. Caso contrário, deixe vazio e o
          VerdeScan usará a rodovia e o KM.
        </Text>

        <View style={styles.linha}>
          <Campo
            rotulo="Latitude"
            icone="navigate-outline"
            value={latitudeManual}
            onChangeText={alterarLatitudeManual}
            placeholder="-22.8866"
            keyboardType="numbers-and-punctuation"
            estiloContainer={styles.colunaFlex}
          />

          <Campo
            rotulo="Longitude"
            icone="navigate-outline"
            value={longitudeManual}
            onChangeText={alterarLongitudeManual}
            placeholder="-47.1232"
            keyboardType="numbers-and-punctuation"
            estiloContainer={styles.colunaFlex}
          />
        </View>

        {buscandoLocalizacao && (
          <View style={styles.buscandoLocal}>
            <ActivityIndicator
              size="small"
              color={cores.primaria}
            />

            <Text style={styles.textoPequeno}>
              Localizando trecho...
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}
