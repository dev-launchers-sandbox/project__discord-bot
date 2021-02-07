module.exports = class {
    constructor() {
        const db = require("quick.db");
        // * this.asyncBugDelay may be needed to be modified if deployed in an area with high ping.
        this.tempChannel, this.asyncBugDelay = 500; // ms
        this.db = new db.table("chess");
        this.event;
        this.squares = {
            DARK: "#e8ebef",
            LIGHT: "#7d8796",
        };
    }

    // The following methods are helper methods.
    createGameObject(args, id) {
        let players = [args[0], args[1]];
        return {
            players: players,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            turns: {
                'w': players[0],
                'b': players[1]
            },
            channel: id,
        };
    }

    createGameChannel(client, message, players) {
        let guild = message.guild;
        guild.channels.create(`chess-${client.users.cache.get(players[0]).username.toLowerCase()}-vs-${client.users.cache.get(players[1]).username.toLowerCase()}`).then(c => {
            c.setTopic('!move <move>');
            this.tempChannel = c;
        });
    }

    getChannel(message, id) {
        let games = this.getGames();
        const playerID = id;
        const indexOfPlayerID = games.findIndex(game => { return game.players.includes(playerID); });

        if (indexOfPlayerID === -1) return false;

        let channel = message.guild.channels.cache.find(c => {
            // console.log(c.id, c.name, games[indexOfPlayerID].channel)
            return c.id == games[indexOfPlayerID].channel;
        });

        return channel;
    }

    getBoardImage(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        const { createCanvas, Image } = require("canvas");
        const coords = require("../assets/coords.json");
        const fs = require('fs');

        const { Chess } = require('chess.js');
        let game = new Chess(fen);

        let shiftX = 50,
            shiftY = 60;

        let canvas = createCanvas(400 + (shiftX * 2), 400 + (shiftY * 2));
        let ctx = canvas.getContext("2d");


        let chunked = this.chunk(coords, 8); // This converts the coordinates into a 2D array

        // Render the checkerboard
        for (let i = 0; i < chunked.length; i++) {
            let row = chunked[i];
            for (let j = 0; j < row.length; j++) {
                (i + j) % 2 == 0 ?
                    (ctx.fillStyle = this.squares.DARK) :
                    (ctx.fillStyle = this.squares.LIGHT);
                ctx.fillRect(row[j][0] + shiftX, row[j][1] + shiftY, 50, 50);
            }
        }

        let board = game.board().flat();

        // Render pieces dynamically
        for (let i = 0; i < coords.length; i++) {
            if (!board[i]) {
                continue;
            } else {
                let data = fs.readFileSync(`./src/extensions/Chess/assets/pieces/${board[i].color}${board[i].type.toUpperCase()}.png`);
                let img = new Image;
                img.src = data;

                ctx.drawImage(img, coords[i][0] + shiftX, coords[i][1] + shiftY, 50, 50);
            }
        }

        // TODO: Clean up this section of the code, it's very messy
        // Add grid letters and numbers a-h, 1-8
        for (let i = 0; i < coords.length; i++) {
            ctx.font = '600 20pt Menlo';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';

            ctx.fillText('8', 30, 90);
            ctx.fillText('7', 30, 140);
            ctx.fillText('6', 30, 190);
            ctx.fillText('5', 30, 240);
            ctx.fillText('4', 30, 290);
            ctx.fillText('3', 30, 340);
            ctx.fillText('2', 30, 390);
            ctx.fillText('1', 30, 440);

            ctx.fillText('a', 75, 50);
            ctx.fillText('b', 125, 50);
            ctx.fillText('c', 175, 50);
            ctx.fillText('d', 225, 50);
            ctx.fillText('e', 275, 50);
            ctx.fillText('f', 325, 50);
            ctx.fillText('g', 375, 50);
            ctx.fillText('h', 425, 50);
        }

        return canvas.toBuffer("image/png");
    }

    // Taken from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
    chunk(input, size) {
        return input.reduce((arr, item, idx) => {
            return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
        }, []);
    }

    // The following methods are just wrappers around database functionality.
    createGame(players, channelID) {
        let games = this.getGames();
        games.push(this.createGameObject(players, channelID));

        this.db.set("games", games);
    }

    removeGame(message, id) {
        let games = this.getGames();
        const playerID = id;
        const indexOfPlayerID = games.findIndex(game => { return game.players.includes(playerID); });

        if (indexOfPlayerID === -1) return false;

        let channel = message.guild.channels.cache.find(c => c.id == games[indexOfPlayerID].channel);

        channel.delete('Chess game aborted.');

        games[indexOfPlayerID] = undefined;
        games = games.filter(e => { return e; });

        this.db.set("games", games);
    }

    getGame(id) {
        const games = this.getGames();
        const playerID = id;
        const indexOfPlayerID = games.findIndex(game => { return game.players.includes(playerID); });

        if (indexOfPlayerID === -1) return false;

        return games[indexOfPlayerID];
    }

    setGame(id, fen, c) {
        const games = this.getGames();
        const indexOfPlayerID = games.findIndex(game => { return game.players.includes(id); });

        if (indexOfPlayerID === -1) return false;

        fen ? games[indexOfPlayerID].fen = fen : '';

        this.db.set("games", games);
    }

    getGames() {
        return this.db.get("games") || []; // Implementing null-safety
    }

    // The following functions are higher level functions used in commands.
    challenge(client, message, players) {
        if (!this.getGame(message.author.id)) {
            this.createGameChannel(client, message, players);
            setTimeout(() => {
                const { MessageEmbed } = require('discord.js');
                const fs = require('fs');

                this.createGame(players, this.tempChannel.id);

                fs.writeFileSync('./board.png', this.getBoardImage(this.getGame(message.author.id).fen));

                let boardEmbed = new MessageEmbed()
                    .setTitle(`**${client.users.cache.get(this.getGame(message.author.id).players[0]).username} vs. ${client.users.cache.get(this.getGame(message.author.id).players[1]).username}**`)
                    .setColor(0xff9f01)
                    .attachFiles(['./board.png'])
                    .setImage('attachment://board.png')
                    .setFooter('Rook: R, King: K, Knight: N, Bishop: B\nQueen: Q, Capture: x, Check: +, Example: Qxe7+');

                this.tempChannel.send(boardEmbed);

                message.reply(`I have created a game channel in <#${this.tempChannel.id}>`);
            }, this.asyncBugDelay);
        } else {
            message.reply("you're already in a game.");
        }
    }

    abort(message) {
        if (this.removeGame(message, message.author.id) === false) {
            return message.reply("you're not in a game.");
        } else {
            return message.reply("I have aborted the game and deleted the channel.");
        }
    }

    move(client, message, move) {
        if (!this.getGame(message.author.id)) {
            return message.reply("you're not in a game.")
        } else {
            const { Chess } = require('chess.js');
            const game = this.getGame(message.author.id);
            let chessGame = new Chess(game.fen);

            if (message.author.id != game.turns[chessGame.turn()]) {
                return message.reply("it's not your turn.");
            } else {
                if (chessGame.moves().indexOf(move) === -1) {
                    message.delete();
                    message.reply("that isn't a valid move.").then(msg => {
                        msg.delete({ timeout: 5000 });
                    });
                } else {
                    const { MessageEmbed } = require('discord.js');
                    const fs = require('fs');

                    chessGame.move(move);

                    if (chessGame.game_over()) {
                        this.event = (`**${chessGame.turn() === 'w' ? client.users.cache.get(game.players[1]).username + ' (Black)': client.users.cache.get(game.players[0]).username + ' (White)'}:** I move *${move}* with checkmate.`);
                    } else if (chessGame.in_check()) {
                        this.event = (`**${chessGame.turn() === 'w' ? client.users.cache.get(game.players[1]).username + ' (Black)': client.users.cache.get(game.players[0]).username + ' (White)'}**: I move *${move}* with check.`);
                    } else if (chessGame.insufficient_material()) {
                        this.event = (`**${chessGame.turn() === 'w' ? client.users.cache.get(game.players[1]).username + ' (Black)': client.users.cache.get(game.players[0]).username + ' (White)'}**: I move *${move}* with draw due to insufficient material.`);
                    } else if (chessGame.in_threefold_repetition()) {
                        this.event = (`**${chessGame.turn() === 'w' ? client.users.cache.get(game.players[1]).username + ' (Black)': client.users.cache.get(game.players[0]).username + ' (White)'}**: I move *${move}* with draw due to threefold-repetition.`);
                    } else if (chessGame.in_draw()) {
                        this.event = (`**${chessGame.turn() === 'w' ? client.users.cache.get(game.players[1]).username + ' (Black)': client.users.cache.get(game.players[0]).username + ' (White)'}**:** I move *${move}* with draw due to the 50-move-rule.`);
                    } else if (chessGame.in_stalemate()) {
                        this.event = (`**${move} with stalemate.`);
                    } else {
                        this.event = (`**${chessGame.turn() === 'w' ? client.users.cache.get(game.players[1]).username + ' (Black)': client.users.cache.get(game.players[0]).username + ' (White)'}**: I move *${move}*.`);
                    }

                    this.setGame(message.author.id, chessGame.fen(), message.id);
                    fs.writeFileSync('./board.png', this.getBoardImage(this.getGame(message.author.id).fen));

                    let channel = this.getChannel(message, message.author.id);
                    let boardEmbed = new MessageEmbed()
                        .setTitle(`**${client.users.cache.get(this.getGame(message.author.id).players[0]).username} vs. ${client.users.cache.get(this.getGame(message.author.id).players[1]).username}**`)
                        .addField("**Game Log:**", this.event)
                        .setColor(0xff9f01)
                        .attachFiles(['./board.png'])
                        .setImage('attachment://board.png')
                        // .setFooter('<:wR:807077835675402261>: R, <:wK:807077836023791656>: K, <:wN:807077835910283295>: N, <:wB:807077836011470868>: B, <:wQ:807077836040044584>: Q');
                        .setFooter('Rook: R, King: K, Knight: N, Bishop: B\nQueen: Q, Capture: x, Check: +, Example: Qxe7+');

                    channel.bulkDelete(100);

                    channel.send(boardEmbed);
                }
            }
        }
    }

    resign(message) {}

    listGames(message) {
        const { MessageEmbed } = require('discord.js');
        let games = this.getGames();
        let embed = new MessageEmbed()
            .setColor(0xff9f01)
            .setTitle("Current Games");

        for (let i = 0; i < games.length || 0; i++) {
            embed.addField(`**Game ${i + 1}**`, `<@${games[i].players[0]}> vs. <@${games[i].players[1]}> (${games[i].winner || "In Progress"})`);
        }

        message.channel.send(embed);
    }
};