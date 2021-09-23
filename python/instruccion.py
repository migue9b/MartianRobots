from abc import ABCMeta, abstractmethod


class Instruccion:
    @abstractmethod
    def execute_inst(self) -> None:
        pass


class Left(Instruccion):
    @classmethod
    def execute_inst(robot):
        pass


class Right(Instruccion):
    @classmethod
    def execute_inst(robot):
        pass


class Forward(Instruccion):
    @classmethod
    def execute_inst(robot):
        pass
