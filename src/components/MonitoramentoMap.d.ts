// Tipos do mapa para o TypeScript.
// Em tempo de execução, o Metro escolhe automaticamente
// MonitoramentoMap.native.tsx (iOS/Android) ou
// MonitoramentoMap.web.tsx (navegador).

import { Ocorrencia } from "../types/Ocorrencia";

type Props = {
  ocorrencias: Ocorrencia[];
};

export default function MonitoramentoMap(
  props: Props
): React.JSX.Element;
