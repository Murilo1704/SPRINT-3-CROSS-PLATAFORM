"""
Baixa os modelos do VerdeScan a partir do GitHub Releases.

    python baixar_modelos.py

A URL base pode ser trocada pela variável VERDESCAN_MODELOS_URL.
"""

import os
import sys
import urllib.request

URL_BASE = os.environ.get(
    "VERDESCAN_MODELOS_URL",
    "https://github.com/Murilo1704/SPRINT-3-CROSS-PLATAFORM/releases/download/modelos-v3.1",
).rstrip("/")

NOMES = [
    "VERDESCAN_SEGMENTACAO_FINAL_V3",
    "VERDESCAN_CLASSIFICADOR_ORDINAL_FINAL_V3_1",
]

PASTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "modelos")


def main() -> int:
    extensao = ".keras"
    os.makedirs(PASTA, exist_ok=True)

    for nome in NOMES:
        arquivo = nome + extensao
        destino = os.path.join(PASTA, arquivo)

        if os.path.exists(destino):
            print(f"[ok] {arquivo} já existe")
            continue

        url = f"{URL_BASE}/{arquivo}"
        print(f"[baixando] {url}")

        try:
            urllib.request.urlretrieve(url, destino)
        except Exception as erro:  # noqa: BLE001
            if os.path.exists(destino):
                os.remove(destino)
            print(f"[erro] não foi possível baixar {arquivo}: {erro}")
            print(f"Baixe manualmente pela página de Releases e coloque em: {PASTA}")
            return 1

        print(f"[ok] {arquivo} ({os.path.getsize(destino) / 1_000_000:.1f} MB)")

    print("Modelos prontos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
