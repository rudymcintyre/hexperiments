"""
Monte Carlo Tree Search agent
"""

from typing import Tuple
import random
from copy import deepcopy

from base_agent import BaseAgent
from .mcts_tree import MCTSTreeNode

class Agent(BaseAgent):

    SIMULATIONS = 200

    def __init__(self, colour: str):
        self.init_board(colour)

    def has_moves_left(self) -> bool:
        """
        Check if the board has any moves left
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
        root = MCTSTreeNode(
            deepcopy(self.board_state),
            self.colour,
            None,
            None,
            self.get_move_options(self.board_state)
        )

        current_node = root
        for _ in range(self.SIMULATIONS):
            # SELECTION node with highest UCT score (including current)
            while current_node.children:
                selected = max([current_node, *current_node.children], key=lambda x: x.uct_score())
                if selected == current_node:
                    break

            # EXPANSION choose random move and add that child to the tree
            action = random.choice(current_node.untried_actions)
            board = deepcopy(current_node.state)
            board[action[0]][action[1]] = current_node.player

            child_node = MCTSTreeNode(
                board,
                self.get_opponent(current_node.player),
                current_node,
                action,
                self.get_move_options(board)
            )

            current_node.children.append(child_node)
            current_node = child_node

            # SIMULATION
            sim_board = deepcopy(current_node.state)
            sim_player = current_node.player

            next_moves = self.get_move_options(sim_board)
            while next_moves:
                # choose a random move, make it and add record it
                move = random.choice(next_moves)
                sim_board[move[0]][move[1]] = sim_player

                if self.win_condition(sim_board, sim_player):
                    break

                sim_player = self.get_opponent(sim_player)
                next_moves = self.get_move_options(sim_board)

            # BACKPROGPAGATION
            while current_node != root:
                current_node.simulations += 1
                if sim_player == current_node.player:
                    current_node.wins += 1
                current_node = current_node.parent

        best_child = max(root.children, key=lambda x: x.simulations)
        return best_child.action
