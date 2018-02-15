const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');
const AwardService = require('./services/award-service');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const playersObserved = [
    '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
  ];
  CONST.setPlayersBeingObserved(playersObserved.length);
  const chanel = client.channels.find('type', 'text');
  NominationService.observe(playersObserved).subscribe(playerScores => {
   const claimedNominations = AwardService.getNominationsWinners(playerScores);
   AwardService.generateMessages(claimedNominations).subscribe(message => chanel.send('', getRichEmbed(message)));
  });
});

function getRichEmbed(winnerMessage) {
  const richEmbed = new Discord.RichEmbed();
  richEmbed.setTitle(winnerMessage.title);
  richEmbed.setDescription(winnerMessage.description);
  richEmbed.setImage(winnerMessage.avatarUrl);
  richEmbed.setFooter(winnerMessage.footer);
  return richEmbed;
}

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(authentication.testbot);