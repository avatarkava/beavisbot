//@TODO - Stop using globals
module.exports = function (options) {

    _ = require('underscore');
    CircularJSON = require('circular-json');
    Cleverbot = require('cleverbot-node');
    fs = require('fs');
    moment = require('moment');
    dpath = require('path');
    Promise = require('bluebird');
    reload = require('require-reload')(require);
    request = require('request');
    S = require('string');
    Sequelize = require('sequelize');
    YouTube = require('youtube-api');


    config = options.config;
    bot = options.bot;
    models = require(dpath.resolve(__dirname, 'models/index'));

    mentions = {
        lastRunAll: 0,
        lastRunUsers: []
    };
    botUser = bot.getSelf();

    models.sequelize.sync({ force: config.db.forceSequelizeSync }).then(function () {
        console.log('Connected to ' + config.db.dialect + ' database: ' + config.db.database);
    });

    if (config.apiKeys.youtube !== undefined) {
        console.log('[YOUTUBE]', 'Authenticating with youtube...');
        var oauth = YouTube.authenticate({
            type: "key",
            key: config.apiKeys.youtube.api_key
        });
        console.log('[YOUTUBE]', 'Authenticated! ' + JSON.stringify(oauth, null, 2));
    }

    cleverbot = new Cleverbot;
    cleverbot.configure({ botapi: config.apiKeys.cleverbot })

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

    getActiveDJs = function (maxIdleMins, startPosition, callback) {
        var activeUsers = [];
        if (startPosition === undefined) {
            startPosition = 0;
        }

        Promise.map(_.rest(bot.getDJs(), startPosition), function (dj) {
            return models.User.find({ where: { site_id: dj.id, site: config.site } }).then(function (dbUser) {
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

};
