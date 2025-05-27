const {
  AllVisits,
  AddVisit,
  UpdateVisit,
  DeleteVisit,
  AddVisitImages,
  UpdateVisitImages,
  getVisitsByID,
  removeVisit,
  uploadVisitFile,
  addNewVisit,
  removeVisitFile,
  setTimeIn,
  setTimeOut,
  getTimeData,
  setTravelTimeIn,
  setReturnTravelTimeIn,
  setReturnTravelTimeOut,
  setTravelTimeOut,
  sendSummeryReport,
  getVisitsByUserID,
  visitPagination,
  filterVisits,
  setTotalAmount,
  AddVisitFinancials,
  GetVisitFinancials,
  getVisitsByAdmin,
  calculateTotalAmount,
  getVisitsByTicket,
  checkSheduledVisits,
  undoDeleteVisit,
  getAdditionalPictures,
  removeVisitAdditionalFile,
  resetTimes,
  addWeather,
  getWeather,
} = require("../services/visits.services");
const { responseFormat } = require("../utils/utils");
var path = require("path"),
  fs = require("fs");
// const { createCanvas, loadImage, registerFont } = require("canvas");
const ExifReader = require("exifreader");
const { promisify } = require("util");
const { date } = require("joi");
const sharp = require("sharp");

async function summeryReportSend(req, res, next) {
  try {
    const result = await sendSummeryReport(req.params?.id, req.body);
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while sending summary report"
        )
      );
    next(error);
  }
}
async function captureTravelTimeIn(req, res, next) {
  try {
    const result = await setTravelTimeIn(req.body, req.params.id, req.user);
    res.json(responseFormat(true, result, "Visit updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit"
        )
      );
    next(error);
  }
}

async function captureTravelTimeOut(req, res, next) {
  try {
    const result = await setTravelTimeOut(req.body, req.params.id, req.user);
    res.json(responseFormat(true, result, "Visit tto updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while Updating the Visit"));
    next(error);
  }
}

async function captureTimeIn(req, res, next) {
  try {
    const result = await setTimeIn(req.body, req.params.id, req.user);
    res.json(responseFormat(true, result, "Visit updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit"
        )
      );
    next(error);
  }
}

async function resetVisitTimes(req, res, next) {
  try {
    const result = await resetTimes(req.params.id, req.body, req.user);
    res.json(responseFormat(true, result, "Visit Time reseted Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit"
        )
      );
    next(error);
  }
}

async function captureTimeOut(req, res, next) {
  try {
    const result = await setTimeOut(req.body, req.params.id, req.user);
    res.json(responseFormat(true, result, "Visit updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit"
        )
      );
    next(error);
  }
}

async function captureReturnTravelTimeIn(req, res, next) {
  try {
    const result = await setReturnTravelTimeIn(
      req.body,
      req.params.id,
      req.user
    );
    res.json(responseFormat(true, result, "Visit tti updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit"
        )
      );
    next(error);
  }
}

async function captureReturnTravelTimeOut(req, res, next) {
  try {
    const result = await setReturnTravelTimeOut(
      req.body,
      req.params.id,
      req.user
    );
    res.json(responseFormat(true, result, "Visit tto updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit"
        )
      );
    next(error);
  }
}

