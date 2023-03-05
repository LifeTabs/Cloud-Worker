import { response_failed } from "../utils/response"
const isAuthenticated = async ({req, res, next, env}) => {
  if(isValidBackendKeyPair(req.headers, env.KEY_PAIR_BACKEND)) await next()
  else {
    res.body = response_failed("INVALID KEY_PAIR")
    res.status = 401
  }
}

const isValidBackendKeyPair = (header, KEY_PAIR_BACKEND) => {
  return header.get("X-BACKEND-KEY-PAIR") === KEY_PAIR_BACKEND
}

export {
  isAuthenticated
}