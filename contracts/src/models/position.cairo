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


#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Effect {
    None,
    Forward: u8,
    Backward: u8
}

#[generate_trait]
impl EffectImpl of EffectTrait {
    fn move(direction: bool, amt: u8) -> Effect{
        if direction {
            Effect::Forward(amt)
        }
        else {
            Effect::Backward(amt)
        }

    }
}





