module.exports = {
    getRandomInt : function(min, max) 
    {
        return Math.floor((Math.random() * (max - min) + min)); 
    },

    extractStringFromArray : function(args) 
    {
        if(!args[0].startsWith("\"")) {
            return [false, "", null];
        }
        let str = args[0].slice(1); //remove the starting " from the string
        args    = args.slice(1);    //remove first word as it has already been added
        let endFound = false;
        //Iterate through the array passed in, and search for the end of a string
        var wordCount = 0;
        for (var word of args) {
            if (word.endsWith("\"")) {
                endFound = true;
                word = word.slice(0, -1);
            }
            str += " " + word;
            wordCount++;
            if (endFound) break;
            
        }
        if(!endFound && args.length > 0) {
            return [false, "", null];
        }
        if (args.length == 0) {
            str = str.slice(0, -1); //For single word answers, this will remove the trailing " at the end of a word
        }
        return [true, str, args.slice(wordCount)];
    }
}