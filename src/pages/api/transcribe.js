import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

// Get the system temporary directory dynamically
const tempDir = os.tmpdir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Save files to the system's temporary directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Wrap multer middleware to make it compatible with Next.js
const uploadMiddleware = upload.single("audio");

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser for file uploads
  },
};

const possibleSampleRates = [16000, 48000, 44100, 32000];

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, uploadMiddleware);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const filePath = file.path;
    const fileType = file.mimetype;

    const encoding =
      fileType === "audio/wav" ? "LINEAR16" :
      fileType === "audio/mpeg" || fileType === "audio/mp3" ? "MP3" :
      fileType === "audio/webm" ? "WEBM_OPUS" :
      null;

    if (!encoding) {
      return res.status(400).json({ 
        error: "Unsupported audio format", 
        fileType: fileType 
      });
    }

    const audioContent = fs.readFileSync(filePath, { encoding: "base64" });

    // Try transcription with different sample rates
    for (const sampleRate of possibleSampleRates) {
      try {
        const requestBody = {
          config: {
            encoding,
            sampleRateHertz: sampleRate,
            languageCode: "en-US",
          },
          audio: {
            content: audioContent,
          },
        };

        const response = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`Attempt with ${sampleRate} Hz failed:`, errorData);
          continue; // Try next sample rate
        }

        const data = await response.json();
        const transcription = data.results
          ?.map((result) => result.alternatives?.[0]?.transcript)
          .join("\n");

        // If transcription is successful, return it
        if (transcription) {
          // Cleanup: Delete temporary file after processing
          fs.unlinkSync(filePath);

          return res.status(200).json({ 
            transcription,
            sampleRate: sampleRate // Optional: return which sample rate worked
          });
        }
      } catch (rateError) {
        console.log(`Error with sample rate ${sampleRate}:`, rateError);
        continue;
      }
    }

    // If no sample rate worked
    return res.status(400).json({ 
      error: "Could not transcribe audio with any sample rate" 
    });

  } catch (error) {
    console.error("Error during transcription:", error);
    return res.status(500).json({
      error: "An unexpected error occurred during transcription",
      details: error.message
    });
  }
}

export default handler;
