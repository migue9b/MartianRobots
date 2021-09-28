const Robot = require("./Robot");
const Ubicacion = require("./Ubicacion");
const Orientacion = require("./Orientacion");
const Instruccion = require("./Instruccion");
const Mapa = require("./Mapa")
const Excepcion = require("./excepciones")
const prompt = require('prompt-sync')();
const {cloneDeep} = require('lodash');
const database = require("../database/database")


function parser(object, value) {
    let li = Object.keys(new object()).filter(function (e) {
        return e.charAt(0) === value
    })
    if (li.length !== 0) {
        return li.reduce(function (i, j) {
            return i + j
        })
    } else {
        return ""
    }
}

function parse_orientacion(orientacion) {
    return parser(Orientacion, orientacion)
}

function parse_instruccion(instruccion) {
    return parser(Instruccion, instruccion)
}

function are_integers(x, y) {
    return !isNaN(parseInt(x)) && !isNaN(parseInt(y))
}

function check_num_args(args, num) {
    args = args.split(" ")
    return args.length === num && args[0] !== ''
}

function map_handler() {
    while (true) {
        try {
            const map_size = prompt("Introduce la coordenada superior derecha: ")
            if (!check_num_args(map_size, 2)) throw new Excepcion.NumArgsError(2)
            let x = map_size.split(" ")[0]
            let y = map_size.split(" ")[1]
            if (!are_integers(x, y)) throw new Excepcion.CoordenateError()
            if (parseInt(x) > 50 || parseInt(y) > 50) throw new Excepcion.Max50ValueError()
            return new Mapa(new Ubicacion(parseInt(x), parseInt(y)))
        } catch (error) {
            console.log(error.message)
        }
    }
}

function check_orientation(orientacion) {
    let or_list = Object.keys(new Orientacion()).filter(function (e) {
        return e.charAt(0) === e.charAt(0).toUpperCase()
    })
    for (let i = 0; i < or_list.length; i++) {
        if (orientacion === or_list[i].charAt(0)) {
            return true
        }
    }
    return false
}

function robot_handler() {
    while (true) {
        try {
            let robot_pos = prompt("Introduce las coordenadas y la orientación para el robot: ")
            if (!check_num_args(robot_pos, 3)) throw new Excepcion.NumArgsError(3)
            let x = robot_pos.split(" ")[0]
            let y = robot_pos.split(" ")[1]
            let o = robot_pos.split(" ")[2]
            if (!are_integers(x, y)) throw new Excepcion.CoordenateError()
            if (parseInt(x) > 50 || parseInt(y) > 50) throw new Excepcion.Max50ValueError()
            if (!check_orientation(o)) throw new Excepcion.OrientationError()
            return new Robot([new Ubicacion(parseInt(x), parseInt(y)),
                new Orientacion(parse_orientacion(o))], false)
        } catch (error) {
            console.log(error.message)
        }
    }
}

function check_instructions(instrucciones) {
    if (instrucciones.length >= 100) return false
    let actual_inst = Object.keys(new Instruccion()).filter(function (e) {
        return e.charAt(0) === e.charAt(0).toUpperCase()
    })
    actual_inst = actual_inst.map(function (e) {
        return e.charAt(0)
    })
    for (let i = 0; i < instrucciones.length; i++) {
        if (!actual_inst.includes(instrucciones.charAt(i))) {
            return false
        }
    }
    return true
}

function instruccion_handler() {
    while (true) {
        try {
            let robot_ins = prompt("Introduce las instrucciones: ")
            if (!check_num_args(robot_ins, 1)) throw new Excepcion.NumArgsError(1)
            if (!check_instructions(robot_ins)) throw new Excepcion.InstruccError()
            return robot_ins.split("").map(function (e) {
                return parse_instruccion(e)
            })
        } catch (error) {
            console.log(error.message)
        }
    }
}

function is_lost(mapa, robot) {
    let rx = parseInt(robot.posicion[0].x)
    let ry = parseInt(robot.posicion[0].y)
    let mx = parseInt(mapa.sup_dcha.x)
    let my = parseInt(mapa.sup_dcha.y)
    return rx > mx || ry > my || rx < 0 || ry < 0
}

function print_robot(r1) {
    let message =
        r1.posicion[0].x.toString() + ", " +
        r1.posicion[0].y.toString() + " " +
        r1.posicion[1].orientacion

    if (r1.LOST) message = message + " LOST"
    return message
}

function in_lost_robots(arr1, lost_robots) {
    for (let i = 0; i < lost_robots.length; i++) {
        if (JSON.stringify(arr1) === JSON.stringify(lost_robots[i])) return true
    }
    return false
}


function execution_handler(m1, r1, i1, robot_movements, lost_robots) {
    let handler = new Map(Object.entries(Instruccion.inst_method))
    for (let i = 0; i < i1.length; i++) {
        eval("r1." + handler.get(i1[i]))
        let aux = cloneDeep(r1)
        if (is_lost(m1, r1)) {
            let y = parseInt(robot_movements[robot_movements.length - 1].posicion[0].y)
            let x = parseInt(robot_movements[robot_movements.length - 1].posicion[0].x)
            r1 = cloneDeep(robot_movements[robot_movements.length - 1])
            if (!in_lost_robots([x, y], lost_robots)) {
                r1.LOST = true
                lost_robots.push([x, y])
                break
            }
        } else {
            robot_movements.push(aux)
        }
    }
    console.log(print_robot(r1))
    return [r1, lost_robots]
}

async function main() {
    let m1 = map_handler()
    let lost_robots = []
    while (true) {
        let r1 = robot_handler()
        let robot_movements = [cloneDeep(r1)]
        let i1 = instruccion_handler()
        let aux_exec = execution_handler(m1, r1, i1, robot_movements, lost_robots)
        lost_robots.concat(aux_exec[1])
        await database.MongoBot.addRobot(aux_exec[0], i1)
        if (prompt("Escriba 'exit' para salir. cualquier otra tecla para continuar: ") === "exit") break
    }
}


if (require.main === module) {
    let message = `

    # ------------------------------------------------------------------
    # [migue9b] Martian Robots
    #
    #
    #    The surface of Mars can be modelled by a rectangular
    #    grid around which robots are able to move according
    #    to instructions provided from Earth
    #
    #
    # URL: https://github.com/migue9b/MartianRobots
    # ------------------------------------------------------------------
    `
    console.log(message)

    async function iniciar() {
        await database.MongoBot.init()
        await main()
        await database.MongoBot.client.close().then(console.log("Desconectado"))
    }

    iniciar()
}

module.exports = {

    execution_handler: execution_handler,
    parse_instruccion: parse_instruccion,
    parse_orientacion: parse_orientacion,
    print_robot: print_robot

}