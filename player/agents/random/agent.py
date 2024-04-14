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
        while True:
            move = (
                random.randint(0, self.board_size - 1),
                random.randint(0, self.board_size - 1),
            )
            if self.board_state[move[0]][move[1]] == "Empty":
                return move
