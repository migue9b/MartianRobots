const Robot = require("./Robot");
const Ubicacion = require("./Ubicacion");
const Orientacion = require("./Orientacion");
const Instruccion = require("./Instruccion");
const Mapa = require("./Mapa")
const Excepcion = require("./excepciones")
const prompt = require('prompt-sync')();
const {cloneDeep} = require('lodash');


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
    return args.length === num
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
    let act_ins = Object.keys(new Instruccion()).filter(function (e) {
        return e.charAt(0) === e.charAt(0).toUpperCase()
    })
    act_ins = act_ins.map(function (e) {
        return e.charAt(0)
    })
    for (let i = 0; i < instrucciones.length; i++) {
        if (!act_ins.includes(instrucciones.charAt(i))) {
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
    process.stdout.write(
        "Posicion del robot: " +
        r1.posicion[0].x.toString() + ", " +
        r1.posicion[0].y.toString() + " " +
        r1.posicion[1].orientacion
    )
    if (r1.LOST) process.stdout.write(" LOST")
    console.log()
}

function in_lost_robots(arr1, lost_robots) {
    for (let i = 0; i < lost_robots.length; i++) {
        if (JSON.stringify(arr1) === JSON.stringify(lost_robots[i])) return true
    }
    return false
}


// function execution_handler(m1, r1, i1, robot_movements, lost_robots) {
//     for (let i = 0; i < i1.length; i++) {
//         if (i1[i] === "FORWARD") {
//             r1.move_forward()
//         } else if (i1[i] === "RIGHT") {
//             r1.move_right()
//         } else if (i1[i] === "LEFT") {
//             r1.move_left()
//         }
//         let aux = JSON.parse(JSON.stringify(r1))
//         if (is_lost(m1, r1)) {
//             let y = parseInt(robot_movements[robot_movements.length - 1].posicion[0].y)
//             let x = parseInt(robot_movements[robot_movements.length - 1].posicion[0].x)
//             r1 = JSON.parse(JSON.stringify(robot_movements[robot_movements.length - 1]))
//             if (!in_lost_robots([x, y], lost_robots)) {
//                 r1.LOST = true
//                 lost_robots.push([x, y])
//                 break
//             }
//         } else {
//             robot_movements.push(aux)
//         }
//     }
//     print_robot(r1)
// }

function main() {
    let m1 = map_handler()
    let lost_robots = []
    while (true) {
        if (prompt("Escriba 'exit' para salir. cualquier otra tecla para continuar: ") === "exit") break
        let r1 = robot_handler()
        let robot_movements = [cloneDeep(r1)]
        let i1 = instruccion_handler()
        for (let i = 0; i < i1.length; i++) {
            if (i1[i] === "FORWARD") {
                r1.move_forward()
            } else if (i1[i] === "RIGHT") {
                r1.move_right()
            } else if (i1[i] === "LEFT") {
                r1.move_left()
            }
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
        print_robot(r1)
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
    main();
    // let prueba = [[2, 3], [1, 2], [9, 6]]
    // console.log(prueba.includes([1, 2]))
    // // console.log(prueba.some([1, 2]))
    // for (let i = 0; i < prueba.length; i++) {
    //     if (JSON.stringify([1, 2]) === JSON.stringify(prueba[i])) console.log(prueba[i])
    // }

    // let r1 = new Robot([new Ubicacion(3, 4), new Orientacion("ESTE")], false)
    // let r2 = cloneDeep(r1)
    // r1.move_forward()
    // r2.LOST = true
    // print_robot(r1)
    // print_robot(r2)

}