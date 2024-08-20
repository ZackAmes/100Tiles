use starknet::ContractAddress;
use dojo_starter::models::effect::Effect;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Position {
    #[key]
    pub game_id: u32,
    #[key]
    pub player: ContractAddress,
    pub tile: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Pending {
    #[key]
    pub game_id: u32,
    #[key]
    pub player: ContractAddress,
    pub effect: Effect
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Tile {
    #[key]
    pub game_id: u32,
    #[key]
    pub number: u8,
    pub effect: Effect
}