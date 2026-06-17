const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

app.post("/token", async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    const token = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        identity: participantName,
      }
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    res.json({
      token: await token.toJwt(),
    });
  } catch (e) {
    res.status(500).json({
      error: e.toString(),
    });
  }
});

app.get("/", (req, res) => {
  res.send("LiveKit Token Server Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(Server running on ${PORT});
});
