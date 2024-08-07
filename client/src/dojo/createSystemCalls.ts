import { AccountInterface } from "starknet";
import {
    Entity,
    Has,
    HasValue,
    World,
    defineSystem,
    getComponentValue,
} from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import type { IWorld } from "./generated/contracts.gen";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    { Position, Game, Tile, Pending }: ClientComponents,
    world: World
) {
   

    const move = async (account: AccountInterface) => {
        const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity;

        // Update the state before the transaction
        const positionId = uuid();

        try {
            await client.actions.move({
                account,
            });

        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
        } finally {
            Position.removeOverride(positionId);
        }
    };

    return {
        move,
    };
}
