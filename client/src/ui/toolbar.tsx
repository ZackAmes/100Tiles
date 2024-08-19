import { FC } from "react"
import { useDojo } from "../dojo/useDojo"
import { blo } from "blo"


interface ToolbarProps {
    toggles: {
            matchmaking: {
              open: boolean, toggle: any
            },
            burners: {
              open: boolean, toggle: any
            },
            actions: {
              open: boolean, toggle: any
            }
          }
}

export const Toolbar: FC<ToolbarProps> = ( {toggles: { matchmaking, burners, actions}}) => {

    const { account } = useDojo();
    const toggle = (option: String) => {
        if(option=="matchmaking") {
          matchmaking.toggle(!matchmaking.open);
          actions.toggle(false);
          burners.toggle(false);
        }
        if(option=="actions") {
          matchmaking.toggle(false);
          actions.toggle(!actions.open);
          burners.toggle(false);
        }
        if(option=="burners") {
          matchmaking.toggle(false);
          actions.toggle(false);
          burners.toggle(!burners.open);
        }
      }
  
    let addr = account.account.address;
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
        flexDirection: 'row'
    }}>
        <span>Signer: </span>
        <img style={{margin: '0 10px'}} height={"30px"} width={"30px"} src={blo(`0x${addr}`)}/>
        
        <button onClick = {() => toggle("matchmaking")} style={{ margin: '0 10px' }}>Matchmaking</button>
        <button onClick = {() => toggle("actions")}style={{ margin: '0 10px' }}>Actions</button>
        <button onClick = {() => toggle("burners")}style={{ margin: '0 10px' }}>Burners</button>
    </div>
    );
    
  
}