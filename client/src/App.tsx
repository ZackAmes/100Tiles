import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Plane, Text, Box } from "@react-three/drei";
import { Matchmaking } from "./ui/matchmaking";
import { Burners } from "./ui/burners";
import { Actions } from "./ui/actions";
import { Toolbar } from "./ui/toolbar";
import Tile from "./components/Tile";

function App() {
    const {
        setup: {
            systemCalls: { },
            clientComponents: {Position, Game, Global },
            toriiClient,
            contractComponents,
        },
        account,
    } = useDojo();

    useQuerySync(toriiClient, contractComponents as any, []);
    
    console.log(account.account.address)
    const entityId = getEntityIdFromKeys([BigInt(0), BigInt(account?.account.address)]) as Entity
    const gameId = getEntityIdFromKeys([BigInt(0)]) as Entity

    // get current component values
    const position = useComponentValue(Position, entityId);
    const game = useComponentValue(Game, gameId);

    console.log(game);
    console.log(position);

    const [matchmaking_open, toggle_matchmaking] = useState(false);
    const [burners_open, toggle_burners] = useState(false);
    const [actions_open, toggle_actions] = useState(false);

    const toggles = {
      matchmaking: {
        open: matchmaking_open, toggle: toggle_matchmaking
      },
      burners: {
        open: burners_open, toggle: toggle_burners
      },
      actions: {
        open: actions_open, toggle: toggle_actions
      }
    }

    return (
        <>  
            <Toolbar toggles={toggles}/>
            {matchmaking_open && <Matchmaking />}
            {burners_open && <Burners />}
            {actions_open && <Actions />}

            <Canvas style={{height:800, width:800, backgroundColor: '0x000'}}>
                <OrbitControls />
                <Text position = {[0,2,2]} color={"black"}> {game? game.players?.at(0)?.value.toString(16) : "No Game"}</Text>

                <Box args={[10,.1,10]} position={[0,-5,0]} rotation={[0,Math.PI/2,0]}/>
                <Tile position={[0,-4.9, 0]} effect={{direction:true, amt:5}}/>

            </Canvas>

        </>
    );
}

export default App;
