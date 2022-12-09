/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const sendRequest = (url) => {
	return fetch(url).then((res) => {
		return res.arrayBuffer()
	})
}
export default {
	async fetch(request, env, ctx) {
    const upgradeHeader = request.headers.get('Upgrade');
		if (!upgradeHeader || upgradeHeader !== 'websocket') {
			return new Response('Expected Upgrade: websocket', { status: 426 });
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
	
		return new Response(null, {
			status: 101,
			webSocket: client,
		});
  },
};
