const Ubicacion = require("./Ubicacion");

class Mapa {
    sup_dcha = new Ubicacion(null, null)
    inf_izq = new Ubicacion(0, 0)

    constructor(sup_dcha) {
        this.sup_dcha = sup_dcha;
    }
}

module.exports = Mapa