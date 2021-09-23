class Error(Exception):
    pass


class NumArgsError(Exception):
    def __init__(self, num):
        self.num = num
        self.message = (
            "Error en el número de argumentos. Deben ser "
            + str(num)
            + " valores separados por un espacio."
        )
        super().__init__(self.message)

    def __str__(self) -> str:
        return self.message


class CoordenateError(Exception):
    def __init__(
        self, message="Error en el input de coordenadas. Tienen que ser valores enteros"
    ):
        self.message = message
        super().__init__(self.message)

    def __str__(self) -> str:
        return self.message


class Max50ValueError(Exception):
    def __init__(
        self, message="Error, el valor máximo de cualquier coordenada debe ser 50."
    ):
        self.message = message
        super().__init__(self.message)

    def __str__(self) -> str:
        return self.message


class OrientationError(Exception):
    def __init__(
        self,
        message="La orientacion introducida es incorrecta. Debe ser un caracter en mayúscula que represente un punto "
        "cardinal",
    ):
        self.message = message
        super().__init__(message)

    def __str__(self) -> str:
        return self.message


class InstruccError(Exception):
    def __init__(
        self,
        message="Las instrucciones introducidas son incorrectas. Solo se aceptan letras que referencien a instrucciones implementadas.",
    ):
        self.message = message
        super().__init__(message)

    def __str__(self) -> str:
        return self.message
