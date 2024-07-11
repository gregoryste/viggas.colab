const sharp = require('sharp');

async function convertPngToWebp(file, quality = 75) {
    try {
        if (!file || file.originalname == "") {
            return file;
        }

        const webpBuffer = await sharp(file.buffer).webp({ quality: quality, progressive: true}).toBuffer();
        file.buffer = webpBuffer;
        file.mimetype = 'image/webp';

        return file;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
}

module.exports = convertPngToWebp
