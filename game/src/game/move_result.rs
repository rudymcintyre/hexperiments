#[derive(Clone, Copy)]
pub enum MoveResult {
    Valid,
    Invalid,
    BlueWin,
    RedWin,
}