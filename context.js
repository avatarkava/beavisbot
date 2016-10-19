module.exports = function (options) {

    PlugAPI = require('plugapi');
    Promise = require('bluebird');

    bot = options.bot;
    config = options.config;
    fs = require('fs');

    Cleverbot = require('cleverbot-node');
    cleverbot = new Cleverbot;

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
    responses = [];

    PERMISSIONS = {
        NONE: 0,
        RDJ: 1,
        RDJ_PLUS: 1.5,
        BOUNCER: 2,
        BOUNCER_PLUS: 2.5,
        MANAGER: 3,
        COHOST: 4,
        HOST: 5
    };

    uptime = new Date();
    lastRpcMessage = new Date();

    settings = {
        autoskip: false,
        timeguard: false,
        maxdctime: 15 * 60,
        maxsonglength: config.queue.maxSongLengthSecs,
        maxdjidletime: config.queue.djIdleAfterMins * 60,
        djidle: false,
        djidleminqueue: config.queue.djIdleMinQueueLengthToEnforce,
        djcyclemaxqueue: config.queue.djCycleMaxQueueLength,
        lockdown: false,
        cleverbot: false,
        rdjplus: false,
        bouncerplus: false
    };
    setting_names = {
        'autoskip': 'Autoskip',
        'timeguard': 'Timeguard',
        'maxdctime': 'DC Protection Time',
        'maxsonglength': 'Max Song Length',
        'maxdjidletime': 'Max DJ Idle Time',
        'djidleminqueue': 'DJ Idle Min Queue',
        'djcyclemaxqueue': 'DJ Cycle Max Queue',
        'lockdown': 'Lockdown Mode',
        'cleverbot': 'Cleverbot',
        'rdjplus': 'RDJ+ Mode',
        'bouncerplus': 'Bouncer+ Mode',
    };

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

    // Case-insensitive search for user
    findUserInList = function (list, username) {
        var lowerUser = username.toLowerCase();
        return _.find(list, function (term) {
            return term.username.toLowerCase() == lowerUser;
        });
    }

    getDbUserFromSiteUser = function (siteUser, callback) {
        models.User.find({
            where: {site_id: siteUser.id.toString(), site: config.site}
        }).then(function (row) {
            callback(row);
        });
    };

    getDbUserFromUsername = function (siteUsername, callback) {
        models.User.find({
            where: {username: siteUsername, site: config.site}
        }).then(function (row) {
            callback(row);
        });
    };

    getActiveDJs = function (maxIdleMins, startPosition, callback) {
        var activeUsers = [];
        if (startPosition === undefined) {
            startPosition = 0;
        }

        Promise.map(_.rest(bot.getDJs(), startPosition), function (dj) {
            return models.User.find({where: {site_id: dj.id, site: config.site}}).then(function (dbUser) {
                if (dbUser !== null && dbUser.site_id !== bot.getSelf().id) {
                    if (secondsSince(dbUser.last_active) <= (maxIdleMins * 60)) {
                        activeUsers.push(dbUser);
                    }
                }
            });
        }).then(function () {
            callback(activeUsers);
        });
    };

    transferCustomPoints = function (fromUser, toUser, points) {

        // Create them out of thin air!
        if (fromUser === null) {
            fromUser = bot.getSelf();

            models.User.update({custom_points: Sequelize.literal('(custom_points + ' + points + ')')}, {where: {site_id: toUser.id.toString()}});
            console.log('[GIFT] ' + fromUser.username + ' awarded ' + points + ' points to ' + toUser.username);
            bot.sendChat(':gift: ' + fromUser.username + ' awarded ' + points + ' ' + config.customPointName + ' to @' +
                toUser.username);

            return;
        }
        else {
            getDbUserFromSiteUser(fromUser, function (row) {
                if (!row || row.custom_points < points) {
                    console.log('Gift failed');
                    return false;
                }

                // Deduct the points from the sender's balance and add to the recipient
                models.User.update({custom_points: Sequelize.literal('(custom_points - ' + points + ')')}, {where: {site_id: fromUser.id.toString()}});
                models.User.update({custom_points: Sequelize.literal('(custom_points + ' + points + ')')}, {where: {site_id: toUser.id.toString()}});

                console.log('[GIFT] ' + fromUser.username + ' gave ' + points + ' points to ' + toUser.username);
                bot.sendChat(':gift: @' + fromUser.username + ' gave ' + points + ' ' + config.customPointName + ' to @' +
                    toUser.username + ' :gift:');

            });
        }
    };

    sendToSlack = function (message) {

        if (message == '' || config.slack.webhook_url == null) {
            return false;
        }

        var formPayload = {
            text: message,
            username: bot.getSelf().username,
            link_names: 1,
            channel: config.slack.default.channel,
            icon_url: config.slack.default.icon_url
        }

        formPayload = JSON.stringify(formPayload);

        request.post(config.slack.webhook_url, {form: {payload: formPayload}}, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                if (body == 'ok') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                console.log(error);
                return false;
            }
        });
    }

    hasPermission = function (user, minRole) {

        if (user.role == PlugAPI.ROOM_ROLE.RESIDENTDJ) {
            return (user.role >= minRole || (minRole == PERMISSIONS.RDJ_PLUS && settings['rdjplus']));
        } else if (user.role == PlugAPI.ROOM_ROLE.BOUNCER) {
            return (user.role >= minRole || (minRole == PERMISSIONS.BOUNCER_PLUS && settings['bouncerplus']));
        }

        return user.role >= minRole;
    };

    loadCommands = function () {
        commands.length = 0;
        commands = [];

        // Load commands
        try {
            fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(function (file) {
                var command = require(path.resolve(__dirname, 'commands/' + file));

                command.lastRun = 0;
                command.lastRunUsers = {};

                if (command.minRole === undefined) {
                    command.minRole = PERMISSIONS.NONE;
                }
                commands.push(command);
            });
        } catch (e) {
            console.error('Unable to load command: ', e);
        }
    };

    loadResponses = function () {
        // @TODO: Load chat responses from the bot to prevent roundtrips to the DB we don't need
    };


};
