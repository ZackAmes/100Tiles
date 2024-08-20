import { FC, useState } from "react"
import { useDojo } from "../dojo/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { blo } from "blo";

interface ActionsProps {
    game_id: number,
    set_game_id: any

}
export const Actions: FC<ActionsProps> = ({game_id, set_game_id}) => {

    const {
        setup: {
            systemCalls: { move, set_pending, resolve_turn},
            clientComponents: { Game, Global, Player }
        },
        account,
    } = useDojo();
    
    let player = useComponentValue(Player, getEntityIdFromKeys([BigInt(account.account.address)]));


    let game = useComponentValue(Game, getEntityIdFromKeys([BigInt(game_id)]));

    let is_turn_player = game?.turn_player == BigInt(account.account.address);

    console.log(game?.turn_player.toString(16))
    return (
        <div style={{
            position: 'fixed',
            top: 50,
            left: 0,
            width: '100%',
            padding: '10px',
            background: '#333',
            color: '#fff',
            display: 'flow',
            alignContent: 'center',
            textAlign: 'center',
            justifyContent: 'space-between',
            zIndex: 1000 }}>
            <span> Game: </span>
            <select value={game_id} onChange={ (e) => set_game_id(Number(e.target.value))}>
                { player?.games?.map( (pending_game_id, index) => {
                    return (
                        <option key={index} value={pending_game_id.value}> {pending_game_id.value} </option>
                    )
                })}
            </select>
            <span> Turn Player: </span>
            <img height= {30} width={30} src={blo(`0x${game?.turn_player.toString(16)}`)}/>
            <button onClick={() => move(account.account, game_id)}>Move</button>
            <button onClick={() => set_pending(account.account, game_id, 1, 1)}>Set Pending</button>
            <button onClick={() => resolve_turn(account.account, game_id)}>Resolve</button>




        </div>
    )
}