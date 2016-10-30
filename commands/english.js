exports.names = ['english'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    var ch = '/me ';
    var lang = 'en';

    if (params.length >= 1) {
        username = params.join(' ').trim()
        usernameFormatted = S(username).chompLeft('@').s;
        var user = findUserInList(bot.getUsers(), usernameFormatted);
        if (user) {
            ch += '@' + usernameFormatted + ' ';
            lang = user.language;
        }
    }

    switch (lang) {
        case 'da':
            ch += 'Vær venlig at tale engelsk.';
            break;
        case 'sv':
            ch += 'Vänligen tala engelska.';
            break;
        case 'de':
            ch += 'Bitte sprechen Sie Englisch.';
            break;
        case 'es':
            ch += 'Por favor, hable Inglés.';
            break;
        case 'fr':
            ch += 'Parlez anglais, s\'il vous plaît.';
            break;
        case 'nl':
            ch += 'Spreek Engels, alstublieft.';
            break;
        case 'pl':
            ch += 'Proszę mówić po angielsku.';
            break;
        case 'pt':
            ch += 'Por favor, fale Inglês.';
            break;
        case 'sk':
            ch += 'Hovorte po anglicky, prosím.';
            break;
        case 'cs':
            ch += 'Mluvte prosím anglicky.';
            break;
        case 'sr':
            ch += 'Молим Вас, говорите енглески.';
            break;
        default:
            ch += 'This is an English-speaking community. Please use English in chat.';
            break;
    }

    bot.sendChat(ch);

};