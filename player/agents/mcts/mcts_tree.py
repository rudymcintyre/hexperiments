import math

class MCTSTreeNode():
    EXPLORATION_PARAM = math.sqrt(2)

    def __init__(self, state, player, parent, action, actions):
        self.state = state
        self.player = player

        self.parent = parent
        self.children = []

        self.simulations = 0
        self.wins = 0

        self.action = action
        self.untried_actions = actions

    def uct_score(self):
        if self.simulations == 0 or self.parent and self.parent.simulations == 0:
            return 0

        return self.wins / self.simulations + self.EXPLORATION_PARAM * math.sqrt(math.log(self.parent.simulations) / self.simulations)