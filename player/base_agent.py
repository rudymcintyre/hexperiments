from typing import Tuple


class BaseAgent():
    """
    Base class for agent
    """
    board_state = None

    def update_game_state(self, game_state: list[list[int]]):
        """
        Setter for game state
        """
        self.board_state = game_state

    def get_move(self, *args, **kwargs) -> Tuple[int, int]:
        """
        Abstract function to be overridden by each type of child class
        """
        raise NotImplementedError()
    