module.exports = function (bot) {

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

};