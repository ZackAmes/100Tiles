// define the interface
#[dojo::interface]
trait IMatchmaking {
    fn create_game(ref world: IWorldDispatcher) -> u32;
    fn join_game(ref world: IWorldDispatcher, game_id:u32);
    fn start_game(ref world: IWorldDispatcher, game_id: u32);
 //   fn pending_games(ref world: IWorldDispatcher) -> Array<u32>;
}

#[dojo::contract]
mod matchmaking {

    use super::{IMatchmaking};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo_starter::models::{
        position::{Position}, game::{Game, Status}
    };

    #[abi(embed_v0)]
    impl matchmakingImpl of IMatchmaking<ContractState> {
        fn create_game(ref world: IWorldDispatcher) -> u32{
            let player = get_caller_address();
            let game_id = world.uuid();
            let players = array![player];
            let status = Status::Pending;

            let game = Game {game_id, players, tile_length: 100, turn_player:player, status};
            let position = Position {game_id, player, tile:1};
            set!(world, (game, position));
            game_id
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
    }
}