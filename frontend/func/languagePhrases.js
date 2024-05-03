/////////////////////////////////////////////////////////////////////////////
// FUNCTION TO INSERT LANGUAGE PHRASES INTO WEBAPP
/////////////////////////////////////////////////////////////////////////////
function setLangPhrases(page, langPhrObj) {
  const pageObj = document.querySelector('.main.' + page);

  // ITERATE OVER EACH LANGUGAE PHRASE OBJECT AND INSERT IT TO MATCHING ELEMENT
  for (let [phrKey, phrase] of Object.entries(langPhrObj)) {
      let tgtElem = pageObj.querySelector('.' + phrKey);
      if (tgtElem) {
        // INSERT PHRASE DEPENDEND ON PAGE
        switch (page) {
          case 'startPage':
            tgtElem.querySelector('p').innerHTML = phrase;
            break;
          case 'players':
            if (tgtElem.tagName === 'BUTTON' || tgtElem.classList.contains('form-inline')) {
              tgtElem.querySelector('span').innerHTML = phrase;
            } else {
              tgtElem.innerHTML = phrase;
            }
            break;
          case 'game':
            tgtElem.innerHTML = phrase;
            break;
          default:
            console.log(page);
            console.log(pageObj); 
            console.log(phrKey + ': ' + phrase);
            console.log(tgtElem);
        }
      }
    }
}


/////////////////////////////////////////////////////////////////////////////
// FUNCTION EXPORT
/////////////////////////////////////////////////////////////////////////////
export {setLangPhrases};