import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

function App() {
    const {
        setup: {
            systemCalls: { spawn, move },
            clientComponents: { Position, Game },
        },
        account,
    } = useDojo();

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

    // get current component values
        const position = useComponentValue(Position, entityId);
        return (

         <>
            <div>

                {position?.tile}
            </div>
        </>
    );
}

export default App;
