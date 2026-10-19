"""
Carrega os modelos .keras do VerdeScan com Keras 3.

Por padrão usa o backend JAX (mais leve que o TensorFlow e sem
conversão de modelo). Para usar TensorFlow, defina KERAS_BACKEND=tensorflow.

Interface usada no main.py:
    modelo.input_shape, modelo.output_shape, modelo(batch) -> np.ndarray
"""

import os

os.environ.setdefault("KERAS_BACKEND", "jax")
os.environ.setdefault("JAX_PLATFORMS", "cpu")

import keras  # noqa: E402
import numpy as np  # noqa: E402


class ModeloKeras:
    def __init__(self, caminho_keras):
        self._modelo = keras.models.load_model(caminho_keras, compile=False)
        self.backend = f"keras {keras.__version__} ({keras.backend.backend()})"
        self.input_shape = tuple(self._modelo.input_shape)
        self.output_shape = tuple(self._modelo.output_shape)

    def __call__(self, batch, training=False):
        dados = np.asarray(batch, dtype="float32")
        return np.asarray(self._modelo(dados, training=False))


def carregar_modelo(caminho_keras):
    modelo = ModeloKeras(caminho_keras)
    print(f"  backend: {modelo.backend}")
    return modelo


def sigmoid(valores):
    valores = np.asarray(valores, dtype=np.float32)
    return 1.0 / (1.0 + np.exp(-valores))
