const sendNotification = (subscription, params) => {
  const data = {
    subscription,
    applicationKeys: {
      private: "MUNnqhtvWg4hFO7Q8XlQ5ujLgLcgN2ZpjARXzBjTWnY",
      public:
        "BAnuT5PUWTCx6IUBS_po0zj0evk1u_XvktO-PPzQuwZNF_54-pTtSzaJ_f72GNdQDUfFKwy2EPear5BWY4P78zY",
    },
    data: JSON.stringify(params),
  };
  return fetch("https://web-push-codelab.glitch.me/api/send-push-msg", {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "PostmanRuntime/7.29.2",
    },
    body: JSON.stringify(data),
    method: "POST",
  })
  .then((res) => res.text())
};
const dic_timers = {};
const handlerJobEvents = (data, server) => {
  console.log(data);
  const subscribers = data.Event.User.Subscribers
  const timeOut = new Date(data.Event.full_date).getTime() - new Date().getTime()
  const event = data.Event
  const sendBack = (msg) => {
    server.send(JSON.stringify(msg));
  };
  if (dic_timers.userId) {
    clearTimeout(dic_timers.userId.idTimeOut);
  }
  dic_timers.userId = data;
  const timer = (data) =>
    setTimeout(() => {
      console.log("Sent");
      const handlers = subscribers.map((subscriber) => {
        return new Promise((solver,) => {
          sendBack({
            status: "DONE_JOB",
            message: "The worker has done job, need more jobs!",
            data,
          });
          sendNotification(JSON.parse(subscriber.uri_notification), {
            type: "event",
            title: event.name,
            message: event.description,
          }).then((res) => {
            console.log(res);
            sendBack({
              status: "LOG_INFO",
              message: "The worker has push notification!",
              data,
            });
            solver()
          });
        })
      });
      Promise.all(handlers).then(() => {
        console.log("Sent back!");
      })
    }, timeOut);
  dic_timers.userId.idTimeOut = timer(dic_timers.userId);
  sendBack({
    status: "GOT_JOB",
    message: "The worker got the job!",
  });
};
export default {
  async fetch(request, env, ctx) {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return { body: "Expected Upgrade: websocket", status: 426 };
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    server.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      handlerJobEvents(data, server);
    });
    return {
      status: 101,
      webSocket: client,
    };
  },
};
