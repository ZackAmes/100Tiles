import { Box, Text } from "@react-three/drei";
import { FC } from "react";

interface TileProps {
    position: [number, number, number],
    effect?: { direction: boolean, amt: number} | undefined

}

export const Tile: FC<TileProps> = ({position, effect}) => {

    let color = effect ? (effect.direction ? "green" : "red") : "white"

    return (
        <>
            <group position = {position} rotation={[0,Math.PI/2, 0]}>
                {effect && <Text scale={.1} color = "black"> {effect.amt} </Text>}
                <Box args={[.1,.01,.1]}>
                    <meshBasicMaterial color={color}/>
                </Box>

            </group>
        
        </>
    )
}

