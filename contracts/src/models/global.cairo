#[derive(Drop, Serde)]
#[dojo::model]
struct Global {
    #[key]
    pub   global_key: u8,
    pub    pending_games: Array<u32>
}