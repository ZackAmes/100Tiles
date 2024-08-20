import { FC } from "react";
import { useDojo } from "../dojo/useDojo";
import {Tile as TileRender} from "./Tile" ;
import { Box } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface GameProps {
    game_id: number
}

export const Game: FC<GameProps> = ({game_id}) => {

    let { account, setup: {clientComponents: {Tile, Game, Position}}} = useDojo();
    let { camera } = useThree();

    const array = Array.from({ length: 100 }, (_, i) => i);

    let tiles = array.map( (index) => {
        let key = getEntityIdFromKeys([BigInt(game_id),BigInt(index)]);
        let tile = useComponentValue(Tile, key);
        let effect = tile ? tile.effect : undefined
        console.log(effect)

        return (
            <TileRender position={[0,-4.9, index]} />
        )
    })

    return (
        <group position={[0,0,0]}>

            <Box args={[10,.1,100]} position={[0,-5,0]} rotation={[0,Math.PI/2,0]}>
                <meshToonMaterial color="green"/>
            </Box>



        </group>
    )
} 