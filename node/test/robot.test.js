const app = require('../src/app')
const Mapa = require('../src/Mapa')
const Robot = require('../src/Robot')
const Instruccion = require('../src/Instruccion')
const Ubicacion = require('../src/Ubicacion')
const Orientacion = require("../src/Orientacion");
const {cloneDeep} = require("lodash");


test('robot1', () => {
    let m1 = new Mapa(new Ubicacion(5, 3))
    let r1 = new Robot([new Ubicacion(3, 2), new Orientacion(app.parse_orientacion("N"))], false)
    let i1 = "FRRFLLFFRRFLL".split("").map(function (e) {
        return app.parse_instruccion(e)
    })
    let robot_movements = [cloneDeep(r1)]
    let lost_robots = []
    expect(app.print_robot(app.execution_handler(m1, r1, i1, robot_movements, lost_robots)[0])).toBe("3, 3 NORTE LOST");
});

test('robot2', () => {
    let m1 = new Mapa(new Ubicacion(5, 3))
    let r1 = new Robot([new Ubicacion(1, 1), new Orientacion(app.parse_orientacion("E"))], false)
    let i1 = "RFRFRFRF".split("").map(function (e) {
        return app.parse_instruccion(e)
    })
    let robot_movements = [cloneDeep(r1)]
    let lost_robots = []
    expect(app.print_robot(app.execution_handler(m1, r1, i1, robot_movements, lost_robots)[0])).toBe("1, 1 ESTE");
})

test('robot3', () => {
    let m1 = new Mapa(new Ubicacion(5, 3))
    let r1 = new Robot([new Ubicacion(0, 3), new Orientacion(app.parse_orientacion("O"))], false)
    let i1 = "LLFFFRFLFL".split("").map(function (e) {
        return app.parse_instruccion(e)
    })
    let robot_movements = [cloneDeep(r1)]
    let lost_robots = []
    expect(app.print_robot(app.execution_handler(m1, r1, i1, robot_movements, lost_robots)[0])).toBe("4, 2 NORTE");
})

test('robots_multiples', () => {
    let map = new Mapa(new Ubicacion(5, 3))
    let r1 = new Robot([new Ubicacion(3, 2), new Orientacion(app.parse_orientacion("N"))], false)
    let aux1 = new Robot([new Ubicacion(3, 2), new Orientacion(app.parse_orientacion("N"))], false)
    let r2 = new Robot([new Ubicacion(3, 0), new Orientacion(app.parse_orientacion("S"))], false)
    let r3 = new Robot([new Ubicacion(5, 1), new Orientacion(app.parse_orientacion("E"))], false)
    let i1 = "FRRFLLFFRRFLL".split("").map(function (e) {
        return app.parse_instruccion(e)
    })
    let i2 = "LLFFFF".split("").map(function (e) {
        return app.parse_instruccion(e)
    })
    let i3 = "RRFRFFLFRF".split("").map(function (e) {
        return app.parse_instruccion(e)
    })
    let robot_movements = [cloneDeep(r1)]
    let lost_robots = []
    expect(app.print_robot(app.execution_handler(map, r1, i1, robot_movements, lost_robots)[0])).toBe("3, 3 NORTE LOST");
    expect(app.execution_handler(map, aux1, i1, [aux1], [])[1]).toStrictEqual([[3, 3]])
    expect(app.print_robot(app.execution_handler(map, r2, i2, [r2], [[3, 3]])[0])).toBe("3, 3 NORTE");
    expect(app.print_robot(app.execution_handler(map, r3, i3, [r3], [[3, 3]])[0])).toBe("3, 3 NORTE");

})

