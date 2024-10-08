use starknet::ContractAddress;
use dojo_starter::models::effect::{Effect};

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    pub game_id: u32,
    pub players: Array<ContractAddress>,
    pub tile_length: u8,
    pub  turn_player: ContractAddress,
    pub status: Status,
    pub phase: TurnPhase
}

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
pub enum Status {
    Pending, 
    Active,
    Completed
}

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
pub enum TurnPhase {
    Standby,
    Resolving,
    End
}




