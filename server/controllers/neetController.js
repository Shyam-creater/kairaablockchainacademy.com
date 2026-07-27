import NeetModel from '../models/neetModel.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { CatchAsyncError } from '../middleware/catchAsyncErrors.js';
import cloudinary from 'cloudinary';

export const createOrUpdateNeetYear = CatchAsyncError(async (req, res, next) => {
  const { year, files } = req.body;
  if (!year) return next(new ErrorHandler('Year is required', 400));

  let processedFiles = [];
  if (files && files.length > 0) {
    for (const f of files) {
      if (f.fileUrl && f.fileUrl.startsWith('data:')) {
        const isImage = f.fileUrl.startsWith('data:image/');

        // Extract mime type and extension from data URI
        let formatExt = undefined;
        const mimeMatch = f.fileUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);/);
        if (mimeMatch && mimeMatch[1]) {
          const mimeType = mimeMatch[1];
          if (mimeType === 'application/pdf') formatExt = 'pdf';
          else if (mimeType === 'application/msword') formatExt = 'doc';
          else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') formatExt = 'docx';
          else if (mimeType === 'application/vnd.ms-excel') formatExt = 'xls';
          else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') formatExt = 'xlsx';
          else if (mimeType === 'application/vnd.ms-powerpoint') formatExt = 'ppt';
          else if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') formatExt = 'pptx';
          else if (mimeType === 'text/plain') formatExt = 'txt';
          else if (mimeType === 'application/zip') formatExt = 'zip';
          else {
            const mimeParts = mimeType.split('/');
            if (mimeParts.length === 2) {
              formatExt = mimeParts[1];
              if (formatExt === 'jpeg') formatExt = 'jpg';
            }
          }
        }

        const uploadOptions = {
          folder: 'neet',
          resource_type: isImage ? 'image' : 'raw'
        };
        if (formatExt) {
          uploadOptions.format = formatExt;
        }

        const myCloud = await cloudinary.v2.uploader.upload(f.fileUrl, uploadOptions);
        processedFiles.push({ title: f.title, subject: f.subject || 'General', fileUrl: myCloud.secure_url });
      } else {
        processedFiles.push(f);
      }
    }
  }

  let neet = await NeetModel.findOne({ year });
  if (neet) {
    if (processedFiles.length > 0) {
      neet.files.push(...processedFiles);
    }
    await neet.save();
  } else {
    neet = await NeetModel.create({ year, files: processedFiles });
  }
  res.status(200).json({ success: true, neet });
});

export const getAllNeetYears = CatchAsyncError(async (req, res, next) => {
  const neets = await NeetModel.find().sort({ year: -1 });
  res.status(200).json({ success: true, neets });
});

export const deleteNeetFile = CatchAsyncError(async (req, res, next) => {
  const { yearId, fileId } = req.params;
  const neet = await NeetModel.findById(yearId);
  if (!neet) return next(new ErrorHandler('Year not found', 404));

  neet.files = neet.files.filter(file => file._id.toString() !== fileId);
  await neet.save();
  res.status(200).json({ success: true, neet });
});

export const deleteNeetYear = CatchAsyncError(async (req, res, next) => {
  const { yearId } = req.params;
  const neet = await NeetModel.findByIdAndDelete(yearId);
  if (!neet) return next(new ErrorHandler('Year not found', 404));
  res.status(200).json({ success: true, message: 'Year deleted successfully' });
});
