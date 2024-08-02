use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
struct Game {
    #[key]
    game_id: u32,
    players: Array<ContractAddress>,
    tile_length: u8,
    turn_player: ContractAddress,
    status: Status
}

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Status {
    Pending, 
    Active,
    Completed
}




