from typing import Tuple, TypeVar


BoardLike = list[list[TypeVar("T")]]
Move = Tuple[int, int]


class BaseAgent:
    """
    Base class for agent including common functionality that
    may be used by all agents such as win condition checking
    """

    board_state: BoardLike[str] = None
    colour: str = None
    board_size: int = 6

    def __init__(self, colour: str, board_size: int):
        self.board_state = [
            ["Empty" for _ in range(self.board_size)] for _ in range(self.board_size)
        ]
        self.colour = colour
        self.board_size = board_size

    def win_condition(self, current_board: BoardLike, player: str) -> bool:
        """Check if the player has won by DFS on 'wall' spaces of the colour
        being checked

        Args:
            current_board (BoardLike): the current state of the board
            player (str): the player to check if they have won

        Returns:
            bool: True if the player has a winning path
        """
        visited = [
            [False for _ in range(self.board_size)] for _ in range(self.board_size)
        ]

        for i in range(self.board_size):
            row, col = (i, 0) if player == "Red" else (0, i)

            if current_board[row][col] == player and not visited[row][col]:
                if self.dfs(row, col, current_board, player, visited):
                    return True

        return False

    def dfs(
        self,
        row: int,
        col: int,
        current_board: BoardLike[int],
        colour: str,
        visited: BoardLike[bool],
    ) -> bool:
        """Depth first along nodes of the colour passed starting from row, col

        Args:
            row (int): the row to start the DFS from
            col (int): the column to start the DFS from
            current_board (BoardLike): the state to check
            colour (str): the colour to check for win condition
            visited (BoardLike): board of bools to keep track of visited nodes

        Returns:
            bool: True if the player has a connection, False otherwise
        """
        visited[row][col] = True
        stack = [(row, col)]

        while stack:
            (r, c) = stack.pop()

            for nr, nc in self.get_neighbours(r, c):
                if current_board[nr][nc] != colour:
                    continue

                if (
                    colour == "Blue"
                    and nr == self.board_size - 1
                    or colour == "Red"
                    and nc == self.board_size - 1
                ):
                    return True

                if not visited[nr][nc]:
                    visited[nr][nc] = True
                    stack.append((nr, nc))

        return False

    def get_neighbours(self, row: int, col: int) -> list[Move]:
        """Get the neighbours of a given cell

        Args:
            row (int): the row of the cell
            col (int): the column of the cell
        """

        dirs = [(-1, 0), (-1, 1), (0, 1), (1, 0), (1, -1), (0, -1)]
        neighbours = []

        for dx, dy in dirs:
            new_row, new_col = row + dx, col + dy

            if 0 <= new_row < self.board_size and 0 <= new_col < self.board_size:
                neighbours.append((new_row, new_col))

        return neighbours

    def get_opponent(self, colour: str) -> str:
        """Get the opponent colour

        Args:
            colour (str): the colour of the player
        """
        return "Red" if colour == "Blue" else "Blue"

    def update_game_state(self, game_state: BoardLike[str]):
        """Setter for game state"""

        self.board_state = game_state

    def get_move(self) -> Move:
        """Abstract function to be overridden by each type of child class"""
        raise NotImplementedError()
