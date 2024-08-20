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
   

    const move = async (account: AccountInterface, game_id: number) => {
        const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity;

        // Update the state before the transaction
        const positionId = uuid();

        try {
            await client.actions.move({
                account,
                game_id
            });

        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
        } finally {
            Position.removeOverride(positionId);
        }
    };

    const resolve_turn = async (account: AccountInterface, game_id: number) => {
        const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity;

        // Update the state before the transaction
        const positionId = uuid();

        try {
            await client.actions.resolve_turn({
                account,
                game_id
            });

        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
        } finally {
            Position.removeOverride(positionId);
        }
    };

    const set_pending = async (account: AccountInterface, game_id: number, effect_id: number, amt: number) => {
        
        try {
            await client.actions.set_pending_effect({
                account,
                game_id,
                effect_id,
                amt
            });

        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const join_game = async (account: AccountInterface, game_id: number) => {
        const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity;

        // Update the state before the transaction
        const positionId = uuid();

        try {
            await client.matchmaking.join_game({
                account,
                game_id
            });

        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
        } finally {
            Position.removeOverride(positionId);
        }
    };

    const create_game = async (account: AccountInterface) => {
        try {
            await client.matchmaking.create_game({
                account,
            });

        } catch (e) {
            console.log(e);
        }
    }
    const start_game = async (account: AccountInterface, game_id: number) => {
        console.log("starting game " + game_id)
        try {
            await client.matchmaking.start_game({
                account,
                game_id
            });

        } catch (e) {
            console.log(e);
        }
    }

    return {
        create_game,
        join_game,
        start_game,
        move,
        set_pending,
        resolve_turn
    };
}
