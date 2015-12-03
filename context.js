module.exports = function (options) {

    //var DubAPI = require('dubapi');
    Promise = require('bluebird');

    bot = options.bot;
    config = options.config;
    fs = require('fs');

    Cleverbot = require('cleverbot-node');
    cleverbot = new Cleverbot;
    cleverbot.prepare();

    // Sequelize database ORM
    Sequelize = require('sequelize');
    models = require('./models');
    models.sequelize.sync({force: config.db.forceSequelizeSync}).then(function () {
        console.log('Connected to ' + config.db.dialect + ' database');
    });

    package = require(path.resolve(__dirname, 'package.json'));
    request = require('request');
    _ = require('underscore');
    S = require('string');
    moment = require('moment');
    CircularJSON = require('circular-json');
    commands = [];
    uptime = new Date();
    lastRpcMessage = new Date();

    iso_languages = {
        'af': 'Afrikkans',
        'ar': 'Arabic',
        'be': 'Belarusian',
        'bg': 'Bulgarian',
        'ca': 'Catalan',
        'cs': 'Czech',
        'da': 'Danish',
        'de': 'German',
        'el': 'Greek',
        'en': 'English',
        'es': 'Spanish',
        'et': 'Estonian',
        'eu': 'Basque',
        'fa': 'Farsi',
        'fi': 'Finnish',
        'fo': 'Faeroese',
        'fr': 'French',
        'ga': 'Irish',
        'gd': 'Gaelic',
        'hi': 'Hindi',
        'hr': 'Croatian',
        'hu': 'Hungarian',
        'id': 'Indonesian',
        'is': 'Icelandic',
        'it': 'Italian',
        'ja': 'Japanese',
        'ji': 'Yiddish',
        'ko': 'Korean',
        'ku': 'Kurdish',
        'lt': 'Lithuanian',
        'lv': 'Latvian',
        'mk': 'Macedonian',
        'ml': 'Malayalam',
        'ms': 'Malasian',
        'mt': 'Maltese',
        'nl': 'Dutch',
        'nb': 'Norwegian',
        'no': 'Norwegian',
        'pa': 'Punjabi',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'rm': 'Rhaeto-Romanic',
        'ro': 'Romanian',
        'ru': 'Russian',
        'sb': 'Sorbian',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'sq': 'Albanian',
        'sr': 'Serbian',
        'sv': 'Swedish',
        'th': 'Thai',
        'tn': 'Tswana',
        'tr': 'Turkish',
        'ts': 'Tsonga',
        'uk': 'Ukranian',
        'ur': 'Urdu',
        've': 'Venda',
        'vi': 'Vietnamese',
        'xh': 'Xhosa',
        'zh': 'Chinese',
        'zu': 'Zulu'
    };

    /**
     * Set default time thresholds for moment
     * (round up a little less aggressively)
     */
    moment.relativeTimeThreshold('s', 55);
    moment.relativeTimeThreshold('m', 90);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 30);
    moment.relativeTimeThreshold('M', 12);

    startupTimestamp = moment.utc().toDate();

    /**
     * Custom functions accessible to commands
     */
    timeSince = function (timestamp, suppressAgo) {
        ago = typeof suppressAgo !== 'undefined' ? suppressAgo : false;
        var message = moment.utc(timestamp).fromNow(suppressAgo);

        if (moment().isAfter(moment.utc(timestamp).add(24, 'hours'))) {
            message += ' (' + moment.utc(timestamp).calendar() + ')';
        }

        return message;
    };

    timeUntil = function (timestamp, prefixMessage) {
        var message = moment.utc(timestamp).fromNow();
        if (prefixMessage !== undefined) {
            return '(' + prefixMessage + ' ' + message + ')';
        }
        else {
            return '(' + message + ')';
        }
    };

    secondsSince = function (timestamp) {
        var now = moment.utc();
        timestamp = moment.utc(timestamp);
        return now.diff(timestamp, 'seconds');
    };

    getDbUserFromSiteUser = function (siteUser, callback) {
        models.User.find({
            where: {site_id: siteUser.id}
        }).then(function (row) {
            callback(row);
        });
    };

    getActiveDJs = function (maxIdleMins, startPosition, callback) {
        var activeUsers = [];
        if (startPosition === undefined) {
            startPosition = 0;
        }

        Promise.map(_.rest(bot.getQueue(), startPosition), function (queueItem) {
            return models.User.find({where: {site_id: queueItem.user.id}}).then(function (dbUser) {
                if (dbUser !== null && dbUser.site_id !== bot.getSelf().id) {
                    if (secondsSince(dbUser.last_active) <= (maxIdleMins * 60)) {
                        activeUsers.push(dbUser);
                    }
                }
            });
        }).then(function () {
            callback(activeUsers);
        });
    }

    transferCustomPoints = function (fromUser, toUser, points) {

        // Create them out of thin air!
        if (fromUser === null) {
            fromUser = bot.getUser();

            models.User.update({custom_points: Sequelize.literal('(custom_points + ' + points + ')')}, {where: {site_id: toUser.id}});
            console.log('[GIFT] ' + fromUser.username + ' awarded ' + points + ' points to ' + toUser.username);
            bot.sendChat(':gift: @' + fromUser.username + ' awarded ' + config.customPointName + ' ' + points + ' to @' +
                toUser.username + ' :gift:');
        }

        getDbUserFromSiteUser(fromUser, function (row) {
            if (!row || row.custom_points < points) {
                console.log('Gift failed');
                return false;
            }

            // Deduct the points from the sender's balance and add to the recipient
            models.User.update({custom_points: Sequelize.literal('(custom_points - ' + points + ')')}, {where: {site_id: fromUser.id}});
            models.User.update({custom_points: Sequelize.literal('(custom_points + ' + points + ')')}, {where: {site_id: toUser.id}});

            console.log('[GIFT] ' + fromUser.username + ' gave ' + points + ' points to ' + toUser.username);
            bot.sendChat(':gift: @' + fromUser.username + ' gave ' + config.customPointName + ' ' + points + ' to @' +
                toUser.username + ' :gift:');

        });
    }

};
