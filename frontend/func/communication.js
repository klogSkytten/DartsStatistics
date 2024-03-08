// FUNCTION IMPORT
import {showConfigModal} from './modal.js';

/////////////////////////////////////////////////////////////////////////////
// COMMUNICATION TO SERVER
/////////////////////////////////////////////////////////////////////////////
// CREATE A CONNECTION TO NODE-SERVER
const conn = io()

// CONNECT TO SERVER
conn.on('CONNECT', clientId => {
    // FADE OUT CONNECTION LOST MESSAGE
    const connLost = document.getElementById('connectionLost');
    if (connLost.classList.contains('active')) {
        // DISPLAY RECONNECTION
        connLost.classList.replace('toast-error', 'toast-success');
        connLost.innerHTML = 'VERBINDUNG WIEDERHERGESTELLT!';

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
    const connLost = document.getElementById('connectionLost');
    connLost.classList.add('active');
});

// CONFIGURATION SET
conn.on('CONFIG', confSet => {
    // LOAD GENERAL SETTINGS
    document.title = confSet.data.general.systemName;
    document.querySelector('#systemName h1').innerText = confSet.data.general.systemName;
    document.querySelector(':root').style.setProperty('--accent', confSet.data.general.accentColor);
    
    if (confSet.command == 'loaded') {
        // FADE IN START PAGE
        const startPage = document.querySelector('.startPage');
        startPage.classList.add('active');
    } else {
        // SHOW MODAL FOR CONFIGSET CHANGES
        showConfigModal(confSet, conn);
    }

    // SET PHRASE FOR MAIN NAVIGATION BUTTONS
    const btnList = document.querySelectorAll('.mainNav .mainButton');
    for (let b = 0; b < btnList.length; b++) {
        let elemName = btnList[b].className.replace('mainButton ', '');
        let elem = document.querySelector('.mainNav .mainButton.' + elemName + ' p');
        elem.innerHTML = confSet.lang[elemName];
    }
});