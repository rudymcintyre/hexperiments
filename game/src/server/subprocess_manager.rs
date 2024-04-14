use std::process::{Command, Output};

use tokio::process::Command as AsyncCommand;

/// Function to get the list of agents from the player module
pub fn get_agents() -> Vec<String>{
    let agents: Output = Command::new("python3")
        .current_dir("./../player/")
        .arg("main.py")
        .arg("agents")
        .arg("--quiet")
        .output()
        .unwrap();

    let stdout = String::from_utf8(agents.stdout).unwrap();
    let mut agent_list: Vec<&str> = stdout.trim().split(",").collect();
    agent_list.push("human");
    let as_string: Vec<String> = agent_list.iter().map(|s| s.to_string()).collect();

    as_string
}

/// Function to asynchronously spawn an agent process
pub fn spawn_agent(agent: &str, colour: &str, board_size: usize) {
    let _ = AsyncCommand::new("python3")
        .current_dir("./../player/")
        .stdout(std::process::Stdio::inherit())
        .arg("main.py")
        .arg("start-agent")
        .arg(agent)
        .arg(colour)
        .arg(board_size.to_string())
        .spawn()
        .unwrap();
}