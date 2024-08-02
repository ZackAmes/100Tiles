#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    use starknet::testing::{set_contract_address};
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
    use dojo::utils::test::{spawn_test_world, deploy_contract};
    // import test utils
    use dojo_starter::{
        systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait}},
        models::{position::{Position, Tile, tile, position}, game::{Game, game, Status}}
    };
    use dojo::model::Model;


    #[test]
    fn test_move() {
        // caller
        let caller = starknet::contract_address_const::<0x10>();

        set_contract_address(caller);
        // models
        let mut models = array![position::TEST_CLASS_HASH,tile::TEST_CLASS_HASH, game::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world("ok", models);

        // deploy systems contract
        let contract_address = world.deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let actions_system = IActionsDispatcher { contract_address };

        actions_system.spawn();
        let position = get!(world, (0, caller), Position);

        println!("{}", position.tile);

        actions_system.move();

        let position = get!(world, (0, caller), Position);
        println!("{}", position.tile);


    }
}
