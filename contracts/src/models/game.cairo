use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Game {
    #[key]
    game_id: u32,
    players: Span<ContractAddress>,
    tile_length: u8,
    turn_player: ContractAddress,
    status: Status
}

#[derive(Copy, Drop, Serde, Introspect)]
enum Status {
    Pending, 
    Active,
    Completed
}



