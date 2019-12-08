#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import numpy as np
import copy

'''
我们规定 0 为没有棋子
我们规定 1 为先手方 A
我们规定 2 为后手方 B
我们规定 3 为先手方障碍 A
我们规定 4 为后手方障碍 B
'''

def direction(origin, move):
    y = move[0] - origin[0]
    x = move[1] - origin[1]

    if y == 0:
        if x > 0:
            return 3, x - 1
        elif x < 0:
            return 2, abs(x) - 1
    elif y > 0:
        if x == 0:
            return 1, y - 1
        elif abs(y) != abs(x):
            return -1, -1
        elif x > 0:
            return 4, y - 1
        elif x < 0:
            return 5, y - 1
    elif y < 0:
        if x == 0:
            return 0, abs(y) - 1
        elif abs(y) != abs(x):
            return -1, -1
        elif x > 0:
            return 6, x - 1
        elif x < 0:
            return 7, abs(y) - 1

vectors = [(-1, 0), (1, 0), (0, -1), (0, 1),
           (1, 1), (1, -1), (-1, 1), (-1, -1)]

class Amazons(object):
    def __init__(self):
        board = np.zeros((10, 10), dtype=int)
        # 初始化先手方棋子位置
        board[0, 3] = 1
        board[0, 6] = 1
        board[3, 0] = 1
        board[3, 9] = 1
        # 初始化后手方棋子位置
        board[6, 0] = 2
        board[9, 3] = 2
        board[9, 6] = 2
        board[6, 9] = 2
        self.__globalBoard = board
        self.__width = 10
        self.__height = 10
        self.playerState = {'A': [(0, 3), (0, 6), (3, 0), (3, 9)],
                            'B': [(9, 3), (9, 6), (6, 0), (6, 9)]}
        self.lastMove = []

    # 获取棋盘情况

    def getBoard(self):
        return self.__globalBoard

    def getPlayerLocation(self, player):
        return self.playerState[player]

    def rollback(self, board):
        self.__globalBoard = board

    # 下棋操作

    def fire(self, player, location, itemtype, save=False):
        # 我们规定itemtype=0 为棋子
        # 我们规定itemtype=1 为障碍

        # reshapeBoard = self.__globalBoard.reshape(self.__height, self.__width)
        reshapeBoard = self.__globalBoard

        # 将 from to 搞出来
        itemfromY = location['from'][0]
        itemfromX = location['from'][1]
        itemtoY = location['to'][0]
        itemtoX = location['to'][1]

        # Start 下棋规则
        # todo 检查相应位置是否有棋子，是否是对应用户的棋子

        '''
            说明：
            chessX 是 行坐标
            chessY 是 列坐标
            enableLocation* 在八个方向可以下棋的位置
            enabelLocation 是八个方向汇总在一起可以下的位置
            flag* 是分别在八个方向有阻挡棋子的开始和结束位置
            count* 是统计出当前每个enabelLocation*的成员数量
        '''
        chessX = itemfromX
        chessY = itemfromY
        countX, countY, countP, countN = 0, 0, 0, 0

        '''
            首先需要用两个for循环，遍历出当前棋子位置，在八个方向上允许下棋的所有位置
            包括中间有格挡棋子的情况
        '''

        # 最后将整个可以放置为位置整合在一个list中
        enableLocation = []

        idx, _ = direction(location['from'], location['to'])
        if idx == -1:
            raise RuntimeError
        else:
            vector = vectors[idx]
        
        enableLocation += self.enabledLocation((chessY, chessX), vector)
        # End 棋盘规则

        # 然后判断是否可以放在这个地方
        if (itemtoY, itemtoX) not in enableLocation:
            raise RuntimeError

        if player == 'A' and itemtype == 0:
            reshapeBoard[itemfromY, itemfromX] = 0
            reshapeBoard[itemtoY, itemtoX] = 1

            stateA = self.playerState['A']
            stateA[stateA.index((itemfromY, itemfromX))] = (itemtoY, itemtoX)
        elif player == 'A' and itemtype == 1:
            # reshapeBoard[itemfromH, itemfromV] = 0
            reshapeBoard[itemtoY, itemtoX] = 3
        elif player == 'B' and itemtype == 0:
            reshapeBoard[itemfromY, itemfromX] = 0
            reshapeBoard[itemtoY, itemtoX] = 2

            stateB = self.playerState['B']
            stateB[stateB.index((itemfromY, itemfromX))] = (itemtoY, itemtoX)
        elif player == 'B' and itemtype == 1:
            # reshapeBoard[itemfromH, itemfromV] = 0
            reshapeBoard[itemtoY, itemtoX] = 4
        else:
            pass

        if save:
            if itemtype == 0:
                self.lastMove = [(itemfromY, itemfromX), (itemtoY, itemtoX)]
            else:
                self.lastMove.append((itemtoY, itemtoX))

        # changedBoard = np.asarray(reshapeBoard, dtype=int)
        # self.__globalBoard = reshapeBoard

        # 然后进行胜负的判断
        playerResult = self.gameStatus()

        # return changedBoard, playerResult
        return reshapeBoard, playerResult
    
    def enabledLocation(self, loc, vec):
        stack = [loc]

        while self._isAvailable((stack[-1][0] + vec[0], stack[-1][1] + vec[1])):
            stack.append((stack[-1][0] + vec[0], stack[-1][1] + vec[1]))

        return stack[1:]

    def allEnabledLocation(self, player):
        pos = {}
        for i in self.playerState[player]:
            for vec in vectors:
                if pos.get(i) == None:
                    pos[i] = self.enabledLocation(i, vec)
                else:
                    pos[i] += self.enabledLocation(i, vec)

        return pos

    def _isAvailable(self, loc):
        """
        判断这个位置是否超出边界，或者有棋子
        :param loc: tuple: 位置
        :return: 如果能下，返回真，否则返回假
        :rtype: bool
        """

        if self.isOutOfBound(loc):
            return False
        elif self.__globalBoard[loc] != 0:
            return False
        else:
            return True

    def isOutOfBound(self, loc):
        if loc[0] < 0 or loc[1] < 0:
            return True
        elif loc[0] > 9 or loc[1] > 9:
            return True
        else:
            return False

    # 判断胜负

    def gameStatus(self):
        def setStatus(status, playerState):
            for i, (y, x) in enumerate(playerState):
                empty = -1
                for vec in vectors:
                    pos = (y + vec[0], x + vec[1])
                    if not self.isOutOfBound(pos):
                        if board[pos] == 0:
                            empty = 1
                            break
                if empty == -1:
                    status[i] = False

        playerAState = self.playerState['A']
        playerBState = self.playerState['B']

        statusA = [True, True, True, True]
        statusB = [True, True, True, True]

        board = self.__globalBoard

        setStatus(statusA, playerAState)
        setStatus(statusB, playerBState)

        playerA = False
        playerB = False

        try:
            statusA.index(True)
        except ValueError:
            playerB = True

        try:
            statusB.index(True)
        except ValueError:
            playerA = True

        if playerA == True and playerB == False:
            return 'A'
        elif playerA == False and playerB == True:
            return 'B'
        elif playerA == True and playerB == True:
            return 'TIE'
        elif playerA == False and playerB == False:
            return None

    def getBarrier(self):
        result = np.where(self.__globalBoard >= 3)
        return list(zip(result[0], result[1]))

    def setBoard(self, board):
        self.__globalBoard = board

    def showBoard(self):
        print('   ', end='')
        for i in range(97, 107):
            print(chr(i), end=' ')
        print()

        print('   ', end='')
        for i in range(10):
            print('-', end=' ')
        print()

        for i in range(10):
            if i == 0:
                print('10', end='|')
            else:
                print(' ' + str(10 - i), end='|')
            for j in range(10):
                print(self.__globalBoard[i, j], end=' ')
            print()

    def getBinaryBoard(self, player, first='A', winner=None):
        binary = []
        board = self.__globalBoard
        if player == 'A':
            binary.append((board == 1).astype(int))
            binary.append((board == 2).astype(int))
        else:
            binary.append((board == 2).astype(int))
            binary.append((board == 1).astype(int))
        binary.append((board >= 3).astype(int))

        if len(self.lastMove) != 0:
            move = []
            for i in self.lastMove:
                tmp = np.zeros((10, 10))
                tmp[i] = 1
                move.append(tmp)
            if len(move) != 3:
                for i in range(3 - len(move)):
                    move.append(np.zeros((10, 10)))
            binary.extend(move)
        else:
            for i in range(3):
                binary.append(np.zeros((10, 10)))

        if player == first:
            binary.append((board >= 0).astype(int))
        else:
            binary.append((board < 0).astype(int))
        
        return binary

def alphaToPos(pos):
    alpha = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6,
        'h': 7,
        'i': 8,
        'j': 9,
    }

    return [10 - int(pos[1]), alpha[pos[0]]]


def main():
    board = Amazons()

    moves = [
        "A a 7 c 7 c 1",
        "A c 7 c 6 c 2",
        "A c 6 d 6 d 2",
        "A d 6 e 6 e 1",
        "A e 6 e 7 e 2",
    ]

    for i in moves:

        move = i.split(" ")
        player = move[0]
        move = move[1:]
        cheeseFrom = alphaToPos([move[0], move[1]])
        cheeseTo = alphaToPos([move[2], move[3]])
        itemTo = alphaToPos([move[4], move[5]])
        board.fire(
            player, {'from': cheeseFrom, 'to': cheeseTo}, 0)
        a = board.fire(
            player, {'from': cheeseTo, 'to': itemTo}, 1)
        board.showBoard()


if __name__ == '__main__':
    main()
