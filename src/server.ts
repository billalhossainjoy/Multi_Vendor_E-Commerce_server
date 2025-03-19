import ConnectDB from "./config/db.config";
import appConfig from "./config/app.config";
import App from "./app";

class Server extends App {
  start = () => {
    ConnectDB()
        .then(() => {
          this.server.listen(appConfig.PORT, () => console.log(`Server running on http://localhost:${appConfig.PORT}`))
        })
        .catch((err) => console.log(err))
  }
}


const server = new Server();

server.start()