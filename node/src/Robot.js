const Ubicacion = require("./Ubicacion");
const Orientacion = require("./Orientacion");

class Robot {
    posicion = [new Ubicacion(null, null), new Orientacion(null)];
    LOST = false;

    constructor(posicion, LOST) {
        this.posicion = posicion;
        this.LOST = LOST;
        this.robot_id = this.#get_uuid();
    }

    #get_uuid = function () {
        let u = '', i = 0;
        while (i++ < 36) {
            const c = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i - 1], r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            u += (c === '-' || c === '4') ? c : v.toString(16)
        }
        return u;
    }

    #move_default = function () {
        let ori_points = Object.keys(new Orientacion()).filter(function (element) {
            return element.charAt(0) === element.charAt(0).toUpperCase()
        })
        let index = ori_points.indexOf(this.posicion[1].orientacion)
        return [ori_points, index]
    }

    move_right() {
        let val = this.#move_default()
        let ori_points = val[0]
        let index = val[1]
        let new_ori;
        if (index !== ori_points.length - 1) {
            new_ori = index + 1
        } else {
            new_ori = 0
        }
        this.posicion[1] = new Orientacion(ori_points[new_ori])
    }

    move_left() {
        let val = this.#move_default()
        let ori_points = val[0]
        let index = val[1]
        let new_ori;
        if (index !== 0) {
            new_ori = index - 1
        } else {
            new_ori = ori_points.length - 1
        }
        this.posicion[1] = new Orientacion(ori_points[new_ori])
    }

    move_forward() {
        let options = Object.assign({
            "NORTE": [0, 1], "ESTE": [1, 0], "SUR": [0, -1], "OESTE": [-1, 0]
        })
        let operation = options[this.posicion[1].orientacion]
        this.posicion[0].x = parseInt(this.posicion[0].x + operation[0])
        this.posicion[0].y = parseInt(this.posicion[0].y + operation[1])
    }
}

module.exports = Robot