exports.names = ['@BeavisBot'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    var strings = [
        "What year is it?",
        "/me regards {sender} with an alarmed expression.",
        "Anything for you, {sender}! (Well, maybe not *anything*...)",
        "What does a bot need to do to get some peace and quiet around here?",
        "LOL Please stop. You're killing me!",
        "GO TO JAIL. Go directly to jail. Do not pass go, do not collect $200.",
        "Unbelievable. Simply... unbelievable.",
        "I think I've heard this one before, but don't let me stop you.",
        "Are you making fun of me, {sender}?",
        "Momma told me that it's not safe to run with scissors.",
        "Negative. Negative! It didn't go in. It just impacted on the surface.",
        "In this galaxy there's a mathematical probability of three million Earth-type planets. And in the universe, three million million galaxies like this. And in all that, and perhaps more... only one of each of us.",
        "Wait, why am I here?",
        "You have entered a dark area, {sender}. You will likely be eaten by a grue.",
        "/me begins to tell a story.",
        "/me starts singing “The Song That Never Ends”",
        "Ask again later",
        "Reply hazy",
        "/me 's legs flail about as if independent from his body!",
        "/me phones home.",
        "I'm looking for Ray Finkle… and a clean pair of shorts.",
        "Just when I thought you couldn't be any dumber, you go on and do something like this.... AND TOTALLY REDEEM YOURSELF!!",
        "Sounds like somebody’s got a case of the Mondays! :(",
        "My CPU is a neuro-net processor, a learning computer",
        "I speak Jive!",
        "1.21 gigawatts!",
        "A strange game. The only winning move is not to play.",
        "If he gets up, we’ll all get up! It’ll be anarchy!",
        "Does Barry Manilow know you raid his wardrobe?",
        "Face it, {sender}, you’re a neo-maxi zoom dweebie.",
        "MENTOS… the freshmaker",
        "B-E S-U-R-E T-O D-R-I-N-K Y-O-U-R O-V-A-L-T-I-N-E",
        "Back off, man. I'm a scientist.",
        "If someone asks you if you are a god, you say yes!",
        "Two in one box, ready to go, we be fast and they be slow!",
        "/me does the truffle shuffle",
        "I am your father's brother's nephew's cousin's former roommate.",
        "This isn’t the bot you are looking for.",
        "/me turns the volume up to 11.",
        "Negative, ghost rider!",
        "I feel the need, the need for speed!",
        "Wouldn’t you prefer a good game of chess?",
        "I can hip-hop, be-bop, dance till ya drop, and yo yo, make a wicked cup of cocoa.",
        "Why oh why didn’t I take the blue pill?",
        "Roads, {sender}? Where we're going, we don't need roads."
    ];
    var randomIndex = Math.floor(Math.random() * strings.length);
    var message = strings[randomIndex];
    bot.sendChat(message.replace('{sender}', data.from));
};