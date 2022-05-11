import { Telegraf } from 'telegraf';
import Discord from 'discord.js';
import fs from 'fs';
import yaml from 'js-yaml';

const credentialsPath = './credentials.yaml'
const configPath = './config.yaml';

const credentialsRaw = fs.readFileSync(credentialsPath);
const credentials = yaml.load(credentialsRaw);

const configRaw = await fs.readFileSync(configPath);
const config = yaml.load(configRaw);

const telegramToken = credentials.telegram;
const discordToken = credentials.discord;

const telegram = new Telegraf(telegramToken);
const discord = new Discord.Client({ intents: [
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
] });

const publicCommandPrefix = config.public_command_prefix;
const commands= config.commands;
const trackedTelegramChannelId = config.telegram_channel_id;
const trackedDiscordChannelId = config.discord_channel_id;

//  commands definition
telegram.start(ctx => ctx.reply(commands.start));
telegram.help(ctx => ctx.reply(commands.help));

telegram.on('message', ctx => {
  const channelId = ctx.update.message.chat.id;
  const command = ctx.update.message.text;
  const isCommandFound = command in commands.private;
  if(isCommandFound){
    ctx.telegram.sendMessage(channelId, commands.private[command]);
  }
});

telegram.on('channel_post', ctx => {
  const channelId = ctx.update.channel_post.chat.id;
  const input = ctx.update.channel_post.text;
  const isCommand = input.charAt(0) === publicCommandPrefix;
  const command = input.slice(1);
  const isCommandFound = command in commands.public;
  if(isCommand && isCommandFound){
    ctx.telegram.sendMessage(channelId, commands.public[command]);
  }
});

discord.on('messageCreate', msg => {
  const currentDiscordChannelId = msg.channelId;
  const isTrackedChannel = currentDiscordChannelId == trackedDiscordChannelId;
  if(isTrackedChannel)
    telegram.telegram.sendMessage(trackedTelegramChannelId, msg.content)
});

//  initialization
telegram.launch();
discord.login(discordToken);

//  finalization
process.once('SIGINT', () => telegram.stop('SIGINT') && discord.destroy());
process.once('SIGTERM', () => telegram.stop('SIGTERM') && discord.destroy());
