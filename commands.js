import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const SEND_COMMAND = {
  name: 'send',
  description: 'Envoyer un message',
  options: [
    {
      type: 3,
      name: 'message',
      description: 'Choississez votre message',
      required: true,
    }
  ],
  type: 1
}


const ALL_COMMANDS = [TEST_COMMAND, SEND_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);