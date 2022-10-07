import express from "express";
import { engine } from "express-handlebars";
import cors from "cors";
import ProductsContainer from "./classes/ProductsContainer.js";
import productsRouter from "./routes/products.routes.js";
import Chat from "./classes/chat.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";

const app = express();
const server = app.listen(8080, () => {
  console.log("server listening on port 8080");
});
const container = new ProductsContainer();
export const io = new Server(server);
const chat = new Chat();
let messages = [];

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const admin = true;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  req.auth = admin;
  next();
});
app.use("/api/products", productsRouter);

app.get("/products", (req, res) => {
  container.getAll().then((result) => {
    let info = result.products;
    let prepareObject = {
      products: info,
    };
    res.render("products", prepareObject);
  });
});

//socket
io.on("connection", async (socket) => {
  socket.emit("messagelog", messages);
  console.log(`El socket ${socket.id} se ha conectado`);

  let products = await container.getAll();
  socket.emit("updateProducts", products);

  chat.getAll().then((res) => {
    socket.emit("messagelog", res.messages);
  });

  socket.on("message", (data) => {
    console.log(data);
    chat.save({ socketID: socket.id, ...data });
    io.emit("notification", data);
  });
});

app.get("*", function (req, res) {
  res.send({
    error: "not_implemented",
    description: `Ruta ${req.url} método ${req.method} no implementada`,
  });
});
