const kue = require("kue");
let queue = kue.createQueue();
const uuidv4 = require("uuid/v4");
const sendMessage = require("../controllers/sendMessage");

module.exports = function(req, res) {
  let uniqueId = uuidv4();
  let messObj = req.body;
  messObj.uuid = uniqueId;
  
 
    let job = queue
      .create("msg", {
        messObj
      })
      .ttl(6000)
      .removeOnComplete(false)
      .save(function(err) {
        if (!err) res.send(`queue entry number: ${job.id}`);
      });
};

queue.on("job enqueue", function(id, type) {
  console.log("Job %s got queued of type %s", id, type);
});

queue.process("msg", function(job, done) {
  sendMessage(job.data, done);
});
