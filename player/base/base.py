from typing import Literal


class BaseAgent():
    """
    Base class for agent
    """

    colour: Literal['RED', 'BLUE']

    def set_colour(self, colour: Literal['RED', 'BLUE']) -> None:
        """
        Set the colour of the agent
        """
        self.colour = colour

    def get_move(self, *args, **kwargs):
        raise NotImplementedError()
    