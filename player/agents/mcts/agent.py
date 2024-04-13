"""
Monte Carlo Tree Search agent
"""

from typing import Tuple

from base_agent import BaseAgent

class Agent(BaseAgent):

    def get_move(self, *args, **kwargs) -> Tuple[int, int]:
        raise NotImplementedError
