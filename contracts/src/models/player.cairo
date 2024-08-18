use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
struct Player {
    #[key]
    pub    address: ContractAddress,
    pub    games: Array<u32>
}

