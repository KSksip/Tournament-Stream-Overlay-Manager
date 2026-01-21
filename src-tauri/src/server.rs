// code from Momori Nakano's guide @ https://momori.dev/posts/building-a-websocket-chat-app-with-axum-and-react/
//  https://momori.dev/
//  https://github.com/momori256

//TODO: write my own code/or improve this

use axum::{
    extract::{
        ws::{Message, WebSocket},
        State, WebSocketUpgrade,
    },
    response::Response,
    routing::get,
    Router,
};
//os::linux::raw::stat,
use std::sync::Arc;
use tokio::sync::{
    broadcast::{self, Receiver, Sender},
    Mutex,
};

use futures_util::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt,
};
use tower_http::services::ServeDir;

pub async fn run() {
    let router = Router::new().merge(route());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .expect("Failed to bind");

    axum::serve(listener, router).await.expect("Oops");
}

#[derive(Debug, Clone)]
struct AppState {
    broadcast_tx: Arc<Mutex<Sender<Message>>>,
}
fn route() -> Router {
    let (tx, mut rx1) = broadcast::channel(16);
    let app = AppState {
        broadcast_tx: Arc::new(Mutex::new(tx)),
    };
    Router::new()
        .route("/", get(handler))
        .with_state(app)
        .nest_service("/overlay", ServeDir::new("assets"))
}

async fn handler(ws: WebSocketUpgrade, State(app): State<AppState>) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, app))
}

async fn handle_socket(mut ws: WebSocket, app: AppState) {
    let (ws_tx, ws_rx) = ws.split();
    let ws_tx = Arc::new(Mutex::new(ws_tx));

    {
        let broadcast_rx = app.broadcast_tx.lock().await.subscribe();
        tokio::spawn(async move {
            recv_broadcast(ws_tx, broadcast_rx).await;
        });
    }

    recv_from_client(ws_rx, app.broadcast_tx).await;
}

async fn recv_from_client(
    mut client_rx: SplitStream<WebSocket>,
    broadcast_tx: Arc<Mutex<Sender<Message>>>,
) {
    while let Some(Ok(msg)) = client_rx.next().await {
        if matches!(msg, Message::Close(_)) {
            return;
        }
        if broadcast_tx.lock().await.send(msg).is_err() {
            println!("Failed to broadcast a message");
        }
    }
}

async fn recv_broadcast(
    client_tx: Arc<Mutex<SplitSink<WebSocket, Message>>>,
    mut broadcast_rx: Receiver<Message>,
) {
    while let Ok(msg) = broadcast_rx.recv().await {
        if client_tx.lock().await.send(msg).await.is_err() {
            return; // disconnected.
        }
    }
}
