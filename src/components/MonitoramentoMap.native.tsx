import { router } from "expo-router";

import {
  useEffect,
  useRef,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import {
  cores,
  raio,
} from "../theme";

import { Ocorrencia } from "../types/Ocorrencia";


type Props = {
  ocorrencias: Ocorrencia[];
};


const DESCRICAO_CLASSE: Record<Ocorrencia["classe"], string> = {
  NORMAL: "Vegetação normal",
  ATENCAO: "Vegetação requer atenção",
  CRITICO: "Vegetação crítica",
};


export default function MonitoramentoMap({
  ocorrencias,
}: Props) {
  const mapRef = useRef<MapView | null>(null);


  // =========================================================
  // SOMENTE PONTOS COM GPS VÁLIDO
  // =========================================================

  const pontosValidos = ocorrencias.filter((ocorrencia) => {
    const latitude = Number(ocorrencia.latitude);
    const longitude = Number(ocorrencia.longitude);

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      !(latitude === 0 && longitude === 0)
    );
  });


  // =========================================================
  // CENTRALIZAR MAPA QUANDO OS DADOS MUDAREM
  // =========================================================

  useEffect(() => {
    if (pontosValidos.length === 0) {
      return;
    }

    const coordenadas = pontosValidos.map((ocorrencia) => ({
      latitude: Number(ocorrencia.latitude),
      longitude: Number(ocorrencia.longitude),
    }));

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordenadas, {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [ocorrencias]);


  // =========================================================
  // REGIÃO INICIAL
  // =========================================================

  const primeira = pontosValidos[0];

  const regiaoInicial = {
    latitude: primeira ? Number(primeira.latitude) : -23.5505,
    longitude: primeira ? Number(primeira.longitude) : -46.6333,
    latitudeDelta: primeira ? 0.08 : 0.3,
    longitudeDelta: primeira ? 0.08 : 0.3,
  };


  return (
    <View
      style={styles.container}
      accessibilityLabel={`Mapa com ${pontosValidos.length} pontos monitorados`}
    >
      <MapView
        ref={mapRef}
        style={styles.mapa}
        initialRegion={regiaoInicial}
        showsUserLocation
        showsMyLocationButton
      >
        {pontosValidos.map((ocorrencia) => (
          <Marker
            key={ocorrencia.id}
            coordinate={{
              latitude: Number(ocorrencia.latitude),
              longitude: Number(ocorrencia.longitude),
            }}
            pinColor={cores.risco[ocorrencia.classe].cor}
            title={`${ocorrencia.rodovia} • KM ${ocorrencia.km}`}
            description={DESCRICAO_CLASSE[ocorrencia.classe]}
            onCalloutPress={() =>
              router.push({
                pathname: "/trecho-detalhes",
                params: { rodovia: ocorrencia.rodovia },
              })
            }
          />
        ))}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    borderRadius: raio.lg,
    overflow: "hidden",
    backgroundColor: cores.primariaClara,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  mapa: {
    width: "100%",
    height: "100%",
  },
});
