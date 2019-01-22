export default class Config {
    static apiEndpoint: string

    public static loadConfig(): void {
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
            Config.apiEndpoint = "http://localhost:8000"
        } else {
            Config.apiEndpoint = "https://app.vkazu.ch"
        }
    }

    public static isModeProduction(): boolean {
        return Config.isMode('production')
    }

    public static isModeDev(): boolean {
        return Config.isMode('development')
    }

    private static isMode(mode: string): boolean {
        return (process.env.NODE_ENV || 'production').toLowerCase() === mode.toLowerCase()
    }
}