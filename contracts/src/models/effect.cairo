use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Target {
    None,
    Landing,
    Player: ContractAddress
}

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Effect {
    None,
    Forward: (Target, u8),
    Backward: (Target, u8),
    Stun: (Target, u8)
}

#[generate_trait] 
impl effectImpl of EffectTrait {
    fn new(id: u8, amt: u8) -> Effect {
        match id {
            0 =>  Effect::None,
            1 =>  Effect::Forward((Target::Landing, amt)),
            2 =>  Effect::Backward((Target::Landing, amt)),
            3 =>  Effect::Stun((Target::Landing, 1)),
            _ =>  Effect::None
        }
    }

    fn get_id(ref self: Effect) -> u8 {
        match self {
            Effect::None => 0,
            Effect::Forward((_,_)) => 1,
            Effect::Backward((_,_)) => 2,
            Effect::Stun((_,_)) => 3
        }
    }

    fn update_target(ref self: Effect, player: ContractAddress) -> Effect {
        let target = Target::Player(player);
        match self {
            Effect::None => {
                Effect::None
            },
            Effect::Forward((_,amt)) => {
                Effect::Forward((target, amt))
            },
            Effect::Backward((_,amt)) => {
                Effect::Backward((target, amt))
            },
            Effect::Stun((_,amt)) => {
                Effect::Stun((target, amt))
            }
        }
    }
}


trait TileTrait {
    fn get_effect() -> Effect;
}

