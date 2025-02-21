import express, {Express} from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"
import http from 'http'
import ErrorHandler from "./middleware/ErrorHandler";
import NotFoundHandler from "./middleware/NotFound";
import {Server} from "node:http";

class App {
	protected app: Express;
	protected server: Server;

	constructor() {
		this.app = express()
		this.server = http.createServer(this.app)
		this.middleware()
		this.router()
		this.errorHandler()
	}


	middleware() {
		// cors origin
		this.app.use(cors(
			{
				origin: "*",
				credentials: true,
				methods:["GET", "POST", "PUT", "DELETE"]
			}
		))

		this.app.use(express.json({limit: "10mb"}))
		this.app.use(express.urlencoded({ extended: true }))
		this.app.use(cookieParser())
	}

	router() {
	}

	errorHandler() {
		this.app.use(NotFoundHandler);
		this.app.use(ErrorHandler);
	}

}

export default App