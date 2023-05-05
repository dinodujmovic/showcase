import { MediaMetadataDto } from './media.dto';
import { config } from '../../../config';
import * as mkdirp from 'mkdirp';

// Multer config
export const mediaConfig = {
  // Storage
  diskStorageConfig: {
    destination: function(req: any, file: MediaMetadataDto, cb) {
      const destination = `${config.dataPath}/${req.user.id}`;
      mkdirp.sync(destination);
      cb(null, destination);
    },
    filename: function(req: any, file: MediaMetadataDto, cb) {
      const fileExtension = (file.originalname.match(/\.+[\S]+$/) || [])[0];
      cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);
    },
  },
  // Images
  supportedImageFormats: config.media.supportedImageFormats,
  imageFileFilter: (req, file: MediaMetadataDto, cb) => {
    if (mediaConfig.supportedImageFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  imageFileSizeLimit: {
    fieldSize: config.media.imageFileSizeLimit,
    fileSize: config.media.imageFileSizeLimit,
    files: config.media.imageFilesLimit,
  },
  // Video
  supportedVideoFormats: config.media.supportedVideoFormats,
  videoFileSizeLimit: {
    fileSize: config.media.videoFileSizeLimit,
    files: config.media.imageFilesLimit,
  },
  videoFileFilter: (req, file: MediaMetadataDto, cb) => {
    if (mediaConfig.supportedVideoFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};
