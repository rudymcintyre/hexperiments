import math

EXPLORATION_PARAM = 1


class MCTSTreeNode:
    """A node in the Monte Carlo Tree Search tree"""

    def __init__(self, player, parent, action):
        self.player = player

        self.parent = parent
        self.children = []

        self.visits = 0
        self.value = 0

        self.action = action

    def uct_score(self, expl_param: float = EXPLORATION_PARAM):
        """Calculate the UCT (upper confidence bound applied to trees) score for the node"""

        # maximally favour unvisited nodes
        if self.visits == 0:
            return 0 if expl_param == 0 else float("inf")

        return self.value / self.visits + expl_param * math.sqrt(
            math.log(self.parent.visits) / self.visits
        )

    def has_children(self) -> bool:
        """
        Return true if the node has children
        """

        return len(self.children) > 0

    def __repr__(self) -> str:
        parts = {
            "Action": self.action,
            "Visits": self.visits,
            "Value": self.value,
            "Colour": self.player,
            "UCT": self.uct_score(),
        }
        return "\n".join([f"{k}:\t{v}" for (k, v) in parts.items()])
