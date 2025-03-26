import "../config/config"

const AppConfig = {
	PORT: process.env.PORT || 5000,
	NODE_ENV: process.env.NODE_ENV || "development",
	CLIENT_URL: process.env.CLIENT_URL,
}

export default AppConfig
export const { NODE_ENV } = AppConfig;
