import { JwtModuleOptions } from '@nestjs/jwt';
import { readFileSync } from 'fs';

let packagePath: string;

if (process.env.IS_TEST) {
  packagePath = `${__dirname}/../package.json`;
} else {
  packagePath = `${__dirname}/../../package.json`;
}

const appPackage = readFileSync(packagePath, {
  encoding: 'utf8',
});
const appData = JSON.parse(appPackage);

export interface Config {
  version: string;
  name: string;
  description: string;
  dataPath: string,
  assets: {
    path: string,
    prefix: string
  },
  database: {
    type: any,
    host: string,
    port: number,
    username: string,
    password: string,
    database: string
  },
  swagger: {
    title: string,
    description: string,
    version: string,
    tag: string,
    path: string
  },
  jwt: {
    jwtOptions: JwtModuleOptions
  };
  media: {
    imageFilesLimit: number,
    imageFileSizeLimit: number,
    videoFilesLimit: number,
    videoFileSizeLimit: number,
    supportedImageFormats: string[],
    supportedVideoFormats: string[]
  },
  bcrypt: {
    saltRounds: number
  };
  logger: {
    level: string;
    transports?: any[];
  };
}

export const config: Config = {
  version: appData.version,
  name: appData.name,
  description: appData.description,
  dataPath: '../data',
  assets: {
    path: `${__dirname}/../../../data`, // usr/src/app/dist/config/../../../data
    prefix: '/media',
  },
  database: {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  swagger: {
    title: 'Showcase',
    description: 'The showcase API description',
    version: '1.0',
    tag: 'showcase',
    path: '/swagger',
  },
  jwt: {
    jwtOptions: {
      secret: 'showcase-app-secret-key',
      signOptions: {
        expiresIn: '9999y', // never
      },
    },
  },
  media: {
    imageFilesLimit: 1,
    imageFileSizeLimit: 2 * 1024 * 1024, // 2 MB
    videoFilesLimit: 1,
    videoFileSizeLimit: 10 * 1024 * 1024, // 10 MB
    supportedImageFormats: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    supportedVideoFormats: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/MP2T', 'application/x-mpegURL', 'video/x-flv'],
  },
  bcrypt: {
    saltRounds: 10,
  },
  logger: {
    level: 'debug',
  },
};
