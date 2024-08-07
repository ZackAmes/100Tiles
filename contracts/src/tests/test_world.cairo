#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    use starknet::testing::{set_contract_address};
    use starknet::ContractAddress;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
    use dojo::utils::test::{spawn_test_world, deploy_contract};
    // import test utils
    use dojo_starter::{
        systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait},
                matchmaking::{matchmaking, IMatchmakingDispatcher, IMatchmakingDispatcherTrait}},
        models::{position::{Position, Tile, Pending, Effect, tile, position, pending}, game::{Game, game, Status, TurnPhase}}
    };
    use dojo::model::Model;

    fn setup_world() -> (IWorldDispatcher, IActionsDispatcher, IMatchmakingDispatcher) {
        // models
        let mut models = array![position::TEST_CLASS_HASH,tile::TEST_CLASS_HASH,pending::TEST_CLASS_HASH, game::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world("ok", models);

        // deploy systems contract
        let actions_address = world.deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let matchmaking_address = world.deploy_contract('s2', matchmaking::TEST_CLASS_HASH.try_into().unwrap(), array![].span());

        let actions_system = IActionsDispatcher { contract_address: actions_address };
        let matchmaking_system = IMatchmakingDispatcher {contract_address: matchmaking_address};

        (world, actions_system, matchmaking_system)
    }

    fn setup_game(world: IWorldDispatcher, 
                matchmaking_system: IMatchmakingDispatcher, 
                p1:ContractAddress, 
                p2: ContractAddress) -> u32 {


        set_contract_address(p1);
        let game_id = matchmaking_system.create_game();

        let game = get!(world, game_id, (Game));

        println!("game id {} created", game_id);

        set_contract_address(p2);
        matchmaking_system.join_game(game_id);
        
     //   matchmaking_system.start_game(game_id);

        game_id

    }

    #[test]
    fn test_matchmaking() {
        let (world,_, matchmaking_system) = setup_world();

        let p1 = starknet::contract_address_const::<0x1>();
        let p2 = starknet::contract_address_const::<0x2>();

        let game_id = setup_game(world, matchmaking_system, p1, p2);

        let game = get!(world, game_id, Game);

        let players = game.players.len();

        let status = game.status;
        assert!(game.players.len() > 0, "players not added to game");
        
    }

    #[test]
    fn test_move() {
        // caller
        let (world, actions_system, matchmaking_system) = setup_world();

        let p1 = starknet::contract_address_const::<0x1>();
        let p2 = starknet::contract_address_const::<0x2>();

        let game_id = setup_game(world, matchmaking_system, p1, p2);

        set_contract_address(p1);

        matchmaking_system.start_game(game_id);

        actions_system.move(game_id);

        let position = get!(world, (game_id, p1), (Position));
        let game = get!(world, (game_id), Game);
        assert!(game.phase == TurnPhase::Resolving);

        assert!(position.tile > 1, "didn't move");
        println!("player moved to {}", position.tile);

    }

    #[test]
    fn test_setting_effects() {
        let (world, actions_system, matchmaking_system) = setup_world();

        let p1 = starknet::contract_address_const::<0x1>();
        let p2 = starknet::contract_address_const::<0x2>();

        let game_id = setup_game(world, matchmaking_system, p1, p2);

        set_contract_address(p1);

        matchmaking_system.start_game(game_id);

        actions_system.move(game_id);

        actions_system.set_pending_effect(game_id, true, 5);

        let pending = get!(world, (game_id, p1), (Pending));
        assert!(pending.effect == Effect::Forward(5), "effect not pending");

        actions_system.resolve_turn(game_id);

        let position = get!(world, (game_id, p1), (Position));
        let tile = get!(world, (game_id, position.tile), (Tile));

        assert!(tile.effect == Effect::Forward(5), "effect not set");



    }



}
