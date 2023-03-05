import router from "./routers"
export default {
	async fetch(request, env) {
		return router.handle(env, request)
	}
}