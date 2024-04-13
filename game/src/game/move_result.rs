use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Serialize, Deserialize, PartialEq, Debug)]
pub enum MoveResult {
    Valid,
    Invalid,
    BlueWin,
    RedWin,
}