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
        systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait},
                matchmaking::{matchmaking, IMatchmakingDispatcher, IMatchmakingDispatcherTrait}},
        models::{position::{Position, Tile, tile, position}, game::{Game, game, Status}}
    };
    use dojo::model::Model;

    fn setup_world() -> (IWorldDispatcher, IActionsDispatcher, IMatchmakingDispatcher) {
        // models
        let mut models = array![position::TEST_CLASS_HASH,tile::TEST_CLASS_HASH, game::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world("ok", models);

        // deploy systems contract
        let actions_address = world.deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let matchmaking_address = world.deploy_contract('s2', matchmaking::TEST_CLASS_HASH.try_into().unwrap(), array![].span());

        let actions_system = IActionsDispatcher { contract_address: actions_address };
        let matchmaking_system = IMatchmakingDispatcher {contract_address: matchmaking_address};

        (world, actions_system, matchmaking_system)
    }

    #[test]
    fn test_matchmaking() {
        let (world,_, matchmaking_system) = setup_world();

        let p1 = starknet::contract_address_const::<0x1>();
        let p2 = starknet::contract_address_const::<0x2>();

        set_contract_address(p1);
        let game_id = matchmaking_system.create_game();

        set_contract_address(p2);
        matchmaking_system.join_game(game_id);

        let game = get!(world, game_id, Game);

        let players = game.players.len();
        let status = game.status;
        println!( " game has {} players", players);
        



    }

    #[test]
    fn test_move() {
        // caller
        let (world, actions_system, _) = setup_world();

        let caller = starknet::contract_address_const::<0x10>();



    }
}
