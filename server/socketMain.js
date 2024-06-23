const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData").then(() => {
  console.log("mongodb is connected ");
});
const Machine = require("./models/Machine");

function socketMain(io, socket) {
  let macA;
  // console.log("A socket connectd!", socket.id)

  socket.on("clientAuth", async (key) => {
    if (key === "5t78yuhgirekjaht32i3") {
      // valid nodeClient
      socket.join("clients");
    } else if (key === "uihjt3refvdsadf") {
      // valid ui client has joined
      socket.join("ui");
      console.log("A react client has joined!");
      const docs = await Machine.find({});
      docs.forEach((aMachine) => {
        // on load, assume that all machines are offline
        aMachine.isActive = false;
        io.to("ui").emit("data", aMachine);
      });
    } else {
      // an invalid client has joined. Goodbye
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", async () => {
    let docs = await Machine.find({ macA: macA });
    if (docs.length > 0) {
      // send one last emit to React
      docs[0].isActive = false;
      io.to("ui").emit("data", docs[0]);
    }
  });

  socket.on("initPerfData", async (data) => {
    // update our socket connect function scoped variable
    macA = data.macA;
    // now go check mongo!
    const mongooseResponse = await checkAndAdd(data);
    console.log(mongooseResponse);
  });

  socket.on("perfData", (data) => {
    console.log("Tick...");
    io.to("ui").emit("data", data);
  });
}

// a machine has connected, check to see if it's new.
// if it is, add it!

function checkAndAdd(data) {
  // because we are doing db stuff, js wont wait for the db
  // so we need to make this a promise
  return new Promise( async (resolve, reject) => {
    let doc = await Machine.findOne({ macA: data.macA })
        if (doc === null) {
        // these are the droids we're looking for!
        // the record is not in the db, so add it!
        let newMachine = new Machine(data);
        newMachine.save(); //actually save it
        console.log("added")
        resolve("added");
      } else {
        // it is in the db. just resolve
        resolve("found");
      }
    });
  }

module.exports = socketMain;
