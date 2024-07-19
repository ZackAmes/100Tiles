// define the interface
#[dojo::interface]
trait IActions {
    fn spawn(ref world: IWorldDispatcher);
    fn move(ref world: IWorldDispatcher);
    fn create_game(ref world: IWorldDispatcher);
    fn join_game(ref world: IWorldDispatcher, game_id:u32);
    fn start_game(ref world: IWorldDispatcher, game_id: u32);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo_starter::models::{
        position::{Position}, game::{Game, Status}
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

        fn create_game(ref world: IWorldDispatcher) {
            let player = get_caller_address();
            let game_id = world.uuid();
            let players = array![player];
            let status = Status::Pending;

            let game = Game {game_id, players, tile_length: 100, turn_player:player, status};
            let position = Position {game_id, player, tile:1};
            set!(world, (game, position));
        }

        fn join_game(ref world: IWorldDispatcher, game_id: u32) {
            let player = get_caller_address();

            let mut game = get!(world, game_id, (Game));
            assert!(game.status == Status::Pending, "Game not joinable");

            let mut position = get!(world, (game_id, player), Position);
            assert!(position.tile == 0, "Already joined");

            game.players.append(player);
            position.tile = 1;

            set!(world, (game, position));

        }

        fn start_game(ref world: IWorldDispatcher, game_id: u32) {

            let player = get_caller_address();
            let mut game = get!(world, game_id, Game);

            assert!(game.status == Status::Pending, "Game already started");
            
            assert!(game.turn_player == player, "Not lobby creator");

            game.status = Status::Active;

            set!(world, (game));


        }

        fn spawn(ref world: IWorldDispatcher) {
            let player = get_caller_address();
            let mut game = get!(world, 0, (Game));

            game.players = array![player];
            game.status = Status::Active;
            let position = Position { game_id: 0, player, tile: 1};

            set!(world, (game, position));

        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref world: IWorldDispatcher) {
            let player = get_caller_address();
            let mut position = get!(world, (0, player), (Position));

            let mut dice = DiceTrait::new(6, get_block_timestamp().into());
            let res = dice.roll();

            position.tile += res;

            set!(world, (position));

            emit!(world, (Moved { player, amt: res }));
        }
    }
}

