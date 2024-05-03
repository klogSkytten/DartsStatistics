// FUNCTION IMPORT
import {showConfigModal} from './modal.js';
import {buttonClick, navElemClick, tabLinkClick} from './frontendHandling.js';
import {setLangPhrases} from './languagePhrases.js';


/////////////////////////////////////////////////////////////////////////////
// COMMUNICATION TO SERVER
/////////////////////////////////////////////////////////////////////////////
// CREATE A CONNECTION TO NODE-SERVER
const conn = io();

// CONNECT TO SERVER
conn.on('CONNECT', clientId => {
    // FADE OUT CONNECTION LOST MESSAGE
    const connLost = document.getElementById('connectionLost');
    if (connLost.classList.contains('active')) {
        // DISPLAY RECONNECTION
        connLost.classList.replace('toast-error', 'toast-success');

        // FADE OUT MESSAGE
        setTimeout(() => {
            connLost.classList.remove('active');
        }, 3000);
    } 
    
    // WRITE CLIENT ID INTO FOOTER
    const idElem = document.getElementById('clientId');
    idElem.innerHTML = '#' + clientId;

    // FADE OUT STARTUP ANIMATION
    const strtUp = document.getElementById('startupAnimation');
    strtUp.classList.remove('active');

    // FADE IN SYSTEM NAME
    const sysName = document.getElementById('systemName');
    sysName.classList.remove('invisible');
});

// DISCONNECT FROM SERVER (SERVER-ERROR)
conn.on("connect_error", () => {
    document.getElementById('connectionLost').classList.add('active');
});

// CONFIGURATION SET
conn.on('CONFIG', confSet => {
    // LOAD GENERAL SETTINGS
    document.title = confSet.data.general.systemName;
    document.querySelector('#systemName h1').innerText = confSet.data.general.systemName;
    document.querySelector(':root').style.setProperty('--accent', confSet.data.general.accentColor);
    document.querySelector(':root').style.setProperty('--accentAlpha',
                            [parseInt(confSet.data.general.accentColor.substring(1, 3), 16),
                             parseInt(confSet.data.general.accentColor.substring(3, 5), 16),
                             parseInt(confSet.data.general.accentColor.substring(5, 7), 16)]);
    sessionStorage.settings = JSON.stringify(confSet.data);
    sessionStorage.general = JSON.stringify(confSet.data.general);
    sessionStorage.game = JSON.stringify(confSet.data.games);
    sessionStorage.training = JSON.stringify(confSet.data.trainingGames);
    sessionStorage.statistics = JSON.stringify(confSet.data.statistics);

    if (confSet.command == 'loaded') {
        // CHECK FOR AN ALREADY ACTIVE PAGE
        if(sessionStorage.currPage && sessionStorage.currPage !== 'startPage') {
            document.querySelector('.main.' + sessionStorage.currPage).classList.add('active');
            buttonClick(document.querySelector('.mainButton.' + sessionStorage.currPage), conn);
        } else {
            // FADE IN START PAGE
            const startPage = document.querySelector('.startPage');
            startPage.classList.add('active');
        }
    } else {
        // SHOW MODAL FOR CONFIGSET CHANGES
        showConfigModal(confSet, conn);

        // UPDATE LOCAL STORAGE
        sessionStorage.currPage = 'startPage';
    }

    // SET PHRASES FOR MAIN NAVIGATION BUTTONS
    setLangPhrases('startPage', confSet.lang);
});

// SET LANGUAGE PHRASES
conn.on('LANG', data => {
    setLangPhrases(data[0], data[1]);
});


/////////////////////////////////////////////////////////////////////////////
// FRONTEND HANDLING
/////////////////////////////////////////////////////////////////////////////
// SETUP ALL BUTTONS FOR THE BUTTON CLICK FUNCTION (EXCEPT MODAL BUTTONS)
const allBtns = document.querySelectorAll('button');
for (let b = 0; b < allBtns.length; b++) {
    let btnPrnt = allBtns[b].parentElement.classList;
    if (!btnPrnt.contains('modalFooter')) {
        allBtns[b].addEventListener('click', (event) => {
            buttonClick(event.target, conn);
        });
    }
}

// SETUP ALL NAV ELEMENTS FOR THE NAV ELEM CLICK FUNCTION
const allNavElems = document.querySelectorAll('nav ul li a');
for (let e = 0; e < allNavElems.length; e++) {
    allNavElems[e].addEventListener('click', (event) => {
        navElemClick(event.target, conn);
    });
}

// SETUP ALL TAB LINKS FOR THE LINK CLICK FUNCTION
const allTabLinks = document.querySelectorAll('.tab-item a');
for (let l = 0; l < allTabLinks.length; l++) {
    allTabLinks[l].addEventListener('click', (event) => {
        tabLinkClick(event.target, conn);
    });
}