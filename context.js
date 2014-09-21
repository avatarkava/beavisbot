module.exports = function (options) {
    var PlugAPI = require('plugapi');

    Sequelize = require('sequelize');

    bot = new PlugAPI(options.auth);
    config = options.config;
    logger = PlugAPI.getLogger('Bot');

    if (config.verboseLogging) {
        logLevel = logger.info;
    }
    else {
        logLevel = false;
    }

    if (config.db.dialect === 'sqlite') {
        sequelize = new Sequelize(null, null, null, {
            dialect: 'sqlite',
            storage: config.db.sqlite.storage,
            logging: logLevel
        });
    }
    else if (config.db.dialect === 'mysql') {
        sequelize = new Sequelize(config.db.mysql.database, config.db.mysql.username, config.db.mysql.password, {
            dialect: 'mysql',
            host: config.db.mysql.host,
            port: config.db.mysql.port,
            logging: logLevel
        });
    }

    sequelize.authenticate().complete(function (err) {
        if (err) {
            logger.error('Unable to connect to the database:', err);
        }
        else {
            logger.success('Connected to ' + config.db.dialect + ' database');
        }
    });

    /**
     * Build up the models and relations
     */
    var models = ['EventResponse', 'Karma', 'Play', 'RoomEvent', 'Song', 'SongResponse', 'User'];
    models.forEach(function (model) {
        this[model] = sequelize.import('models/' + model + '.js');
    });

    // @TODO - Is it better to declare these directly in the model?
    Song
        .hasMany(Play);
    User
        .hasMany(Karma)
        .hasMany(Karma, {foreignKey: 'mod_user_id'})
        .hasMany(Play)
        .hasMany(RoomEvent, {foreignKey: 'mod_user_id'});

    sequelize.sync()
        .success(function () {
            // @FIXME - Surely there's a more elegant way to do this, right?
            /*
             var sequelize_fixtures = require('sequelize-fixtures'),
             fixtureModels = {
             EventResponse: EventResponse,
             Karma: Karma,
             Play: Play,
             RoomEvent: RoomEvent,
             Song: Song,
             SongResponse: SongResponse,
             User: User
             };
             sequelize_fixtures.loadFile('fixtures/*.json', fixtureModels, function () {
             // doStuffAfterLoading();
             });
             */
        })
        .error(function (error) {

        });

    package = require(path.resolve(__dirname, 'package.json'));
    request = require('request');
    _ = require('underscore');
    S = require('string');
    moment = require('moment');
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

    /**
     * Custom functions accessible to commands
     */
    timeSince = function (timestamp, ago) {
        ago = typeof ago !== 'undefined' ? ago : false;
        var message = moment.utc(timestamp).fromNow(ago);

        if (moment().isAfter(moment(timestamp).add(24, 'hours'))) {
            message += ' (' + moment.utc(timestamp).calendar() + ')';
        }

        return message;
    };

    secondsSince = function (timestamp) {
        var now = moment.utc();
        timestamp = moment.utc(timestamp);
        return now.diff(timestamp, 'seconds');
    };


};