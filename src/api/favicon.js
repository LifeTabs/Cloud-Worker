import { response_failed, response_success } from "../utils/response";
const addFavicon = {
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
  response_success,
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

const deleteFavicon = {
  ctx: null,
  async fetch(req, res, ctx) {
    this.ctx = ctx
    if(req.query.id) {
      const favicon = await this.delete_favicon(req.query.id)
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
  response_success,
  async delete_favicon (hash) {
    return this._delete_from_worker(hash)
  },
  async _delete_from_worker(hash) {
    await this.ctx.favicon.delete(hash)
    return {
      id: hash
    }
  }
}

export {
  addFavicon,
  deleteFavicon,
}