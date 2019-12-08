import websockets
import json
import asyncio
import sys
from amazons import Amazons
from mcts import MCTS

async def connect():
    board = Amazons()
    port = sys.argv[1]
    uri = f'ws://localhost:{port}'
    async with websockets.connect(uri) as socket:
        player = str(await socket.recv())
        tree = MCTS(player, budget=int(sys.argv[2]))
        print(player)

        await socket.recv()
        print('start')

        if player == 'B':
            print('thinking')
            cheese, arrow = tree.getMove(board, player)
            board.fire(player, cheese, 0)
            board.fire(player, arrow, 1)
            tree.updateRoot(player)
            await socket.send(json.dumps({'move': cheese, 'kw': 0}))
            await socket.send(json.dumps({'move': arrow, 'kw': 1}))

        while True:
            move = await socket.recv()
            move = json.loads(move)
            board.fire(move['player'], move['move'], move['kw'])

            move = await socket.recv()
            move = json.loads(move)
            board.fire(move['player'], move['move'], move['kw'])

            print('thinking')
            cheese, arrow = tree.getMove(board, player)
            board.fire(player, cheese, 0)
            board.fire(player, arrow, 1)
            tree.updateRoot(player)
            print(cheese, arrow)
            await socket.send(json.dumps({'move': cheese, 'kw': 0}))
            await socket.send(json.dumps({'move': arrow, 'kw': 1}))

asyncio.get_event_loop().run_until_complete(connect())
