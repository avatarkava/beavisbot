exports.names = ['magic8ball', '8ball'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    var responses = [
        "Signs point to yes.",
        "Yes.",
        "Reply hazy, try again.",
        "Without a doubt.",
        "My sources say no.",
        "As I see it, yes.",
        "You may rely on it.",
        "Concentrate and ask again.",
        "Outlook not so good.",
        "It is decidedly so.",
        "Better not tell you now.",
        "Very doubtful.",
        "Yes - definitely.",
        "It is certain.",
        "Cannot predict now.",
        "Most likely.",
        "Ask again later.",
        "My reply is no.",
        "Outlook good.",
        "Don't count on it.",
        "Yes, in due time.",
        "Definitely not.",
        "You will have to wait.",
        "I have my doubts.",
        "Outlook so so.",
        "Looks good to me!",
        "Who knows?",
        "Looking good!",
        "Probably.",
        "Are you kidding?",
        "Go for it!",
        "Don't bet on it.",
        "Forget about it.",
        "Nah, man.",
        "Does a bear shit in the woods? Not if it's a polar bear. So I'm afraid the answer is no.",
        "That was a dumb question. Think of a better one and try again.",
        "Do I look like your psychiatrist?",
        "My mind is telling me no, but my body, my body's telling me yes.",
        "I can't believe you just asked me that. You're a real piece of work, you know that?",
        "That is LITERALLY the dumbest question. No. Just... no.",
        "If I say no, will you be upset? Because it's no.",
        "Fo sho.",
        "Nope nope nope nope nope nope nope nope nope nope nope...",
        "Are tacos fucking delicious?",
        "YAAAAASSS"
    ];
    var randomNumber = _.random(1, responses.length);
    bot.sendChat("/me :8ball: " + responses[(randomNumber - 1)] + " @" + data.from.username);
};