async function allVisits(req, res, next) {
  try {
    const result = await AllVisits(req.user);
    res.json(responseFormat(true, result, "list of all visits"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting visits")
    );
    next(error);
  }
}

async function getAllTimeData(req, res, next) {
  try {
    const result = await getTimeData(req.params.id);
    res.json(responseFormat(true, result, "list of all Times"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting Times")
    );
    next(error);
  }
}

async function addVisit(req, res, next) {
  try {
    const result = await addNewVisit(req.body);
    res.json(responseFormat(true, result, "Visit Added Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while Adding The Visit")
      );
    next(error);
  }
}

async function addPicture(req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    if (
      req?.body?.visit_Pic_id != null ||
      req?.body?.visit_Pic_id != undefined
    ) {
      if (req?.body?.visit_Pic_id !== "null") {
        const result = await UpdateVisitImages(req);
      } else {
        const result = await AddVisitImages(req);
      }
    } else {
      const result = await AddVisitImages(req);
    }
    res.json(responseFormat(true, null, "picture saved Successfully"));
  }
}

async function editVisit(req, res, next) {
  try {
    const result = await UpdateVisit(req.body, req.params.id, req.user);
    res.json(responseFormat(true, result, "Visit updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while Updating the Visit"));
    next(error);
  }
}
async function GetVisitAdditionalPictures(req, res, next) {
  await getAdditionalPictures(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Visit's additional pictures"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "error while getting visit's additional pictures"
          )
        );
      next(error);
    });
}
async function visitFileUpload(req, res, next) {
  try {
    const fullFileName = fromDir(
      require("path").resolve(
        `${__dirname}../../../public/visits/${req.body.folder_ID}`
      ),
      req?.body?.name
    );
    if (fullFileName === undefined) {
      console.log(fullFileName);
    } else {
      const file = require("path").resolve(
        `${__dirname}../../../public/visits/${req.body.folder_ID}/${fullFileName}`
      );

      async function addWatermark(imagePath, outputImagePath, watermarkText) {
        // Read the image file and get its Exif data
        function readFileAsync(path) {
          return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
              if (err) reject(err);
              else resolve(data);
            });
          });
        }
        const imageBuffer = await readFileAsync(imagePath);
        const exifData = ExifReader.load(imageBuffer);

        // Determine the orientation of the image
        let orientation = 1;
        if (exifData && exifData["Orientation"]) {
          orientation = exifData["Orientation"].value;
        }
        // Load the image and create a canvas
        const image = await loadImage(imageBuffer);
        const fonts = require("path").resolve(
          `${__dirname}../../../src/assets/fonts/Roboto-Medium.ttf`
        );
        registerFont(fonts, { family: "Roboto" });
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");

        // Apply the appropriate orientation transformation

        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, image.width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, image.width, image.height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, image.height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, image.height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, image.height, image.width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, image.width);
            break;
          default:
            break;
        }

        // Draw the original image on the canvas
        ctx.drawImage(image, 0, 0);
        // Calculate the optimal font size based on the canvas size
        var idealFontSize = Math.sqrt(canvas.width * canvas.height) / 40;
        if (image.width + image.height <= 500) {
          idealFontSize = 10;
        }

        // Split the watermark text into separate lines
        const lines = watermarkText.split("\n");

        // Determine the font size and height for each line of text
        const lineHeight = Math.floor(idealFontSize * 1.2);
        const fontSizes = [];
        for (let i = 0; i < lines.length; i++) {
          let fontSize = idealFontSize;
          while (ctx.measureText(lines[i]).width > canvas.width * 0.9) {
            fontSize = Math.max(fontSize - 1, 1);
            ctx.font = `${fontSize}px Roboto Medium`;
          }
          fontSizes.push(fontSize);
        }

        // Add the text for each line
        const bottomPadding = lineHeight * 0.1; // adjust this to change the distance of the watermark from the bottom
        let y = canvas.height - bottomPadding;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < lines.length; i++) {
          const actualFontSize = fontSizes[i];
          const watermarkTextWidth = ctx.measureText(lines[i]).width;
          const rectX = canvas.width / 2 - watermarkTextWidth / 2;
          const rectY = y - Math.floor(actualFontSize * 0.8);
          const rectWidth = watermarkTextWidth;
          const rectHeight = Math.floor(actualFontSize * 1.2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

          ctx.fillStyle = "white";
          ctx.font = `${actualFontSize}px Roboto Medium`;
          ctx.fillText(lines[i], canvas.width / 2, rectY + rectHeight / 2);

          y -= lineHeight;
        }

        // Save the image with watermark to disk
        const stream = canvas?.createJPEGStream();
        const out = require("fs").createWriteStream(outputImagePath);
        stream.pipe(out);
        out.on("finish", () =>
          console.log("The image was saved with a watermark.")
        );
      }

      //const timestamp = Date?.now();
      const dateString = req.body.dateUser;

      const coordinates = req?.body?.lat_long;
      if (coordinates !== "NULL, NULL" && coordinates) {
        const [latitude, longitude] = coordinates?.split(",");

        // addWatermark(
        //   file,
        //   file,
        //   `\nlatitude:${latitude} | longitude:${longitude}\n${dateString}\n${req?.user?.first_name} ${req?.user?.last_name}\n${req?.body?.visit_code}`
        // );
      }

      // async function resizeImage(imagePath) {
      //   function readFileAsync(path) {
      //     return new Promise((resolve, reject) => {
      //       fs.readFile(path, (err, data) => {
      //         if (err) reject(err);
      //         else resolve(data);
      //       });
      //     });
      //   }
      //   const imageBuffer = await readFileAsync(imagePath);
      //   const image = await loadImage(imageBuffer);

      //   const targetWidth = 200; // Target width in pixels
      //   const targetHeight = 150;

      //   const canvas = createCanvas(targetWidth, targetHeight);
      //   const ctx = canvas.getContext("2d");
      //   ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      //   const folderPath = `public/visits-thumbnail/${req.body.folder_ID}`;
      //   fs.mkdirSync(folderPath, { recursive: true });
      //   const resizedImagePath = path.join(
      //     `public/visits-thumbnail/${req.body.folder_ID}`,
      //     fullFileName
      //   );
      //   const stream = canvas?.createJPEGStream({ quality: 0.7 });
      //   const out = require("fs").createWriteStream(resizedImagePath);
      //   stream.pipe(out);
      //   out.on("finish", () =>
      //     console.log("The image was saved with a watermark.")
      //   );
      // }

      async function resizeImage(imagePath) {
        const imageBuffer = await fs.promises.readFile(imagePath);

        const targetWidth = 200;
        const targetHeight = 150;

        const folderPath = path.join(
          "public/visits-thumbnail",
          req.body.folder_ID
        );
        const resizedImagePath = path.join(folderPath, fullFileName);

        // Create the directory if it doesn't exist
        await fs.promises.mkdir(folderPath, { recursive: true });

        await sharp(imageBuffer)
          .resize(targetWidth, targetHeight)
          .jpeg({ quality: 70 })
          .toFile(resizedImagePath)
          .then(() => {
            console.log("The image was resized and saved.");
          })
          .catch((err) => {
            console.error("An error occurred:", err);
          });
      }

      resizeImage(file);
    }
    const result = req?.body?.name + path.extname(req?.file?.originalname);
    res.json(
      responseFormat(true, result, "File Upload Completed Successfully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Visit file"
        )
      );
    next(error);
  }
}

