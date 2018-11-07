const http = require("http");
const saveMessage = require("../clients/saveMessage");
const getCredit = require("../clients/getCredit");

const random = n => Math.floor(Math.random() * Math.floor(n));

module.exports = function(reqBody, done) {
  
  const body = JSON.stringify(reqBody);

  var query = getCredit();

  query.exec(function(err, credit) {
    debugger
    if (err) return console.log(err);

    current_credit = credit[0].amount;

    if (current_credit > 0) {
      const postOptions = {
        // host: "exercise6_messageapp_1",
        // host: "messageapp",
         host: "localhost",
        port: 3000,
        path: "/message",
        method: "post",
        json: true,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      };

      let postReq = http.request(postOptions);

      postReq.on("response", postRes => {
        if (postRes.statusCode === 200) {
          saveMessage(
            {
              ...reqBody,
              status: "OK"
            },
            function(_result, error) {
              if (error) {
                console.log(error)
              } else {
                console.log(postRes.body)
              }
            }
          );
        } else {
          console.error("Error while sending message");

          saveMessage(
            {
              ...reqBody,
              status: "ERROR"
            },
            () => {
              console.log("Internal server error: SERVICE ERROR")
            }
          );
        }
      });

      postReq.setTimeout(random(6000));

      postReq.on("timeout", () => {
        console.error("Timeout Exceeded!");
        postReq.abort();

        saveMessage(
          {
            ...reqBody,
            status: "TIMEOUT"
          },
          () => {
            console.log("Internal server error: TIMEOUT")
          }
        );
      });

      postReq.on("error", () => {});

      postReq.write(body);
      postReq.end();
    } else {
      console.log("No credit error")
    }
  });
  done();
};
