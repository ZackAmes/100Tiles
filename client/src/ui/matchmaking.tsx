import { FC, useState } from "react"
import { useDojo } from "../dojo/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

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
    
    let [game_id, set_game] = useState(0);

    const global_key = getEntityIdFromKeys([BigInt(0)]) as Entity

    const global = useComponentValue(Global, global_key);
    let games = global?.pending_games;

    let game = useComponentValue(Game, getEntityIdFromKeys([BigInt(game_id)]));

    return (
        <div style={{
            position: 'fixed',
            top: 50,
            left: 0,
            width: '100%',
            padding: '10px',
            background: '#333',
            color: '#fff',
            textAlign: 'center',
            justifyContent: 'space-between',
            zIndex: 1000 }}>
            <button onClick={ () => create_game(account.account)}> Create Game </button>
            <select value={game_id} onChange={ (e) => set_game(Number(e.target.value))}>
                { games?.map( (pending_game_id, index) => {
                    return (
                        <option key={index} value={pending_game_id.value}> {pending_game_id.value} </option>
                    )
                })}
            </select>
            <button onClick={() => join_game(account.account, game_id)}> Join game </button>



        </div>
    )
}

