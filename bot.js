var program = require('commander'),
	Bot = require('./lib/bot'),
	Game = require('./handlers/game'),
	Stocks = require('./handlers/stocks'),
	Beer = require('./handlers/beer'),
	Lists = require('./handlers/lists'),
	Image_Search = require('./handlers/image-search'),
	Help = require('./handlers/help'),
	Reminder = require('./handlers/event_reminder'),
	Weather = require('./handlers/weather'),
	Translator = require('./handlers/translator');

program
	.option('-u, --user <user>', 'User')
	.option('-p, --password <password>', 'Password')
	.parse(process.argv);

var bot = new Bot({
	host: 'glip.com',
	port: 443,
	user: program.user || process.env.GLIP_USER,
	password: program.password || process.env.GLIP_USER_PASS
});
// bot.use(Weather);
bot.use(Stocks);
// bot.use(Beer);
// bot.use(Lists, { path: './lists/' });
bot.use(Help);
bot.use(Game);
// bot.use(Reminder);
// bot.use(Image_Search);
// bot.use(Translator);
bot.start();
