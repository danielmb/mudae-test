const Discord = require('discord-user-bots');
const eventEmitter = require('events');
require('dotenv').config();
const client = new Discord.Client(process.env.DISCORD_TOKEN);
const event = new eventEmitter();
client.on.ready = function () {
  console.log('Client online!');
};
let mainChannel = '1075464898097713262';
let messageChannel = '1041468355007238236';
let botId = '432610292342587392';
client.on.message_create = function (message) {
  if (message.channel_id === mainChannel) handleMudae(message);
  if (message.channel_id === messageChannel) handleMessages(message);
  // client.send(messageChannel, message.content);
};

let handleMudae = async function (message) {
  if (message.author.id !== botId) return;

  if (!message.embeds || message.embeds.length === 0) return;
  let embed = message.embeds[0];
  if (!embed.author || !embed.author.name) return;
  let name = embed.author.name;
  let msg = await client.send(messageChannel, {
    content: `$im ${name}`,
  });
  response = await new Promise((resolve) => {
    event.once(name, resolve);
  });
  console.log(response.claimRank);
  if (response.claimRank > 400) return;
  let reaction = await client.add_reaction(
    message.id,
    message.channel_id,
    '👍',
  );
  console.log(reaction);
};

let handleMessages = function (message) {
  if (message.author.id !== botId) return;
  if (!message.embeds || message.embeds.length === 0) return;
  let embed = message.embeds[0];
  if (!embed.author || !embed.author.name) return;
  let name = embed.author.name;
  let desc = embed.description.split('\n');
  let claimRank = desc.find((x) => x.startsWith('Claim Rank:'));
  let likeRank = desc.find((x) => x.startsWith('Like Rank:'));
  const digits = /\d+/g;
  if (!claimRank || !likeRank) return;
  claimRank = Number(claimRank.match(digits));
  likeRank = Number(likeRank.match(digits));
  console.log(message.id, claimRank, likeRank);
  event.emit(name, { claimRank, likeRank });
};
