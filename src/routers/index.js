import { Router } from "@tsndr/cloudflare-worker-router";
import crawlingBot from "../websocket/crawling-bot";
import systemBackend from "../websocket/system-backend";
import favicon from "../api/favicon"

const router = new Router()
router.cors()

router.get("/", ({ req, res }) => {
  res.body = "I'm worker for lifetab system"
})

router.get('/crawling-bot', async ({ req, res, env }) => {
  const crawlBotController = await crawlingBot.fetch(req, env)
  res.status = crawlBotController.status
  res.body = crawlBotController.body
  res.webSocket = crawlBotController.webSocket
})

router.get('/system-backend', async ({ req, res, env }) => {
  const controller = await systemBackend.fetch(req, env)
  res.status = controller.status
  res.body = controller.body
  res.webSocket = controller.webSocket
})

router.post("/api/favicon", async ({ req, res, env }) => {
  const controller = await favicon.fetch(req, res, env)
  res.status = controller.status
  res.body = controller.body
  res.webSocket = controller.webSocket
})

export default router