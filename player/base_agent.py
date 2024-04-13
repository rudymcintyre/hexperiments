from typing import Tuple


class BaseAgent():
    """
    Base class for agent including common functionality that 
    may be used by all agents such as win condition checking
    """
    board_state = None
    colour = None
    board_size = 11

    def init_board(self, colour: str):
        self.board_state = [['Empty' for _ in range(self.board_size)] for _ in range(self.board_size)]
        self.colour = colour

    def win_condition(self, current_board, player) -> bool:
        """
        Check if the player has won
        """
        visited = [[False for _ in range(self.board_size)] for _ in range(self.board_size)]

        for i in range(self.board_size):
            if player == 'Red':
                row = i
                col = 0
            else:
                row = 0
                col = i

            if current_board[row][col] == player and not visited[row][col]:
                if self.dfs(row, col, current_board, player, visited):
                    return True

        return False
    
    def dfs(self, row: int, col: int, current_board, colour, visited: list[list[bool]]) -> bool:
        """
        Depth first search to find if the player has won
        """
        visited[row][col] = True

        stack = [(row, col)]

        while stack:
            (r, c) = stack.pop()

            for (nr, nc) in self.get_neighbours(r, c):
                if (current_board[nr][nc] != colour):
                    continue

                if colour == 'Red' and nc == self.board_size - 1 or colour == 'Blue' and nr == self.board_size - 1:
                    return True

                if not visited[nr][nc]:
                    visited[nr][nc] = True
                    stack.append((nr, nc))

        return False

    def get_neighbours(self, row: int, col: int) -> list[Tuple[int, int]]:
        dirs = [(-1, 0), (-1, 1), (0, 1), (1, 0), (1, -1), (0, -1)]
        neighbours = []

        for (dx, dy) in dirs:
            if 0 <= row + dx < self.board_size and 0 <= col + dy < self.board_size:
                neighbours.append((row + dx, col + dy))
        
        return neighbours


    def get_opponent(self, colour) -> str:
        """
        Get the opponent colour
        """
        return 'Red' if colour == 'Blue' else 'Blue'


    def update_game_state(self, game_state: list[list[str]]):
        """
        Setter for game state
        """
        self.board_state = game_state

    def get_move(self, *args, **kwargs) -> Tuple[int, int]:
        """
        Abstract function to be overridden by each type of child class
        """
        raise NotImplementedError()
    