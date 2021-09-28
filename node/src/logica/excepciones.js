class NumArgsError extends Error {

    constructor(num) {
        let mensaje = "Error en el número de argumentos. Deben ser " + num.toString() +
            " valores separados por un espacio."
        super(mensaje);
        this.name = NumArgsError
        this.message = "Error en el número de argumentos. Deben ser " + num.toString() +
            " valores separados por un espacio."
    }

    toString() {
        return this.message
    }
}

class CoordenateError extends Error {

    constructor() {
        super();
        this.message = "Error en el input de coordenadas. Tienen que ser valores enteros"
    }

    toString() {
        return this.message
    }
}

class Max50ValueError extends Error {
    constructor() {
        super();
        this.message = "Error, el valor máximo de cualquier coordenada debe ser 50."
    }

    toString() {
        return this.message
    }
}

class OrientationError extends Error {
    constructor() {
        super();
        this.message = "La orientacion introducida es incorrecta. " +
            "Debe ser un caracter en mayúscula que represente un punto cardinal"
    }

    toString() {
        return this.message
    }
}

class InstruccError extends Error {
    constructor() {
        super();
        this.message = "Las instrucciones introducidas son incorrectas. " +
            "Solo se aceptan letras que referencien a instrucciones implementadas y menos de 100 caracteres."
    }

    toString() {
        return this.message
    }
}


module.exports = {
    NumArgsError: NumArgsError,
    CoordenateError: CoordenateError,
    Max50ValueError: Max50ValueError,
    OrientationError: OrientationError,
    InstruccError: InstruccError

}