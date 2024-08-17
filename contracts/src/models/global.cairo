#[derive(Drop, Serde)]
#[dojo::model]
struct Global {
    #[key]
    global_key: u8,
    pending_games: Array<u32>
}