# Tournament Stream Overlay Manager (TSOM)
This program is a tool meant to be simple to use and modular. It is still in development but is making progress slowly but steady. ^^ 

## Features
### Near-future
- [x] Player Info Presets.
- [x] Dynamic game/character loading based on icons.
- [ ] Simple overlay swapping.
- [ ] Modular UI elements (letting you choose what player info to display).
- [ ] How to use documentation.

### Long-term
- [ ] Start.gg compatibility.
- [ ] Overlay creation tool.
- [ ] Slippi live replay compatibility.

## About
The goal of TSOM is to be an easy to use interface for overlay management, to make overlays at the moment you will need to know HTML and JS to render data. For those who wish to make overlays there will be a guide coming out in the future on how to connect to the websocket and use the data.  

TSOM is predominantly written in vue.js and Typescript. For the backend it uses Rust and Tauri due to the good performance Tauri provides local web apps (it won't eat RAM like electron.js does).