import { response_failed, response_success } from "../utils/response";
export default {
  ctx: null,
  async fetch(req, res, ctx) {
    this.ctx = ctx
    if(req.body.url) {
      const favicon = await this.save_favicon(req.body.url)
      return {
        body: response_success(favicon)
      }
    }
    return { 
      status: 400,
      body: this.response_failed("MISSING_PARAM")
    }

  },
  response_failed,
  async save_favicon (url) {
    const res = await fetch(url).then((res) => {
      return res.arrayBuffer()
    })
    .then((res) => {
      return this._put_to_worker(res)
    })
    return res
  },
  async _put_to_worker(buffer) {
    const hash = crypto.randomUUID()
    await this.ctx.favicon.put(hash, buffer)
    return {
      id: hash,
    }
  }
}