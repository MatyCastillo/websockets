import fs from "fs";
import __dirname from "../utils.js";

const chatURL = __dirname + "/files/chat.txt";
class Chat {
  async save(object) {
    let data = await fs.promises.readFile(chatURL, "utf-8");
    let messages = JSON.parse(data);
    let message = {
      socketID: object.socketID,
      timestamp: object.timestamp,
      inputName: object.inputName,
      message: object.message,
    };
    messages.push(message);
    try {
      await fs.promises.writeFile(chatURL, JSON.stringify(messages, null, 2));
      return {
        status: "success",
        message: "ok",
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error : " + error,
      };
    }
  }
  async getAll() {
    try {
      let data = await fs.promises.readFile(chatURL, "utf-8");
      let messages = JSON.parse(data);
      return { status: "success", messages: messages };
    } catch (error) {
      return {
        status: "error",
        message: "Error: " + error,
      };
    }
  }
}

export default Chat;
