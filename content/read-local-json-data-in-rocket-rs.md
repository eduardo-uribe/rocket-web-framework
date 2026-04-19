+++
title = "Read local .json data in Rocket.rs"
date = 2026-01-30

[extra]
thread = 1
+++

I'm crafting a dead simple [Rust — Job Board](https://rustengineer.com).

I will be storing an array of Rust engineers inside a local `.json` file. Which, I then render as a list of [Rust Engineers — Seeking Work](https://rustengineer.com/rust-engineers-seeking-work).

Here is how we do this in [Rocket.rs](https://rocket.rs).

```rust
use std::fs;
use rocket::serde::{Deserialize, Serialize};
use rocket_dyn_templates::{Template, context};


#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct RustEngineer {
    ...
}

#[get("/")]
pub async fn get() -> Template {
    // Open and read JSON file data.
    let data = fs::read_to_string("././static/json/rust_engineers.json").unwrap();

    // Serialize data into JSON.
    let rust_engineers: Vec<RustEngineer> = serde_json::from_str(&data).unwrap();

    Template::render("rust-engineers", context!{ rust_engineers })
}
```
