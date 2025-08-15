import {w3cwebsocket as W3CWebSocket} from "websocket";

const urlServer = '/ws/bots/{bot_id}/chats/{chat_id}/generate_stream';
export var client = new W3CWebSocket(urlServer);
client.onopen = () => {
    console.log('Websocket ')
}
export const reConnectionServer = () => {
    client = new W3CWebSocket(urlServer);
}
export const callAPIGenerationText = (query) => {
    client.send(JSON.stringify(query));
}