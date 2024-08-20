import { FC, useState } from "react"
import { useDojo } from "../dojo/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";


interface MatchmakingProps {

}
export const Matchmaking: FC<MatchmakingProps> = () => {

    const {
        setup: {
            systemCalls: { create_game, join_game, start_game},
            clientComponents: { Game, Global }
        },
        account,
    } = useDojo();
    
    let [join_game_id, join_set_game] = useState(0);
    let [start_game_id, start_set_game] = useState(0);


    const global_key = getEntityIdFromKeys([BigInt(0)]) as Entity

    const global = useComponentValue(Global, global_key);
    let games = global?.pending_games;

    console.log(start_game_id)
    return (
        <div style={{
            position: 'fixed',
            top: 60,
            left: 0,
            width: '100%',
            padding: '10px',
            background: '#333',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-around',
            zIndex: 1000 }}>
            <button onClick={ () => create_game(account.account)}> Create Game </button>
            <div>
                <select value={join_game_id} onChange={ (e) => join_set_game(Number(e.target.value))}>
                    { games?.map( (pending_game_id, index) => {
                        let pending_game = getComponentValue(Game, getEntityIdFromKeys([BigInt(pending_game_id.value)]));
                        let is_joined = false;
                        let player_count = pending_game ? pending_game.players.length : 0
                        for(let i=0; i<player_count; i++) {
                            if(pending_game?.players[i].value == account.account.address) {
                                is_joined = true;
                                break;
                            }
                        }

                        if(!is_joined){
                            return (
                                <option key={index} value={pending_game_id.value}> {pending_game_id.value} </option>
                            )
                        }
                        
                    })}
                </select>
                <button onClick={() => join_game(account.account, join_game_id)}> Join game </button>
            </div>

            <div>
                <select value={start_game_id} onChange={ (e) => start_set_game(Number(e.target.value))}>
                    { games?.map( (pending_game_id, index) => {
                        let pending_game = getComponentValue(Game, getEntityIdFromKeys([BigInt(pending_game_id.value)]));
                        let is_creator = pending_game?.turn_player == BigInt(account.account.address)
                        let is_pending = pending_game?.status == 'Pending'
                        console.log(pending_game)
                        
                        if(is_creator && is_pending){
                            return (
                                <option key={index} value={pending_game_id.value}> {pending_game_id.value} </option>
                            )
                        }
                        
                    })}
                </select>
                <button onClick={() => start_game(account.account, start_game_id)}> Start game </button>
            </div>


        </div>
    )
}

