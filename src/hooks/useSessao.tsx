import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  carregarUsuarioLogado,
  fazerLogout,
  UsuarioLogado,
} from "../services/auth";


// ============================================================
// SESSÃO DO USUÁRIO
//
// Lê o usuário salvo uma vez ao abrir o app e compartilha com
// todas as telas. O _layout.tsx usa isso para proteger as rotas.
// ============================================================

type Sessao = {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  definirUsuario: (usuario: UsuarioLogado) => void;
  sair: () => Promise<void>;
};


const SessaoContext =
  createContext<Sessao | null>(null);


export function SessaoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    carregarUsuarioLogado()
      .then(setUsuario)
      .finally(() => setCarregando(false));
  }, []);

  const sair = useCallback(async () => {
    await fazerLogout();
    setUsuario(null);
  }, []);

  return (
    <SessaoContext.Provider
      value={{
        usuario,
        carregando,
        definirUsuario: setUsuario,
        sair,
      }}
    >
      {children}
    </SessaoContext.Provider>
  );
}


export function useSessao() {
  const sessao = useContext(SessaoContext);

  if (!sessao) {
    throw new Error(
      "useSessao precisa estar dentro de <SessaoProvider>."
    );
  }

  return sessao;
}
