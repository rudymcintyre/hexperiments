import random
from typing import Tuple

from player.base_agent import BaseAgent

class Agent(BaseAgent):
    """
    Random agent
    """

    def get_move(self, *args, **kwargs) -> Tuple[int, int]:
        """
        Get a random move
        """
        return (random.randint(0, 11), random.randint(0, 11))