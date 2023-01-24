function parseHumanTime(time) {
    try {
        const parts = time.match(/(\d*)d? ?((\d*)h)? ?((\d*)m)? ?(\d*)s?/);
        const parsed = parts.filter(part => part != "" && part != undefined && !part.match(/[a-zA-Z]+/)).map(part => parseInt(part)).reverse();

        let seconds = parsed[0];
        if(parsed.length >= 2) seconds += (parsed[1] * 60);
        if(parsed.length >= 3) seconds += (parsed[2] * 60 * 60);
        if(parsed.length >= 4) seconds += (parsed[3] * 60 * 60 * 24);
        
        return seconds;
    } catch(_ignore) {
        return undefined;
    }
}

module.exports = {
    parseHumanTime
}