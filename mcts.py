import amazons
import copy
import math
import numpy as np
import time
from random import randint, random, shuffle

def fire(o, t): return {'from': o, 'to': t}

def getAvaliable(board, pos):
    avaliable = []
    for vec in amazons.vectors:
        avaliable += board.enabledLocation(pos, vec)
    return avaliable

def getMoves(board, player):
    cheesePos = board.playerState[player]
    children = {}
    for i in cheesePos:
        avaliable = getAvaliable(board, i)
        children[i] = avaliable
    
    return children

class Node(object):
    def __init__(self, parent, prior, origin, move, player):
        self._parent = parent
        self.children = []
        self._visitTimes = 0
        self._origin = origin
        self._move = move
        self._arrow = None
        self.player = player
        self._Q = 0
        self._v = 0
        self._p = prior

    def isLeaf(self):
        return self.children == []

    def isRoot(self):
        return self._parent == None

    def isExpended(self):
        return self._arrow != None

    def expand(self, board):
        if self._parent == None:
            player = self.player
        else:
            player = 'A' if self.player == 'B' else 'B'
        children = getMoves(board, player)
        for origin, targets in children.items():
            for move in targets:
                if not self._parent:
                    state = copy.deepcopy(board)
                    state.fire(player, {'from': origin, 'to': move}, 0)
                    arrow = getAvaliable(state, move)
                    for shoot in arrow:
                        s = copy.deepcopy(state)                                                       
                        child = Node(self, 0.5, origin, move, player)
                        child._arrow = shoot
                        s.fire(player, fire(move, shoot), 1)
                        self.children.append(child)
                else:
                    child = Node(self, 0.5, origin, move, player)
                    self.children.append(child)
    
    def expandArrow(self, board):
        arrow = getAvaliable(board, self._move)
        self._parent.children.remove(self)
        bestVal = -math.inf
        bestChild = None
        for shoot in arrow:
            state = copy.deepcopy(board)
            state.fire(self.player, fire(self._move, shoot), 1)
            new = Node(self._parent, self._p, self._origin, self._move, self.player)
            new._arrow = shoot
            self._parent.children.append(new)
            prob = random()
            if bestVal < prob:
                bestVal = prob
                bestChild = new
        return bestChild

    def select(self, time):
        if self._parent == None:
            child = max(self.children, key=lambda child: child.getValue())
        else:
            child = max(self.children, key=lambda child: child.getValue())

        return child

    def getFormatedMove(self):
        cheese = fire(self._origin, self._move)
        arrow = fire(self._move, self._arrow)
        return cheese, arrow
    
    def updateValue(self, reward):
        self._visitTimes += 1
        self._v += reward
        self._Q = (self._v / self._visitTimes)
    
    def getParent(self):
        return self._parent

    def getBestChild(self):
        return max(self.children, key=lambda child: child._Q)

    def getValue(self):
        c = math.sqrt(2)
        right = math.sqrt(math.log(self._parent._visitTimes) / (self._visitTimes + 1))
        return self._Q + c * right

class MCTS(object):
    def __init__(self, player, budget=1000):
        self._root = Node(None, 1.0, None, None, player)
        self._budget = budget

    def _playout(self, state, player, root, budget):
        def move(node):
            cheese, arrow = node.getFormatedMove()
            board.fire(node.player, cheese, 0)
            board.fire(node.player, arrow, 1)
        start = time.time()
        while time.time() - start < budget:
            board = copy.deepcopy(state)
            node = root
            while(True):
                if node.isLeaf():
                    break
                node = node.select((time.time() - start) / budget)
                if not node.isExpended():
                    board.fire(node.player, fire(node._origin, node._move), 0)
                    node = node.expandArrow(board)
                    board.fire(node.player, fire(node._move, node._arrow), 1)
                else:
                    move(node)
            
            winner = board.gameStatus()
            if winner == None:
                node.expand(board)
                shuffle(node.children)
                val = self._rollout(board, node.player)
            else:
                val = winner
            val = 1 if val == node.player else -1

            self._update(node, val)
            del board
        return root.children

    def _rollout(self, board, player):
        while board.gameStatus() == None:
            player = 'A' if player == 'B' else 'B'

            cheeses = copy.deepcopy(board.playerState[player])
            cheesePos = cheeses[randint(0, len(cheeses) - 1)]
            while not canMove(board, cheesePos):
                cheeses.remove(cheesePos)
                cheesePos = cheeses[randint(0, len(cheeses) - 1)]

            movePos = getAvaliable(board, cheesePos)
            movePos = movePos[randint(0, len(movePos) - 1)]
            board.fire(player, fire(cheesePos, movePos), 0)

            arrowPos = getAvaliable(board, movePos)
            arrowPos = arrowPos[randint(0, len(arrowPos) - 1)]
            board.fire(player, fire(movePos, arrowPos), 1)
        
        return board.gameStatus()

    def _update(self, node, reward):
        while node != None:
            node.updateValue(reward)
            node = node.getParent()
            reward = -reward

    def getMove(self, board, player):
        self._playout(board, player, self._root, self._budget)
        maxNode = self._root.getBestChild()
        return maxNode.getFormatedMove()
    
    def updateRoot(self, player):
        del self._root
        self._root = Node(None, 1.0, None, None, player)

def canMove(board, pos):
    y = pos[0]
    x = pos[1]
    empty = -1
    for vec in amazons.vectors:
        pos = (y + vec[0], x + vec[1])
        if not board.isOutOfBound(pos):
            if board.getBoard()[pos] == 0:
                empty = 1
                break
    if empty == -1:
        return False
    return True
