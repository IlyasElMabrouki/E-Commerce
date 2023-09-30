import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req,saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd(), "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd(), "/public", "/images"));
  }
  
  try {
    const { files } = await readFile(req, true);
    const imageNames = Object.values(files).map(file => `/images/${file[0].newFilename}`) 
    console.log(imageNames)
    res.json({ images: imageNames });
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).json({ error: 'Error uploading the images' });
  }
};

export default handler;