async function visitFileDelete(req, res, next) {
  try {
    const result = await removeVisitFile(req.params.folder, req.params.file);
    res.json(responseFormat(true, result, "Visit file deleted Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Deleting the Visit"
        )
      );
    next(error);
  }
}

async function AdditionalVisitFileDelete(req, res, next) {
  try {
    const result = await removeVisitAdditionalFile(
      req.params.folder,
      req.params.file,
      req.params.id
    );
    res.json(responseFormat(true, result, "Visit file deleted Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Deleting the Visit file"
        )
      );
    next(error);
  }
}

async function getVisitByVisitID(req, res, next) {
  try {
    const result = await getVisitsByID(req?.params?.cid, req.user);
    res.json(responseFormat(true, result, "visit"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting data")
    );
    next(error);
  }
}

async function saveTotalAmount(req, res, next) {
  try {
    const result = await setTotalAmount(req?.body);
    res.json(responseFormat(true, result, "visit"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting data")
    );
    next(error);
  }
}

async function CalculateAmount(req, res, next) {
  await calculateTotalAmount(req?.params?.id)
    .then((result) => {
      res.json(responseFormat(true, result, "visit"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting data")
      );
      next(error);
    });
}

async function getAllVisitsByUserID(req, res, next) {
  try {
    const result = await getVisitsByUserID(req?.body, req?.params?.id);
    res.json(responseFormat(true, result, "visit"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting data")
    );
    next(error);
  }
}

async function CheckSheduledVisits(req, res, next) {
  checkSheduledVisits(req?.params?.ticket_id, req?.params?.scheduled_date)
    .then((result) => {
      res.json(responseFormat(true, result, "visit"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting data")
      );
      next(error);
    });
}

async function getAllVisitsForAdmin(req, res, next) {
  try {
    const result = await getVisitsByAdmin(req.user);
    res.json(responseFormat(true, result, "visit"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting data")
    );
    next(error);
  }
}

async function deleteVisit(req, res, next) {
  await removeVisit(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Visit deleted Successfully"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while Deleting the Visit"
          )
        );
      next(error);
    });
}
async function UndoDeleteVisit(req, res, next) {
  await undoDeleteVisit(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Visit deleted Successfully"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while Deleting the Visit"
          )
        );
      next(error);
    });
}

