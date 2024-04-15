"""
Main module to run agents and facilitate communication with the backend


"""

import sys
import os
import asyncio
from functools import partial
from pathlib import Path
from typing import Literal, Tuple

import zmq
import zmq.asyncio
import click

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

# linter: disable=wrong-import-position
from player.base_agent import BaseAgent


DEFAULT_PORT = 5555
LOCALHOST = "127.0.0.1"


def _get_agents() -> list:
    """Get the list of agents available"""

    return [dir.name for dir in (Path(__file__).parent / "agents").glob("*")]


def _check_agent_exists(agent: str) -> bool:
    """Check if the agent exists in the agents directory

    Args:
        agent (str): the name of the agent

    Raises:
        FileNotFoundError: if the agent does not exist
    """

    dirs = _get_agents()
    formmated_agents = "\n - ".join(["", *dirs])

    if agent not in dirs:
        raise FileNotFoundError(
            f"Agent `{agent}` not found. Available agents are:{formmated_agents}"
        )


def _setup_zmq(host_ip: str, port: int) -> Tuple[zmq.Socket, zmq.Socket]:
    """Setup zmq connection to the backend

    Args:
        host_ip (str): the IP address of the host running the Rust backend
        port (int): the port on the host on which the sockets are running
    """

    context = zmq.asyncio.Context()
    req_socket = context.socket(zmq.REQ)
    sub_socket = context.socket(zmq.SUB)
    req_socket.connect(f"tcp://{host_ip}:{port}")
    sub_socket.connect(f"tcp://{host_ip}:{port + 1}")

    sub_socket.subscribe(b"")

    return (req_socket, sub_socket)


def _import_agent(agent: str) -> BaseAgent:
    """Import the agent module corresponding to the agent name

    Args:
        agent (str): the name of the agent
    """
    agent_module = __import__(f"agents.{agent}.agent", fromlist=[""])
    return agent_module.Agent


async def _play(
    move_ready: asyncio.Event,
    game_over: asyncio.Event,
    req_socket: zmq.Socket,
    agent: BaseAgent,
) -> None:
    """Main loop for the agent to play the game

    Args:
        move_ready (asyncio.Event): the event that will be set when it is this player's turn
        game_over (asyncio.Event): the event to set when the game is over
        req_socket (zmq.Socket): the socket to send requests to the backend
        agent (BaseAgent): the agent object
    """

    while True:
        await move_ready.wait()

        if game_over.is_set():
            break

        (row, col) = agent.get_move()
        await req_socket.send_json(
            {"message_type": "MoveRequest", "payload": [row, col]}
        )
        await req_socket.recv()

        move_ready.clear()


async def _sub_listen(
    sub_socket: zmq.Socket,
    callback: callable,
    move_ready: asyncio.Event,
    game_over,
    colour: str,
) -> None:
    """Listen on the subscribe socket and call back to function passed as argument if
    message is recieved

    Args:
        sub_socket (zmq.Socket): the socket to listen on
        callback (callable): the function to call back to
        move_ready (asyncio.Event): the event to be set when it is this player's turn
        game_over (asyncio.Event): the event to set when the game is over
        colour (str): the colour of the agent
    """

    while True:
        message = await sub_socket.recv_json()
        callback(message)

        if message["current_player"] == "Empty":
            game_over.set()
            move_ready.set()
            break

        if message["current_player"].lower() == colour.lower():
            move_ready.set()


@click.group()
def cli():
    """Click Group"""


@cli.command()
@click.option("--quiet", is_flag=True)
def agents(quiet: bool) -> None:
    """List the available agents

    Args:
        quiet (bool): print the args human readable if false
    """
    agent_list = _get_agents()
    if not quiet:
        formatted_agents = "\n - ".join(["", *agent_list])
        click.echo(f"Available agents are:{formatted_agents}")
    else:
        click.echo(",".join(agent_list))


async def _async_start(req_socket, sub_socket, agent, colour: Literal["Red", "Blue"]):
    """Start the game and listen on the subscribe socket for game state updates

    Args:
        req_socket (zmq.Socket): the socket to send requests to the backend
        sub_socket (zmq.Socket): the socket to listen for game state updates
        agent (BaseAgent): the agent object
        colour (Literal['Red', 'Blue']): the colour the agent is playing as
    """

    # # handshake to prevent backend from publishing too soon
    # await req_socket.send_json({"message_type": "Start", "payload": colour})
    # await req_socket.recv()

    move_ready = asyncio.Event()
    game_over = asyncio.Event()

    await asyncio.gather(
        _play(move_ready, game_over, req_socket, agent),
        _sub_listen(
            sub_socket,
            partial(_parse_and_set_state, agent),
            move_ready,
            game_over,
            colour,
        ),
    )


def _parse_and_set_state(agent: BaseAgent, json_obj: dict):
    """Parse the json object and update the game state

    Args:
        agent (BaseAgent): the agent object
        json_obj (dict): the json object recieved

    Raises:
        KeyError: if the json object is not in the correct format
    """

    try:
        agent.update_game_state(json_obj["board"])
    except KeyError as exc:
        raise KeyError("Recieved invalid publish message") from exc


@cli.command()
@click.argument("agent", required=True)
@click.argument("colour", required=True)
@click.argument("board_size", required=False, default=11)
@click.option("--host", default=LOCALHOST)
@click.option("--port", default=DEFAULT_PORT, type=int)
def start_agent(
    agent: str, colour: Literal["Red", "Blue"], board_size: int, host: str, port: int
) -> None:
    """Main function to interact with the playing agent

    Args:
        agent (str): name of directory of desired agent
        colour (Literal['Red', 'Blue']): the colour that the agent will play as
        board_size (int): the size of the board for this match

        host (str): the IP address of the host running the Rust backend
        port (int): the port on the host on which the sockets are running
    """

    _check_agent_exists(agent)
    req_socket, sub_socket = _setup_zmq(host, port)
    agent = _import_agent(agent)(colour, board_size)

    asyncio.run(_async_start(req_socket, sub_socket, agent, colour))


if __name__ == "__main__":
    cli()
