
const sendRequest = (url) => {
	return fetch(url).then((res) => {
		return res.arrayBuffer()
	})
}
export default {
	async fetch(request, env, ctx) {
    const upgradeHeader = request.headers.get('Upgrade');
		if (!upgradeHeader || upgradeHeader !== 'websocket') {
			return {body: "Expected Upgrade: websocket", status: 426};
		}
	
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);
	
		server.accept();
		server.addEventListener('message', event => {
			const data = JSON.parse(event.data)
			sendRequest(data.url)
			.then((res) => {
				env.wallpapers.put(data.hash, res)
				console.log("Sent");
				server.send(JSON.stringify(data))
			})
		});
	
		return {
			status: 101,
			webSocket: client,
		};
  },
};
