import "../config/config"

const AppConfig = {
	PORT: process.env.PORT || 5000,
	NODE_ENV: process.env.NODE_ENV || "development",
}

export default AppConfig
export const { NODE_ENV } = AppConfig;
