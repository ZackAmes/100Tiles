import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Plane, Text, Box } from "@react-three/drei";
import { Root, Container, Text as UIText } from "@react-three/uikit";
import { Button } from "./components/default/button";
import { Matchmaking } from "./ui/matchmaking";
import Tile from "./components/Tile";

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

    
    useQuerySync(toriiClient, contractComponents as any, []);
    
    console.log(account.account.address)
    const entityId = getEntityIdFromKeys([BigInt(0), BigInt(account?.account.address)]) as Entity
    const gameId = getEntityIdFromKeys([BigInt(0)]) as Entity
    const playerId = getEntityIdFromKeys([BigInt(account?.account.address)]) as Entity

    // get current component values
    const position = useComponentValue(Position, entityId);
    const game = useComponentValue(Game, gameId);
    const moved = useComponentValue(Moved, playerId);

    console.log(game);
    console.log(position);
    console.log(moved);


    const [matchmaking_open, toggle_matchmaking] = useState(false);

    const Toolbar = () => {
        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: '10px',
            background: '#333',
            color: '#fff',
            textAlign: 'center',
            zIndex: 1000,
          }}>
            <button onClick = {() => toggle_matchmaking(!matchmaking_open)} style={{ margin: '0 10px' }}>Matchmaking</button>
            <button style={{ margin: '0 10px' }}>Button 2</button>
            <button style={{ margin: '0 10px' }}>Button 3</button>
          </div>
        );
      }

    return (
        <>  
            <Toolbar />
            {matchmaking_open && <Matchmaking />}



            <Canvas style={{height:800, width:800}}>
                <OrbitControls />
                <Text position = {[0,2,2]} color={"black"}> {game? game.players?.at(0)?.value.toString(16) : "No Game"}</Text>

                <Box args={[10,.1,10]} position={[0,-5,0]} rotation={[0,Math.PI/2,0]}/>
                <Tile position={[0,-4.9, 0]} effect={{direction:true, amt:5}}/>

            </Canvas>

        </>
    );
}

export default App;
