use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Position {
    #[key]
    game_id: u32,
    #[key]
    player: ContractAddress,
    tile: u8,
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


#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Effect {
    None,
    Forward: u8,
    Backward: u8
}
