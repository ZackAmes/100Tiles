use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
struct Player {
    #[key]
    address: ContractAddress,
    games: Array<u32>
}

