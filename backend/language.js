//REQUIREMENTS
const fs = require('fs');
const yaml = require('js-yaml');

//////////////////////////////////////////////////////////////////////
// GET PHRASES FROM LANGUAGE FILE
//////////////////////////////////////////////////////////////////////
function getPhrases (langFile, phraseTag, currLang) {
    let phrases = Object();

    // READ LANGUAGE FILE
    phrases = yaml.load(fs.readFileSync(langFile, 'utf8'));

    // SHRINK PHRASES TO NEEDED ONES AND RETURN THEM
    phrases = shrinkPhrasesObj(phrases, phraseTag, currLang);
    return phrases;
}

//////////////////////////////////////////////////////////////////////
// SHRINK PHRASES OBJECT TO CURRENT LANGUAGE
//////////////////////////////////////////////////////////////////////
function shrinkPhrasesObj(phrasesObj, phraseTag, currLang) {
    // CHECK IF CURRENT LANGUAGE IS ALREADY SELECTED
    if (currLang !== '') {
        // GET ELEMENT LIST DEPENDEND ON PHRASETAG
        switch(phraseTag) {
            case 'loaded':
                // SELECT MAIN NAVIGATION
                elemList = 'mainNav';
                break;
            default:
                // SELECT BY KEY
                elemList = phraseTag;
        }
        
        // ITERATE OVER OBJECT LIST
        for (const elem in phrasesObj[elemList]) {
            // OVERWRITE OBJECT WITH CURRENT LANGUAGE
            phrasesObj[elemList][elem] = phrasesObj[elemList][elem][currLang];
        }

        // RETURN SHRINKED PHRASES OBJECT
        return phrasesObj[elemList];
    } else {
        // IF NO LANGUAGE IS SELECTED YET, RETURN WHOLE PHRASES OBJECT
        return phrasesObj;
    }
}

// FUNCTION EXPORT
module.exports = {getPhrases}