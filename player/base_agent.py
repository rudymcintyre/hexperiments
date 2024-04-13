from typing import Tuple


class BaseAgent():
    """
    Base class for agent including common functionality that 
    may be used by all agents such as win condition checking
    """
    board_state = None
    colour = None

    def __init__(self, colour: str):
        self.board_state = [['Empty' for _ in range(11)] for _ in range(11)]
        self.colour = colour

    def win_condition(self) -> bool:
        """
        Check if the player has won
        """
        visited = [[False for _ in range(11)] for _ in range(11)]

        if self.colour == 'RED':
            for i in range(11):
                if self.board_state[i][0] == 'Red' and not visited[i][0]:
                    if self.dfs(0, i, visited):
                        return True
        else:
            for i in range(11):
                if self.board_state[0][i] == 'Blue' and not visited[0][i]:
                    if self.dfs(i, 0, visited):
                        return True

        return False
    
    def dfs(self, row: int, col: int, visited: list[list[bool]]) -> bool:
        """
        Depth first search to find if the player has won
        """
        visited[row][col] = True

        stack = [(row, col)]

        while stack:
            (r, c) = stack.pop()

            for (nr, nc) in self.get_neighbours(r, c):
                if (self.board_state[nr][nc] != self.colour):
                    continue

                if self.colour == 'RED' and c == 10 or self.colour == 'BLUE' and r == 10:
                    return True

                if not visited[nr][nc]:
                    visited[nr][nc] = True
                    stack.append((nr, nc))

        return False

    def get_neighbours(self, row: int, col: int) -> list[Tuple[int, int]]:
        dirs = [(-1, 0), (-1, 1), (0, 1), (1, 0), (1, -1), (0, -1)]
        neighbours = []

        for (dx, dy) in dirs:
            if 0 <= row + dx < 11 and 0 <= col + dy < 11:
                neighbours.append((row + dx, col + dy))
        
        return neighbours


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
    