const path = require("path");
require("dotenv").config();
const imgURL = process.env.IMG_URL;
const uploadSingleFile = async (fileObject) => {
  const uploadPath = path.resolve(__dirname, "../public/images/upload");
  let extName = path.extname(fileObject.name);
  let baseName = path.basename(fileObject.name, extName);
  let fileName = `${baseName}-${Date.now()}${extName}`;
  let finalPath = `${uploadPath}/${fileName}`;
  try {
    await fileObject.mv(finalPath);
    return {
      status: "success",
      path: imgURL + fileName,
      error: null,
    };
  } catch (err) {
    return {
      status: "failed",
      path: null,
      error: JSON.stringify(err),
    };
  }
};
const uploadMultiFiles = async (file) => {
  const uploadPath = path.resolve(__dirname, "../public/images/upload");

  let resultArr = [];
  let countSuccess = 0;
  for (let i = 0; i < file.length; i++) {
    // console.log(">>> check file's detail",file[i]);
    let extName = path.extname(file[i].name);
    let baseName = path.basename(file[i].name, extName);
    if([".jpg",".jpeg",".png",'.webp'].includes(extName)){
      
    }
    let fileName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${fileName}`;
    try {
      await file[i].mv(finalPath);
      resultArr.push({
        status: "success",
        path: imgURL + fileName,
        error: null,
      });
    } catch (err) {
      resultArr.push({
        status: "failed",
        path: fileName,
        error: JSON.stringify(err),
      });
    }
  }
  return {
    countSuccess: countSuccess,
    resultArr,
  };
};
module.exports = {
  uploadSingleFile,
  uploadMultiFiles,
};
