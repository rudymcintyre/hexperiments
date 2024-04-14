"""
Monte Carlo Tree Search agent
"""

from typing import Tuple
import random
from copy import deepcopy

from player.base_agent import BaseAgent
from .mcts_tree import MCTSTreeNode


class Agent(BaseAgent):

    SIMULATIONS = 20

    def get_move_options(self, current_board) -> list[tuple[int, int]]:
        """
        Get all possible moves the player can make
        """
        moves = []
        for row in range(self.board_size):
            for col in range(self.board_size):
                if current_board[row][col] == "Empty":
                    moves.append((row, col))

        return moves

    def select_node(self, root_node, state):

        current_node = root_node

        while current_node.has_children():
            max_uct = max(
                current_node.children, key=lambda x: x.uct_score()
            ).uct_score()
            tied_nodes = [n for n in current_node.children if n.uct_score() == max_uct]
            current_node = random.choice(tied_nodes)
            state[current_node.action[0]][current_node.action[1]] = current_node.player

            if current_node.visits == 0:
                return (current_node, state)

        if self.expand(current_node, state):
            current_node = random.choice(current_node.children)
            state[current_node.action[0]][current_node.action[1]] = current_node.player

        return (current_node, state)

    def expand(self, parent_node, state):

        if self.win_condition(state, parent_node.player):
            return False

        children = []
        new_colour = self.get_opponent(parent_node.player)
        for move in self.get_move_options(state):
            children.append(MCTSTreeNode(new_colour, parent_node, move))

        parent_node.children = children
        return True

    def simulate(self, state, colour):

        moves = self.get_move_options(state)

        while not self.win_condition(state, colour):
            colour = self.get_opponent(colour)
            move = moves.pop(len(moves) - 1)
            state[move[0]][move[1]] = colour

        return colour

    def backpropagate(self, node, colour, winner):

        reward = 1 if colour == winner else -1

        while node:
            node.visits += 1
            node.value += reward
            reward *= -1
            node = node.parent

    def print_board(self, board):
        for i in range(self.board_size):
            for j in range(self.board_size):
                print(board[i][j], end=" ")
            print()

    def get_move(self) -> Tuple[int, int]:
        """ """

        # root node: move just played by opponent
        root = MCTSTreeNode(
            self.get_opponent(self.colour),
            None,
            None,
        )

        for _ in range(self.SIMULATIONS):
            # SELECTION / EXPANSION
            node, state = self.select_node(root, deepcopy(self.board_state))

            # SIMULATION
            player = node.player
            winner = self.simulate(state, player)

            # BACKPROPAGATION
            self.backpropagate(node, player, winner)

        max_visits = max(root.children, key=lambda x: x.visits).visits
        tied_nodes = [n for n in root.children if n.visits == max_visits]
        return random.choice(tied_nodes).action
