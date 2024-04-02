"""

"""

import asyncio
from pathlib import Path

import zmq
import click

from player.base.base import BaseAgent

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

    if agent not in dirs:
        raise FileNotFoundError(f"Agent `{agent}` not found. Available agents are:{'\n - '.join(['', *dirs])}")


def _setup_zmq(host_ip: str, port: int) -> zmq.Socket:
    """
    Setup zmq connection
    """
    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.connect(f'tcp://{host_ip}:{port}')

    return socket


def _import_agent(agent: str) -> BaseAgent:
    """
    Import the agent
    """
    agent_module = __import__(f'agents.{agent}.agent', fromlist=[''])
    return agent_module.Agent()


async def _play(socket: zmq.Socket, agent: BaseAgent) -> None:
    """
    Play the game
    """
    agent.set_colour(await _init_game(socket))

    while True:
        state = await socket.recv_json()
        await socket.send_json({'move': agent.get_move(state)})


async def _init_game(socket: zmq.Socket) -> str:
    """
    Initialize the game
    """
    await socket.send_json({'action': 'init'})
    result = await socket.recv_json()
    return result['colour']

@click.command("agents")
@click.option('--quiet', is_flag=True)
def list_agents(quiet: bool) -> None:
    """
    List the available agents
    """
    agents = _get_agents()
    if not quiet:
        click.echo(f"Available agents are:{'\n - '.join(['', *agents])}")
    else:
        click.echo(','.join(agents))


@click.command()
@click.argument("agent", required=True)
@click.option('--host', default=LOCALHOST)
@click.option('--port', default=DEFAULT_PORT, type=int)
def main(agent: str, host: str, port: int) -> None:
    """
    Main function to interact with the playing agent
    """
    _check_agent_exists(agent)
    socket = _setup_zmq(host, port)
    agent = _import_agent(agent)

    asyncio.run(_play(socket, agent))


if __name__ == '__main__':
    main()