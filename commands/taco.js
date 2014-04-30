exports.names = ['.taco'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://static.wixstatic.com/media/a07b92_537fd27edabf4722a7673f5c824c29f6.gif',
        'http://www.thecoast.ca/images/blogimages/2011/02/16/1297864255-taco.gif',
        'http://userserve-ak.last.fm/serve/_/79772399/Nyan%20Cat%20TacoCatnyancat26042543500484.gif',
        'http://www.lolwithme.org/wp-content/uploads/tacocat.jpg',
        'http://i.imgur.com/lSiZUtB.jpg'
    ];
    var randomIndex = _.random(0, strings.length-1);
    bot.sendChat(strings[randomIndex]);
};