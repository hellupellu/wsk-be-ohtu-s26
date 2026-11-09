import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(
    'Tässä välissä älä tee muuta kuin tallenna thumbnail ja sitten next (async / await)'
  );
  console.log(req.file.path);

  try {
    await sharp(req.file.path)
      .resize(160, 160)
      .png()
      .toFile(`${req.file.path}_thumb`);

    next();
  } catch (error) {
    next(error);
  }
};

export {createThumbnail};
