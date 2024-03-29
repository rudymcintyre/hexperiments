import random

from player.lib.base import BaseAgent


class Agent(BaseAgent):
    """
    Random agent
    """

    def get_move(self, *args, **kwargs):
        """
        Get a random move
        """
        return [random.randint(0, 11), random.randint(0, 11)]