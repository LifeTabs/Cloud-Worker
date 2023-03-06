import { Router } from "@tsndr/cloudflare-worker-router";
import crawlingBot from "../websocket/crawling-bot";
import systemBackend from "../websocket/system-backend";
import { addFavicon, deleteFavicon, getFavicon } from "../api/favicon"
import { isAuthenticated } from "../middleware/auth";

const router = new Router()
router.cors()


router.get("/", ({ req, res }) => {
  res.body = "I'm worker for lifetab system"
})

router.get('/crawling-bot', isAuthenticated, async ({ req, res, env }) => {
  const crawlBotController = await crawlingBot.fetch(req, env)
  res.status = crawlBotController.status
  res.body = crawlBotController.body
  res.webSocket = crawlBotController.webSocket
})

router.get('/system-backend', isAuthenticated, async ({ req, res, env }) => {
  const controller = await systemBackend.fetch(req, env)
  res.status = controller.status
  res.body = controller.body
  res.webSocket = controller.webSocket
})

router.post("/api/favicon", isAuthenticated, async ({ req, res, env }) => {
  const controller = await addFavicon.fetch(req, res, env)
  console.log(controller);
  res.status = controller.status
  res.body = controller.body
  res.webSocket = controller.webSocket
})

router.delete("/api/favicon", isAuthenticated, async ({ req, res, env }) => {
  const controller = await deleteFavicon.fetch(req, res, env)
  res.status = controller.status
  res.body = controller.body
  res.webSocket = controller.webSocket
})

router.get("/favicon/:id", async ({ req, res, env }) => {
  const controller = await getFavicon.fetch(req, res, env)
  res.status = controller.status
  res.body = controller.body
  res.raw = controller.raw
})

export default router