import express, {Express} from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"
import http from 'http'
import ErrorHandler from "./middleware/error/ErrorHandler";
import NotFoundHandler from "./middleware/error/NotFound";
import {Server} from "node:http";
import authRouter from "./app/auth/auth.router";
import userRouter from "./app/user/user.router";

class App {
	protected app: Express;
	protected server: Server;

	constructor() {
		this.app = express()
		this.server = http.createServer(this.app)
		this.middleware()
		this.routes()
		this.errorHandler()
	}

	middleware() {
		// cors origin
		this.app.use(cors(
			{
				origin: ["http://localhost:5173"],
				credentials: true,
				methods:["GET", "POST", "PUT", "DELETE"]
			}
		))

		this.app.use(express.json({limit: "2mb"}))
		this.app.use(express.urlencoded({ extended: false, limit: "5mb" }))
		this.app.use(cookieParser())
	}

	routes() {
		this.app.use("/api/v1/auth", authRouter)
		this.app.use("/api/v1/user", userRouter)
	}

	errorHandler() {
		this.app.use(NotFoundHandler);
		this.app.use(ErrorHandler);
	}

	handleErrors() {
		process.on("unhandledRejection", (err ) => {
			console.log(`Shutting down the server for ${(err as any).message}`)

			this.server.close(() => process.exit(1))
		})
	}

}

export default App