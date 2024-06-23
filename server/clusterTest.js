const cluster = require('cluster');
const http = require('http');
const { Server } = require("socket.io");
const numCPUs = require('os').cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const socketMain = require('./socketMain');

const port = 8085;
const frontend = 'http://localhost:5173';

const ioOptions = {
  cors: {
    origin: frontend,
    methods: ["GET", "POST"],
    credentials: true,
  },
};

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  setupPrimary();

  cluster.setupPrimary({
    serialization: "advanced",
  });

  httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // Restart the worker
  });

} else {
  // Workers can share any TCP connection
  console.log(`Worker ${process.pid} started`);

  const httpServer = http.createServer();
  const io = new Server(httpServer, ioOptions);

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  io.on('connection', (socket) => {
    socketMain(io, socket);
    console.log(`connected to worker: ${cluster.worker.id}`);
  });
}
