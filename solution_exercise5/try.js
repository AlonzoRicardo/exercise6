const http = require("http");

const postOptions = {
    // host: "exercise6_messageapp_1",
    // host: "messageapp",
     host: "localhost",
    port: 9005,
    path: "/messages",
    method: "post",
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength('body')
    }
}

http.request(postOptions);