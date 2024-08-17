use starknet::ContractAddress;
use dojo_starter::models::effect::{Effect};

#[derive(Drop, Serde)]
#[dojo::model]
struct Game {
    #[key]
    game_id: u32,
    players: Array<ContractAddress>,
    tile_length: u8,
    turn_player: ContractAddress,
    active_effects: Array<Effect>,
    status: Status,
    phase: TurnPhase
}

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Status {
    Pending, 
    Active,
    Completed
}

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum TurnPhase {
    Standby,
    Resolving,
    End
}




