var _ = require('underscore'),
	fs = require('fs'),
	jsonfile = require('jsonfile'),
	fast_bindall = require('fast_bindall');

var file = process.env.HOME + '/play_game_db.json';
var numbers = '0123456789';

var Game = function(options) {
	_.extend(this, options);
	fast_bindall(this);
	if (!this.bot) {
		throw "Handler requires bot";
	}
	this.bot.on('message', this.handle_message);
};

_.extend(Game.prototype, {
	name: 'I wanna play a game',
	Game_text: 'Description...',
	handle_message: function(type, data) {
		if (type === this.bot.type_ids.TYPE_ID_POST && data.text && !data.deactivated) {
			var text = data.text.toLowerCase();
			var user = this.getUser( data.creator_id );

			var test = text.match(/.*i\s+want\s+to\s+play\s+a\s+game\s*$/i);
			if (test && test.length > 0) {
				if( user.currentGame ) {
					this.bot.post(data.group_id, 'Once you started a game, you can\'t quit!');
				} else {
					this.newGame(user.id);
					this.bot.post(data.group_id, 'Live or die...make your choice.');
				}

				return;
			}

			var test = text.match(/^\s*([0-9]{5})\s*$/);
			console.log(test);
			if (test && test[1]) {
				this.bot.post(data.group_id, `You answered ${test[1]}`);
			}

		}
	},

	initDb: function() {
		console.log('init db');
		fs.closeSync(fs.openSync(file, 'w'));
		jsonfile.writeFileSync(file, {initAt: Date.now(), users: {}, games: []});
	},

	getDb: function(){
		try {
			return jsonfile.readFileSync(file);
		} catch(e) {
			console.error('read db fail', e);
			this.initDb();
			return this.getDb();
		}
	},

	setDb: function( data ){
		try {
			jsonfile.writeFileSync(file, data);
		} catch(e) {
			console.error('write db fail', e);
		}
	},

	getUser: function( userId ) {
		var user = this.getDb().users[ userId ];
		if( !user ) {
			return user;
		} else {
			this.addUser( userId );
			return this.getUser();
		}
	},

	addUser: function( userId ) {
		var data = this.getDb();
		data.users[userId] = { join: Date.now(), id: userId, playHistory: [] };
		this.setDb(data);
	},

	newGame: function( userId ) {
		var data = this.getDb();
		var game = {
			user: user.id,
			answer: _.chain( numbers ).shuffle().slice(0, 5).value().join(''),
			history: []
		};
		data.games.push(game);
		data[user.id].currentGame = data.games.length - 1;

		this.setDb( data );
	},

	queryUser: function(userId){
		this.bot.request( '/api/person/' + userId, 'GET', {}, function( err, data ){
			console.log('yoyoyo', JSON.stringify(arguments));
		});
	}
});


module.exports = Game;
