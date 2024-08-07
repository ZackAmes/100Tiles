// define the interface
#[dojo::interface]
trait IActions {
    fn move(ref world: IWorldDispatcher, game_id: u32);
    fn resolve_turn(ref world: IWorldDispatcher, game_id: u32);
    fn set_pending_effect(ref world: IWorldDispatcher, game_id: u32, direction: bool, amt: u8);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo_starter::models::{
        position::{Position, Pending, Effect, EffectTrait, Tile}, game::{Game, Status, TurnPhase}
    };
    use dojo_starter::dice::{Dice, DiceTrait};

    #[derive(Copy, Drop, Serde)]
    #[dojo::model]
    #[dojo::event]
    struct Moved {
        #[key]
        player: ContractAddress,
        amt: u8,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {

        // Implementation of the move function for the ContractState struct.
        fn move(ref world: IWorldDispatcher, game_id: u32) {
            let player = get_caller_address();
            let mut game = get!(world, game_id, (Game));
            let mut position = get!(world, (game_id, player), (Position));

            assert!(game.status == Status::Active, "game not active");
            assert!(game.turn_player == player, "not turn player");
            assert!(game.phase == TurnPhase::Standby, "Not correct phase");

            let mut dice = DiceTrait::new(6, get_block_timestamp().into());
            let res = dice.roll();

            position.tile += res;
            game.phase = TurnPhase::Resolving;

            set!(world, (game, position));

            emit!(world, (Moved { player, amt: res }));
        }

        fn resolve_turn(ref world: IWorldDispatcher, game_id: u32) {
            let player = get_caller_address();
            let mut game = get!(world, game_id, (Game));
            let mut position = get!(world, (game_id, player), (Position));
            let mut tile = get!(world, (game_id, position.tile), (Tile));

            assert!(game.status == Status::Active, "game not active");
            assert!(game.turn_player == player);
            assert!(game.phase == TurnPhase::Resolving, "must move first");

            //TODO IMPORTANT: DO NOT ALLOW INFINITE CYCLES

            if tile.effect == Effect::None {
                let pending = get!(world, (game_id, player), (Pending));
                tile.effect = pending.effect;
            }
            else {
   
                let next = self.get_tile_result(world, game_id, tile.number);
                position.tile = next;
            }

            set!(world, (tile, position));

        }

        fn set_pending_effect(ref world: IWorldDispatcher, game_id: u32, direction: bool, amt: u8) {
            let player = get_caller_address();

            let mut game = get!(world, game_id, (Game));
            let mut position = get!(world, (game_id, player), (Position));

            assert!(game.status == Status::Active, "game not active");
            assert!(position.tile != 0, "not in game");
            

            let effect = EffectTrait::move(direction, amt);

            let pending = Pending {game_id, player, effect};
            set!(world, (pending));
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        // 
        fn get_tile_result(ref self: ContractState, world: IWorldDispatcher, game_id: u32, tile_no: u8) -> u8 {
            let mut tile = get!(world, (game_id, tile_no), (Tile));
            let mut res = tile_no;

            match tile.effect {
                Effect::None => {
                },
                Effect::Forward(a) => {
                    assert!(tile_no + a <= 100, "would go past 100");
                    res = self.get_tile_result(world, game_id, tile_no + a);
                },
                Effect::Backward(a) => {
                    assert!(tile_no - a >= 1, "would go past 1");
                    res = self.get_tile_result(world, game_id, tile_no - a);
                }
            }

            res
        }

    }
}

