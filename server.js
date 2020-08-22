const Eris                        = require("eris"),
      tokens      = require("./tokens.js"),
      SPAM                        = require("./spam.js"),
      {serverID, owners, Prefix}  = require("./config.json");

var i = 1;
for (const token of tokens) {
  const client = new Eris(token);
  const prefix = `${Prefix}${i}`;
  i++;
  client.on("ready", () => {
      console.log(`${client.user.username} | ( PREFIX: ${prefix} )`);
      const guild = client.guilds.get(serverID);
      setInterval(async () => {
        try {
          const channel = await guild.channels.random();
          channel
            .createMessage(`${SPAM[Math.floor(Math.random() * SPAM.length)]}`)
            .then(m =>console.log(`A new message has been sent to: ${m.channel.name}`));
        } catch {}
      }, 60000);
    }).on("messageCreate", (message) => {
      if (!message.channel.guild) return;
      if (!owners.includes(message.author.id)) return;
      if (new RegExp(`^(<@!?${client.user.id}>)\\s*`).test(message.content))return message.channel.createMessage(`My Prefix is ${prefix}`);
      if (!message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
      if (command == "say")return message
        .channel
        .createMessage(args[0] ? args.join(" ") : "Empty message.").catch(console.error);
    }).connect();
}
