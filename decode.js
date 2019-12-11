let fs = require('fs');
const iconv = require('iconv-lite');




for(let i = 1; i <= 18; i++){
    let rawdata = require('./LIkFy3rF1g/message_'+ i +'.json');
    rawdata.forEach(function (message) {
        message.sender_name = decode(message.sender_name);
        message.content = decode(message.content);
        if(message.reactions){
            message.reactions.forEach(function(reaction){
                reaction.actor = decode(reaction.actor);
                reaction.reaction = decode(reaction.reaction);
            })
        }
    });
    let data = JSON.stringify(rawdata);
    fs.writeFileSync('output/decodedMessages'+ i +'.json', data);
}
function decode(val){
    return iconv.decode(iconv.encode(val, 'latin-1'), 'utf-8');
}