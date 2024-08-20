// define the interface
#[dojo::interface]
trait IActions {
    fn move(ref world: IWorldDispatcher, game_id: u32);
    fn resolve_turn(ref world: IWorldDispatcher, game_id: u32);
    fn set_pending_effect(ref world: IWorldDispatcher, game_id: u32, effect_id: u8, amt: u8);
}



// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo_starter::models::{
        position::{Position, Pending, Tile}, effect::{Effect, EffectTrait, Target}, game::{Game, Status, TurnPhase}
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

            let mut world = world;

            if tile.effect == Effect::None {
                let pending = get!(world, (game_id, player), (Pending));
                assert!(pending.effect != Effect::None, "Must set pending effect");
                tile.effect = pending.effect;
            }
            else {
   
                self.get_tile_result(ref world, game_id, tile.number);
            }

            //TODO: set turnplayer to next player

            set!(world, (tile, position));

        }

        fn set_pending_effect(ref world: IWorldDispatcher, game_id: u32, effect_id: u8, amt: u8) {
            
            let player = get_caller_address();
            let mut game = get!(world, game_id, (Game));

            let effect = EffectTrait::new(effect_id, amt);
            
            let pending = Pending {game_id, player, effect};

            set!(world, (pending));
        }


        
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        
        fn get_tile_result(ref self: ContractState, ref world: IWorldDispatcher, game_id: u32, tile_no: u8){
            
            let game = get!(world, game_id, (Game));
            let mut tile = get!(world, (game_id, tile_no), (Tile));

            self.handle_effects(ref world, game_id, game.turn_player, ref tile.effect);
 


        }

        fn handle_effects(ref self: ContractState, ref world: IWorldDispatcher, game_id: u32, turn_player:ContractAddress, ref effect: Effect) {
            
            let mut game = get!(world, (game_id), (Game));
            let mut turn_position = get!(world, (game_id, turn_player), (Position));

            match effect {
                Effect::None => {

                },
                Effect::Forward((target, amt)) => {
                    match target {
                        Target::None => {

                        },
                        Target::Landing => {
                            turn_position.tile + amt;
                        },
                        Target::Player(addr) => {
                            let mut target_position  = get!(world, (game_id, addr), (Position));
                            target_position.tile + amt;
                            set!(world, (target_position));
                        }

                    }
                },
                Effect::Backward((target, amt)) => {
                    match target {
                        Target::None => {

                        },
                        Target::Landing => {
                            turn_position.tile - amt;
                        },
                        Target::Player(addr) => {
                            let target_position  = get!(world, (game_id, addr), (Position));
                            target_position.tile - amt;
                            set!(world, (target_position));
                        }

                    }
                },   
                Effect::Stun((target, amt)) => {
                    match target {
                        Target::None => {

                        },
                        Target::Landing => {
                         //   let active = effect.update_target(turn_player);
                         //   game.active_effects.append(active);
                        },
                        Target::Player(addr) => {
                         //   let active = effect.update_target(addr);
                         //   game.active_effects.append(active);
                        }

                    }
                }          
            }

            set!(world, (game, turn_position));

        }

    }
}

