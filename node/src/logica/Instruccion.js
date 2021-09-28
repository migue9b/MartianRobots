class Instruccion {
    LEFT = "LEFT"
    RIGHT = "RIGHT"
    FORWARD = "FORWARD"

    static inst_method = {
        "LEFT": "move_left()",
        "RIGHT": "move_right()",
        "FORWARD": "move_forward()"
    }

    static prueba = 'mongoler'

    constructor(instruccion) {
        this.instruccion = instruccion
    }
}

module.exports = Instruccion