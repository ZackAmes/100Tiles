import "./App.css";
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

function App() {
    const {
        setup: {
            systemCalls: { create_game, join_game, start_game, move },
            clientComponents: { Position, Game, Moved },
            toriiClient,
            contractComponents,
        },
        account,
    } = useDojo();

    
    useQuerySync(toriiClient, contractComponents as any, [
        {
            Keys: {
                keys: [BigInt(0).toString()],
                models: [
                    "Game",
                ],
                pattern_matching: "FixedLen",
            },
        },
        {
            Keys: {
                keys: [BigInt(0).toString(), BigInt(account?.account.address).toString()],
                models: [
                    "Position",
                ],
                pattern_matching: "FixedLen",
            },
        },
        {
            Keys: {
                keys: [BigInt(account?.account.address).toString()],
                models: [
                    "Moved",
                ],
                pattern_matching: "FixedLen",
            },
        },
    ]);
    

    let entityId = getEntityIdFromKeys([BigInt(0), BigInt(account?.account.address)]) as Entity
    let gameId = getEntityIdFromKeys([BigInt(0)]) as Entity
    let playerId = getEntityIdFromKeys([BigInt(account?.account.address)]) as Entity

    // get current component values
    const position = useComponentValue(Position, entityId);
    const game = useComponentValue(Game, gameId);
    const moved = useComponentValue(Moved, playerId);

    console.log(game);
    console.log(position);
    console.log(moved);

    

    return (
        <>
            <button onClick={() => account?.create()}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>

            <div className="card">
                <div>{`burners deployed: ${account.count}`}</div>
                <div>
                    select signer:{" "}
                    <select
                        value={account ? account.account.address : ""}
                        onChange={(e) => account.select(e.target.value)}
                    >
                        {account?.list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                    <p>
                        You will need to Authorise the contracts before you can
                        use a burner. See readme.
                    </p>
                </div>
                <div>
                    <button onClick={() => create_game(account.account)}>
                        Create Game
                    </button>
                </div>

                <div>
                    <button onClick={() => start_game(account.account, 0)}>
                        Start Game 0
                    </button>
                </div>

                <div>
                    <button onClick={() => join_game(account.account, 0)}>
                        Join Game 0
                    </button>
                </div>
                <div>
                    <button onClick={() => move(account.account, 0)}>
                        Move
                    </button>
                </div>
            </div>

        </>
    );
}

export default App;
