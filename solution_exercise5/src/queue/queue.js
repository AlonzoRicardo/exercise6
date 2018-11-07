const kue = require("kue");
var util = require('util')
let queue = kue.createQueue();

const sendMessage = require("../controllers/sendMessage");

module.exports = function(req, res) {
  let job = queue
    .create("msg", {
      body: util.inspect(req.body)
    })
    .save(function(err) {
      if (!err) res.sendStatus(200).send(job.id);
    });
};

queue.on("job enqueue", function(id, type) {
  console.log("Job %s got queued of type %s", id, type);
});

queue.process("msg", function(job, done) {
  sendMessage(job.data.body, done)
});

