use starknet::ContractAddress;
use dojo_starter::models::effect::Effect;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Position {
    #[key]
    game_id: u32,
    #[key]
    player: ContractAddress,
    tile: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Pending {
    #[key]
    game_id: u32,
    #[key]
    player: ContractAddress,
    effect: Effect
}

#[derive(Drop, Serde)]
#[dojo::model]
struct Tile {
    #[key]
    game_id: u32,
    #[key]
    number: u8,
    effect: Effect
}