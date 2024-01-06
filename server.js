const express = require("express");
const speech = require("@google-cloud/speech");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const client = new speech.SpeechClient();

app.post("/speechText", async (req, res) => {
  console.log(req.body);
  const audioBytes = req.body.audioData; // Base64-encoded audio data from the request body
  // Decode the base64 string to a buffer
  const audioBuffer = Buffer.from(audioBytes, "base64");

  const audio = {
    content: audioBuffer,
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US", // Adjust the language code as needed
  };
  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    res.send({ text: transcription });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error converting speech to text");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
