"""Desarrollo de la aplicación 'Martian Robots' en Python"""
from functools import reduce
import uuid
from excepciones import *


class Orientacion:
    NORTE = "NORTE"
    ESTE = "ESTE"
    SUR = "SUR"
    OESTE = "OESTE"

    def __init__(self, orientacion=None) -> None:
        self.orientacion = orientacion


class Instruccion:
    LEFT = "LEFT"
    RIGHT = "RIGHT"
    FORWARD = "FORWARD"

    def __init__(self, instruccion=None) -> None:
        self.instruccion = instruccion


class Ubicacion:
    x = int()
    y = int()

    def __init__(self, x, y) -> None:
        self.x = x
        self.y = y


class Robot:
    posicion = (Ubicacion(None, None), Orientacion())
    LOST = False

    def __init__(self, posicion, LOST) -> None:
        self.posicion = posicion
        self.LOST = LOST
        self.robot_id = uuid.uuid4()

    def move_right(self):
        ori_points = [i for i in Orientacion.__dict__ if not i.startswith("_")]
        index = ori_points.index(self.posicion[1].orientacion)
        new_ori = index + 1 if index != (len(ori_points) - 1) else 0
        aux = list(self.posicion)
        aux[1] = Orientacion(ori_points[new_ori])
        self.posicion = tuple(aux)

    def move_left(self):
        ori_points = [i for i in Orientacion.__dict__ if not i.startswith("_")]
        index = ori_points.index(self.posicion[1].orientacion)
        new_ori = index - 1 if index != 0 else (len(ori_points) - 1)
        aux = list(self.posicion)
        aux[1] = Orientacion(ori_points[new_ori])
        self.posicion = tuple(aux)

    def move_forward(self):
        options = dict()
        options.update(
            {"NORTE": (0, 1), "ESTE": (1, 0), "SUR": (0, -1), "OESTE": (-1, 0)}
        )
        operation = options.get(self.posicion[1].orientacion)
        self.posicion[0].x = int(self.posicion[0].x) + operation[0]
        self.posicion[0].y = int(self.posicion[0].y) + operation[1]


class Mapa:
    sup_dcha = Ubicacion(None, None)
    inf_izq = Ubicacion(0, 0)

    def __init__(self, sup_dcha) -> None:
        self.sup_dcha = sup_dcha


def parser(object, value):
    li = [i for i in dir(object) if i.startswith(value)]
    if len(li) != 0:
        return str(reduce(lambda i, j: i + j, li))
    else:
        return ""


def parse_orientacion(orientacion):
    return parser(Orientacion, orientacion)


def parse_instruccion(instruccion):
    return parser(Instruccion, instruccion)


def are_integers(x, y):
    try:
        int(x)
        int(y)
        return True
    except ValueError:
        return False


def check_num_args(args, num):
    args = args.split(" ")
    return len(args) == num


def map_handler():
    while True:
        try:
            map_size = input("Introduce la coordenada superior derecha: ")
            if not check_num_args(map_size, 2):
                raise NumArgsError(2)
            x = map_size.split(" ")[0]
            y = map_size.split(" ")[1]
            if not are_integers(x, y):
                raise CoordenateError
            if int(x) > 50 or int(y) > 50:
                raise Max50ValueError
            return Mapa(Ubicacion(int(x), int(y)))
        except (CoordenateError, Max50ValueError, NumArgsError) as e:
            print(e.__str__())


def check_orientation(orientacion):
    or_list = [i for i in dir(Orientacion) if not i.startswith("_") and i.isupper()]
    for i in or_list:
        if orientacion == i[0]:
            return True
    return False


def robot_handler():
    while True:
        try:
            robot_pos = input(
                "Introduce las coordenadas y la orientación para el robot: "
            )
            if not check_num_args(robot_pos, 3):
                raise NumArgsError(3)
            x = robot_pos.split(" ")[0]
            y = robot_pos.split(" ")[1]
            o = robot_pos.split(" ")[2]
            if not are_integers(x, y):
                raise CoordenateError
            if int(x) > 50 or int(y) > 50:
                raise Max50ValueError
            if not check_orientation(o):
                raise OrientationError
            return Robot(
                (Ubicacion(x, y), Orientacion(parse_orientacion(o))), LOST=False
            )
        except (NumArgsError, CoordenateError, Max50ValueError, OrientationError) as e:
            print(e.__str__())


def check_instructions(instrucciones):
    act_inst = [i for i in dir(Instruccion) if not i.startswith("_")]
    act_inst = list(map(lambda i: i[0], act_inst))
    for i in instrucciones:
        if i not in act_inst:
            return False
    return True


def instruccion_handler():
    while True:
        try:
            robot_ins = input("Introduce las instrucciones: ")
            if not check_num_args(robot_ins, 1):
                raise NumArgsError(1)
            if not check_instructions(robot_ins):
                raise InstruccError
            return list(map(parse_instruccion, robot_ins))
        except (NumArgsError, InstruccError) as e:
            print(e.__str__())


def is_lost(mapa, robot):
    return int(robot.posicion[0].x) > int(mapa.sup_dcha.x) or int(
        robot.posicion[0].y
    ) > int(mapa.sup_dcha.y)


def main():
    m1 = map_handler()
    robot_inst = dict()
    lost_robots = []
    while True:
        r1 = robot_handler()
        i1 = instruccion_handler()
        # ins_list = [i for i in dir(Instruccion) if not i.startswith("_")]
        for i in i1:
            if i == "FORWARD":
                r1.move_forward()
            elif i == "RIGHT":
                r1.move_right()
            elif i == "LEFT":
                r1.move_left()
            if (r1.posicion[0].x, r1.posicion[0].y) not in lost_robots:
                if is_lost(m1, r1):
                    r1.LOST = True
                    lost_robots.append((r1.posicion[0].x, r1.posicion[0].y))
                    break

        print(
            "Posicion del robot:",
            str(r1.posicion[0].x) + ",",
            str(r1.posicion[0].y),
            r1.posicion[1].orientacion,
            end="",
        )
        if r1.LOST:
            print(" LOST", end="")
        print()


if __name__ == "__main__":
    main()
