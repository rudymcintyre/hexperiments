"""
Monte Carlo Tree Search agent
"""

import ast
from typing import Tuple
import random
from copy import deepcopy

from base_agent import BaseAgent

class Agent(BaseAgent):

    SIMULATIONS = 1000

    def __init__(self, colour: str):
        self.init_board(colour)

    def has_moves_left(self) -> bool:
        """
        Check if the player has any moves left
        """
        for i in range(self.board_size):
            for j in range(self.board_size):
                if self.board_state[i][j] == 'Empty':
                    return True

        return False
    
    def get_move_options(self, current_board) -> list[tuple[int, int]]:
        """
        Get all possible moves the player can make
        """
        moves = []
        for row in range(self.board_size):
            for col in range(self.board_size):
                if current_board[row][col] == 'Empty':
                    moves.append((row, col))

        return moves
    

    def get_move(self) -> Tuple[int, int]:
        # move: score
        evaluations = {}

        for _ in range(self.SIMULATIONS):
            current_board = deepcopy(self.board_state)
            player = self.colour

            simulation_moves = []
            next_moves = self.get_move_options(current_board)

            score = self.board_size ** 2

            while next_moves:
                # choose a random move, make it and add record it
                move = random.choice(next_moves)
                current_board[move[0]][move[1]] = player
                simulation_moves.append(move)

                if self.win_condition(current_board, player):
                    break

                score -= 1

                player = self.get_opponent(player)
                next_moves = self.get_move_options(current_board)

            first_move = simulation_moves[0]

            # assign negative score if the agent lost in this simulation
            if player != self.colour and self.win_condition(current_board, player):
                score *= -1

            first_move_key = repr(first_move)
            if first_move_key in evaluations:
                evaluations[first_move_key] += score
            else:
                evaluations[first_move_key] = score
        
        best_move = max(evaluations, key=evaluations.get)

        return ast.literal_eval(best_move)
