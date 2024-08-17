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
import Tile from "./components/general/Tile";

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
                    "ok-Game",
                ],
                pattern_matching: "FixedLen",
            },
        },
        {
            Keys: {
                keys: [BigInt(0).toString(), BigInt(account?.account.address).toString()],
                models: [
                    "ok-Position",
                ],
                pattern_matching: "FixedLen",
            },
        },
        {
            Keys: {
                keys: [BigInt(account?.account.address).toString()],
                models: [
                    "ok-Moved",
                ],
                pattern_matching: "FixedLen",
            },
        },
    ]);
    
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
            <button style={{ margin: '0 10px' }}>Button 1</button>
            <button style={{ margin: '0 10px' }}>Button 2</button>
            <button style={{ margin: '0 10px' }}>Button 3</button>
          </div>
        );
      }

    return (
        <>  
            <Toolbar />
            <Canvas style={{height:800, width:800}}>
                <OrbitControls />
                <Text position = {[0,2,2]} color={"black"}> {game? game.players?.at(0)?.toString(16) : "No Game"}</Text>
                
                <Root position = {[0,0,5]} backgroundColor="red" sizeX={2} sizeY={1} flexDirection="row">
                    <Container margin={5} backgroundColor="green" >
                        <Matchmaking />
                    </Container>
                    
                    <Container flexGrow={1} margin={5} backgroundColor="blue" />
                </Root>

                <Box args={[10,.1,10]} position={[0,-5,0]} rotation={[0,Math.PI/2,0]}/>
                <Tile position={[0,-4.9, 0]} effect={{direction:true, amt:5}}/>

            </Canvas>

        </>
    );
}

export default App;
