import dotenv from "dotenv";

dotenv.config();

const AppConfig = {
	PORT: process.env.PORT || 5000
}

export default AppConfig