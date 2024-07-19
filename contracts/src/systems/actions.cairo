// define the interface
#[dojo::interface]
trait IActions {
    fn spawn(ref world: IWorldDispatcher);
    fn move(ref world: IWorldDispatcher);
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
        fn spawn(ref world: IWorldDispatcher) {
            let player = get_caller_address();
            let mut game = get!(world, 0, (Game));

            game.players = array![player].span();
            game.status = Status::Active;
            let position = Position { game_id: 0, player, tile: 0};

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

