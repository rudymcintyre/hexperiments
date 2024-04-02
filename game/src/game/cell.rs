use serde::Serialize;

#[derive(Clone, Copy, Hash, Eq, PartialEq, Serialize)]
pub enum CellValue {
    Red,
    Blue,
    Empty,
}