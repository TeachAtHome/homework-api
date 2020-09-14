// import { DatadogStatsdConfig } from './middlewares/DatadogStatsdMiddleware'

export class Environment {
  static isLocal(): boolean {
    return Environment.getStage() === 'local';
  }

  static isStaging(): boolean {
    return Environment.getStage() === 'staging';
  }

  static isProd(): boolean {
    return Environment.getStage() === 'prod';
  }

  static getStage(): string {
    return process.env.STAGE || 'local';
  }

  static getAppHost(): string {
    return process.env.APP_HOST || '0.0.0.0';
  }

  static getAppPort(): number {
    return (
      (process.argv[2] ? Number(process.argv[2]) : false) ||
      (process.env.APP_PORT ? Number(process.env.APP_PORT) : false) ||
      8080
    );
  }

  static getDBHost(): string {
    return process.argv[3] || '0.0.0.0';
  }

  static getDBPort(): number {
    return (
      (process.argv[4] ? Number(process.argv[4]) : false) ||
      (process.env.DB_PORT ? Number(process.env.DB_PORT) : false) ||
      27017
    );
  }

  static getDBName(): string {
    return process.env.DB_NAME || 'homework';
  }
}
