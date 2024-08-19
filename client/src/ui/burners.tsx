import { FC, useState } from "react"
import { useDojo } from "../dojo/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

interface BurnersProps {

}
export const Burners: FC<BurnersProps> = () => {

    const {
        setup: {
        },
        account,
    } = useDojo();
    

    return (
        <div style={{
            position: 'fixed',
            top: 50,
            left: 0,
            width: '100%',
            padding: '10px',
            background: '#333',
            color: '#fff',
            textAlign: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
            flexDirection: 'row'
             }}>

            <button onClick={() => account?.create()}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>

            <div >
                <div>{`burners deployed: ${account.count}`}</div>
                <div>
                    select signer:{" "}
                    <select
                        value={account ? account.account.address : ""}
                        onChange={(e) => account.select(e.target.value)}
                    >
                        {account?.list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                </div>
            </div>



        </div>
    )
}