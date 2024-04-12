"""

"""

import asyncio
from functools import partial
import json
from pathlib import Path
from typing import Literal, Tuple

import zmq
import click

from .base_agent import BaseAgent

DEFAULT_PORT = 5555
LOCALHOST = '127.0.0.1'

def _get_agents() -> list:
    """
    Get the list of agents available
    """
    return [dir.name for dir in (Path(__file__).parent / 'agents').glob('*')]


def _check_agent_exists(agent: str) -> bool:
    """
    Check if the agent exists in the agents directory
    """
    dirs = _get_agents()
    formmated_agents = '\n - '.join(['', *dirs])

    if agent not in dirs:
        raise FileNotFoundError(f"Agent `{agent}` not found. Available agents are:{formmated_agents}")


def _setup_zmq(host_ip: str, port: int) -> Tuple[zmq.Socket, zmq.Socket]:
    """
    Setup zmq connection
    """
    context = zmq.Context()
    req_socket = context.socket(zmq.REQ)
    sub_socket = context.socket(zmq.SUB)
    req_socket.connect(f'tcp://{host_ip}:{port}')
    sub_socket.connect(f'tcp://{host_ip}:{port + 1}')

    sub_socket.subscribe(b'')

    return (req_socket, sub_socket)


def _import_agent(agent: str) -> BaseAgent:
    """
    Import the agent
    """
    agent_module = __import__(f'agents.{agent}.agent', fromlist=[''])
    return agent_module.Agent()


async def _play(
        move_ready: asyncio.Event,
        req_socket: zmq.Socket,
        agent: BaseAgent,
    ) -> None:
    """
    Play the game
    """


    while True:
        await move_ready

        (row, col) = agent.get_move()
        await req_socket.send_json({'m_type': 'Move', 'data': [row, col]})
        result = await req_socket.recv_json()

        move_ready.clear()

        


async def _sub_listen(sub_socket: zmq.Socket, callback: callable, move_ready: asyncio.Event, colour: str) -> None:
    """
    Listen on the subscribe socket and call back to function passed as argument if
    message is recieved
    """
    while True:
        message = await sub_socket.recv_json()
        parsed = callback(message)['current_player']

        if parsed == colour:
            move_ready.set()


@click.group()
def cli():
    pass


@cli.command()
@click.option('--quiet', is_flag=True)
def agents(quiet: bool) -> None:
    """
    List the available agents
    """
    agent_list = _get_agents()
    if not quiet:
        formatted_agents = '\n - '.join(['', *agent_list])
        click.echo(f"Available agents are:{formatted_agents}")
    else:
        click.echo(','.join(agent_list))


@cli.command()
@click.argument("agent", required=True)
@click.argument("colour", required=True)
@click.option('--host', default=LOCALHOST)
@click.option('--port', default=DEFAULT_PORT, type=int)
def start_agent(agent: str, colour: Literal['RED', 'BLUE'], host: str, port: int) -> None:
    """
    Main function to interact with the playing agent
    """
    _check_agent_exists(agent)
    req_socket, sub_socket = _setup_zmq(host, port)
    agent = _import_agent(agent)

    move_ready = asyncio.Event

    asyncio.run(
        asyncio.gather(
            [
                _play(move_ready, req_socket, agent),
                _sub_listen(sub_socket, partial(_parse_and_set_state, agent), move_ready, colour),
            ]
        )
    )

def _parse_and_set_state(agent: BaseAgent, json_message: str):
    message = json.loads(json_message)
    try:
        agent.set_game_state(message['board'])
        return message
    except KeyError as exc:
        raise KeyError('Recieved invalid publish message') from exc


if __name__ == '__main__':
    cli()