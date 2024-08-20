import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Matchmaking } from "./ui/matchmaking";
import { Burners } from "./ui/burners";
import { Actions } from "./ui/actions";
import { Toolbar } from "./ui/toolbar";
import { Game as GameRender } from "./components/Game";

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

    const [matchmaking_open, toggle_matchmaking] = useState(false);
    const [burners_open, toggle_burners] = useState(false);
    const [actions_open, toggle_actions] = useState(false);
    const [game_id, set_game_id] = useState(0);


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
            {actions_open && <Actions game_id={game_id} set_game_id={set_game_id} />}

            <Canvas style={{justifySelf: 'center', height:800, width:800}}>
                <OrbitControls />
                <ambientLight />
                <GameRender game_id={game_id} />

            </Canvas>

        </>
    );
}

export default App;