async function getFile(req, res, next) {
  try {
    const filename = req.params.filename;
    const fullFileName = fromDir(
      require("path").resolve(`${__dirname}../../../public/images/visits`),
      filename
    );
    if (fullFileName === undefined) {
      res.status(500).send("<h1>File was not uploaded</h1>");
      return;
    }
    const file = `${__dirname}../../../public/images/visits/${fullFileName}`;
    res.download(file);
  } catch (error) {
    res.status(500).json({ error: "File was not uploaded" });
  }
}

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    if (files[i].startsWith(filter)) {
      return files[i];
    }
  }
}

async function getVisitByPaging(req, res, next) {
  try {
    const result = await visitPagination(req.body?.params, req?.user);

    res.json(responseFormat(true, result, "list of visits"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

// async function FilterVisits(req, res, next) {
//   try {
//     const result = await filterVisits(req.body?.params,req?.user);
//     res.json(responseFormat(true, result, "list of all visits"));
//   } catch (error) {
//     res
//       .status(500)
//       .json(responseFormat(false, error, "error while getting the list"));
//     next(error);
//   }
// }

async function FilterVisits(req, res, next) {
  try {
    const result = await filterVisits(req.body?.params, req?.user);
    res.json(responseFormat(true, result, "list of all visits"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function GetVisitsByTicketID(req, res, next) {
  await getVisitsByTicket(req.params.id, req.user)
    .then((result) => {
      res.json(responseFormat(true, result, "List of all visits"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(false, null, "Unexpected error while getting the list")
        );
      next(error);
    });
}

async function CreateVisitFinancials(req, res, next) {
  try {
    const result = await AddVisitFinancials(req.body);
    res.json(responseFormat(true, result, "list of all visits"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function GetVisitFinancialsByVisitID(req, res, next) {
  try {
    const result = await GetVisitFinancials(req.params.id);
    res.json(responseFormat(true, result, "list of all visits financials"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}
async function AddWeather(req, res, next) {
  try {
    const result = await addWeather(
      req?.body?.visit_id,
      req?.body?.lat,
      req?.body?.long
    );
    res.json(responseFormat(true, result, "visit weather added successfully"));
  } catch (error) {
    res.status(500).json(responseFormat(false, error, "Unexpected error "));
    next(error);
  }
}
async function GetWeather(req, res, next) {
  try {
    const result = await getWeather(req?.body?.lat, req?.body?.long);
    res.json(responseFormat(true, result, "visit weather"));
  } catch (error) {
    res.status(500).json(responseFormat(false, error, "Unexpected error "));
    next(error);
  }
}

module.exports = {
  allVisits,
  addVisit,
  addPicture,
  editVisit,
  deleteVisit,
  getFile,
  getVisitByVisitID,
  visitFileUpload,
  captureTimeIn,
  visitFileDelete,
  captureTimeOut,
  getAllTimeData,
  captureTravelTimeIn,
  captureTravelTimeOut,
  captureReturnTravelTimeIn,
  captureReturnTravelTimeOut,
  summeryReportSend,
  getAllVisitsByUserID,
  getVisitByPaging,
  FilterVisits,
  saveTotalAmount,
  CreateVisitFinancials,
  GetVisitFinancialsByVisitID,
  getAllVisitsForAdmin,
  CalculateAmount,
  GetVisitsByTicketID,
  CheckSheduledVisits,
  UndoDeleteVisit,
  GetVisitAdditionalPictures,
  AdditionalVisitFileDelete,
  resetVisitTimes,
  AddWeather,
  GetWeather,
};
