const http = require("http");
const saveMessage = require("../clients/saveMessage");
const getCredit = require("../clients/getCredit");

const random = n => Math.floor(Math.random() * Math.floor(n));

module.exports = function(msgData, done) {
  console.log(msgData);
  const entireMsg = msgData
  const body = JSON.stringify(msgData.messObj);
  console.log(body);
  var query = getCredit();

  query.exec(function(err, credit) {
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
      //console.log(postReq);
      
      postReq.on("response", postRes => {
        //console.log(postRes, '<==');
        if (postRes.statusCode === 200) {
          console.log('enters 200')
          saveMessage(
            {
              ...entireMsg,
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
              ...entireMsg,
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
            ...entireMsg,
            status: "TIMEOUT"
          },
          () => {
            console.log("Internal server error: TIMEOUT")
          }
        );
      });
      
      postReq.write(body);
      postReq.end();
      postReq.on("error", () => {});

    } else {
      console.log("No credit error")
    }
  });
};
