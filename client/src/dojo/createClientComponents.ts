import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./generated/models.gen";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Position: overridableComponent(contractComponents.Position),
        Game: overridableComponent(contractComponents.Game),
        Tile: overridableComponent(contractComponents.Tile),
        Pending: overridableComponent(contractComponents.Pending),
    };
}
