import "dotenv/config";
import express, { json } from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { DiscordRequest, VerifyDiscordRequest } from "./utils.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "hello world ",
        },
      });
    }
    if (name === "send") {
      try {
        const userId = req.body.member.user.id;
        getDMChannel(userId).then(async channel => {
          console.log(channel);
          await sendMessage(channel.id, "Hello World !");
          console.log(res);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              // Fetches a random emoji to send from a helper function
              content: "hello world ",
            },
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
});

async function fetchUser(userId) {
  const endpoint = "users/" + userId;

  let response = await DiscordRequest(endpoint, {
    method: "GET",
  });
  return await response.json();
}

async function getDMChannel(userId){
  const endpoint = "users/@me/channels";
  let response = await DiscordRequest(endpoint, {
    method: "POST",
    json: {
      recipient_id: userId
    }
  });
  return await response.json
}

async function sendMessage(channelId, message) {
  let endpoint = '/channels/' + channelId + '/messages';
  await DiscordRequest(endpoint, {
    method: "POST",
    json: {
      content: message
    }
  });
}

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
