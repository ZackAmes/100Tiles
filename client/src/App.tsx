import "./App.css";
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

function App() {
    const {
        setup: {
            systemCalls: { move },
            clientComponents: { Position, },
            toriiClient,
            contractComponents,
        },
        account,
    } = useDojo();

    /*
    useQuerySync(toriiClient, contractComponents as any, [
        {
            Keys: {
                keys: [BigInt(account?.account.address).toString()],
                models: [
                    "dojo_starter-Position",
                    "dojo_starter-Moves",
                    "dojo_starter-DirectionsAvailable",
                ],
                pattern_matching: "FixedLen",
            },
        },
    ]);
    */


    // get current component values
    //const position = useComponentValue(Position, entityId);

    

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
            </div>

        </>
    );
}

export default App;
