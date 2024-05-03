/////////////////////////////////////////////////////////////////////////////
// BUTTON CLICK FUNCTION
/////////////////////////////////////////////////////////////////////////////
function buttonClick(src, ioConn) {
    const classes = src.classList;

    // HELPFUNCTION TO CHECK IF IDENTIFIER IS IN CLASSLIST
    function findClass(identifier) {
        if (classes.contains(identifier)) {
            return classes;
        }
    }
    
    // IDENTIFY BUTTON VIA CLASSLIST
    switch(classes) {
        // MAIN BUTTON
        case findClass('mainButton'):
            // UPDATE LOCAL STORAGE
            sessionStorage.currPage = classes.value.replace('mainButton ', '');
            
            // FADE OUT START PAGE
            document.querySelector('.startPage').classList.remove('active');
        
            // LOAD AND DISPLAY DATA
            switch (sessionStorage.currPage) {
                case 'players':
                    // LOAD DATA FROM SERVER
                    console.log('TODO: LOAD DATA FROM SERVER: USERNAMES');
                    break;
                case 'highscores':
                    // UPDATE HIGHSCORES
                    console.log('TODO: HIGHSCORE UPDATE FUNCTION');
                    break;
                default:
                    // BUILD NAV
                    buildNav(Object.keys(JSON.parse(sessionStorage[sessionStorage.currPage])));
            }

            // SLIDE IN TARGET PAGE
            const targetPage = document.querySelector(classes.value.replace('mainButton ', '.main.'));
            targetPage.classList.add('active');
            
            // CHECK FOR CURRENT NAV ELEMENT
            const currNav = document.querySelector('.main.' + sessionStorage.currPage + ' nav');
            if (currNav) {
                if (sessionStorage.currNav) {
                    // TAKE ALREADY SAVED NAV ELEMENT WITH ALREADY SAVED TAB
                    navElemClick(currNav.querySelector('li a.' + sessionStorage.currNav), ioConn, sessionStorage.currTab);
                } else {
                    // TAKE FIRST NAV ELEMENT
                    navElemClick(currNav.querySelector('li a'), ioConn, sessionStorage.currTab);
                }
            }

            // REQUEST LANGUAGE DATA FROM SERVER
            const generalConfig = JSON.parse(sessionStorage.general);
            ioConn.emit('LANG', [sessionStorage.currPage, generalConfig.lang]);
            break;
        
        // EXIT BUTTON
        case findClass('exit'):
            // SLIDE OUT SOURCE PAGE
            document.querySelector(('.main.active')).classList.remove('active');
        
            // FADE IN START PAGE
            const startPage = document.querySelector('.startPage');
            (document.querySelector('.startPage')).classList.add('active');
        
            // UPDATE LOCAL STORAGE
            sessionStorage.currPage = 'startPage';
            sessionStorage.removeItem('currNav');
            sessionStorage.removeItem('currTab');
            break;
        
        // PANEL ACTION BUTTON
        case findClass('panelAction'):
            // FIND ACTIVE PANEL TAB
            const panelTabs = document.querySelectorAll('.panel-nav a');
            let activePanelBody = 0;
            for (let pt = 0; pt < panelTabs.length; pt++) {
                if (panelTabs[pt].classList.value.includes('active')) {
                    activePanelBody = pt;
                }
            }
            
            // IDENTIFY BUTTON VIA CLASSLIST
            switch(classes) {
                // BACK BUTTON
                case findClass('panelBack'):
                    tabLinkClick(panelTabs[activePanelBody - 1], ioConn);
                    break;

                // CONTINUE BUTTON
                case findClass('panelContinue'):
                    tabLinkClick(panelTabs[activePanelBody + 1], ioConn);
                    break;

                // START BUTTON
                case findClass('panelStart'):
                    console.log('PANEL START');
                    break;

                // UNKNOWN BUTTON
                default:
                    console.log('Unknown Panel Button clicked!');
                    console.log(classes);
            }
            break;

        // UNKNOWN BUTTON
        default:
            // CHECK FOR BUTTON GROUP AS PARENT
            console.log(src.parentElement.classList);
        
            console.log('Unknown Button clicked!');
            console.log(classes);
    }
}


/////////////////////////////////////////////////////////////////////////////
// NAV ELEMENT CLICK FUNCTION
/////////////////////////////////////////////////////////////////////////////
function navElemClick(src, ioConn, storedTab) {
    const currNav = document.querySelector('.main.' + sessionStorage.currPage + ' nav');
    const currTabs = document.querySelector('.main.' + sessionStorage.currPage + ' .tab');
    let currElem = src;
    while (currElem.tagName != 'A') {
        currElem = currElem.parentElement;
    }
    
    // TOGGLE SELECTED CLASS IN NAV ELEMENTS
    if (currNav.querySelector('li a.selected')) {
        currNav.querySelector('li a.selected').classList.toggle('selected');
    }
    currNav.querySelector('li a.' + currElem.classList.value).classList.toggle('selected');

    // UPDATE LOCAL STORAGE
    sessionStorage.currNav = currElem.classList.value.replace(' selected', '');

    // SELECT TAB
    if (currTabs) {
        if (storedTab) {
            // TAKE ALREADY SAVED TAB
            tabLinkClick(currTabs.querySelector('a.' + storedTab), ioConn);
        } else {
            // TAKE FIRST TAB IF EXIST
            tabLinkClick(currTabs.querySelector('a'), ioConn);
        }
    } else {
        // LOAD DATA
        console.log('TODO: LOAD DATA FROM SERVER (USER) OR CONFIG FILE (PROPERTIES)');
    }
}


/////////////////////////////////////////////////////////////////////////////
// TAB LINK CLICK FUNCTION
/////////////////////////////////////////////////////////////////////////////
function tabLinkClick(src, ioConn) {
    const currPanel = src.parentElement.parentElement.parentElement.parentElement;
    const currClass = src.classList.value.replace('active', '');

    // TOGGLE ACTIVE CLASS IN TAB NAVIGATION
    if (currPanel.querySelector('.panel-nav .active')) {
        currPanel.querySelector('.panel-nav .active').classList.toggle('active');
    }
    currPanel.querySelector('.panel-nav .' + currClass).classList.toggle('active');

    // UPDATE PANEL BODY CLASS
    currPanel.querySelector('.panel-body').classList.value = 'panel-body ' + currClass;

    // UPDATE LOCAL STORAGE
    sessionStorage.currTab = currClass;

    // (RE)BUILD PANEL BODY
    buildPanelBody(ioConn);
}


/////////////////////////////////////////////////////////////////////////////
// BUILD NAVIGATION FUNCTION
/////////////////////////////////////////////////////////////////////////////
function buildNav(list) {
    // IDENTIFY NAV LIST ELEMENT
    const navList = document.querySelector('.main.' + sessionStorage.currPage + ' nav ul');

    // REMOVE ALL OLD LIST ELEMENTS
    while(navList.firstChild) {
        navList.removeChild(navList.firstChild);
    }

    // ADD LIST ELEMENTS TO NAV ELEMENT
    for (const listElem in list) {
        // LIST ITEM
        const item = document.createElement('li');

        // LINK
        const link = document.createElement('a');
        link.classList.add(list[listElem].toLowerCase());
        link.innerHTML = list[listElem];

        // ADD ELEMENTS
        item.appendChild(link);
        navList.appendChild(item);
    }
}


/////////////////////////////////////////////////////////////////////////////
// BUILD PANEL BODY FUNCTION
/////////////////////////////////////////////////////////////////////////////
function buildPanelBody(ioConn) {
    // IDENTIFY PANEL BODY ELEMENT
    const panelBody = document.querySelector('.main.' + sessionStorage.currPage + ' .panelBodyContainer .' + sessionStorage.currTab);
    
    // DIFFER BETWEEN BODIES
    switch (sessionStorage.currTab) {
        // GENERAL GAME SETTINGS
        case 'gameGeneral':
            // GET CURRENT GAME OBJECT
            const allGames = JSON.parse(sessionStorage[sessionStorage.currPage]);
            const currGameStr = sessionStorage.currNav.substring(0, 1).toUpperCase() + sessionStorage.currNav.substring(1);
            const currGame = allGames[currGameStr];

            // REMOVE ALL OLD CHILD ELEMENTS
            while(panelBody.firstChild) {
                panelBody.removeChild(panelBody.firstChild);
            }

            // DESCRIPTION
            const desc = document.createElement('p');
            desc.classList.add(currGameStr + '_description', 'description');
            panelBody.appendChild(desc);
            
            // OPTION ELEMENTS
            for (const optElem in currGame) {
                const lbl = document.createElement('p');
                lbl.classList.add('form-label', currGameStr + '_' + optElem);
                panelBody.appendChild(lbl);
                switch(optElem) {
                    // SLIDER
                    case 'sets':
                    case 'legs':
                        // VALUE
                        const val = document.createElement('p');
                        val.classList.add('formValue', optElem);
                        val.innerHTML = currGame[optElem][0].toString();
                        panelBody.appendChild(val);

                        // SLIDER
                        const minVal = Math.min.apply(Math, currGame[optElem][1]);
                        const maxVal = Math.max.apply(Math, currGame[optElem][1]);
                        const step = (maxVal - minVal) / (currGame[optElem][1].length - 1);
                        const slider = document.createElement('input');
                        slider.classList.add('slider', optElem);
                        slider.setAttribute('type', 'range');
                        slider.setAttribute('min', minVal.toString());
                        slider.setAttribute('max', maxVal.toString());
                        slider.setAttribute('value', currGame[optElem][0].toString());
                        slider.setAttribute('step', step.toString());
                        slider.addEventListener('input', function() {
                            // UPDATE SLIDER VALUE
                            document.querySelector('.formValue.' + optElem).innerHTML = this.value.toString();
                        });
                        panelBody.appendChild(slider);
                        break;
                    
                    // BUTTON GROUP
                    default:
                        // BUTTON GROUP
                        const btnGrp = document.createElement('div');
                        btnGrp.classList.add('btn-group', 'btn-group-block', optElem);
                        
                        // BUTTONS
                        let btn = document.createElement('button');
                        for (const b in currGame[optElem][1]) {
                            btn = document.createElement('button');
                            btn.classList.add('btn', 'btn-primary');
                            if (currGame[optElem][0] === currGame[optElem][1][b]) {
                                btn.classList.add('active');
                            }
                            btn.innerHTML = currGame[optElem][1][b];
                            btn.removeAttribute('type');
                            btn.addEventListener('click', function() {
                                // UPDATE ACTIVE CLASS
                                this.parentElement.querySelector('.active').classList.remove('active');
                                this.classList.add('active');
                                return false;
                            });
                            btnGrp.appendChild(btn);
                        }
                        panelBody.appendChild(btnGrp);
                }
            }
            break;
        
        // GAME PLAYERS
        case 'gamePlayers':
            console.log('TODO: LOAD USER DATA FROM SERVER');
            break;
        
        // GAME SRAT
        case 'gameStart':
            console.log('TODO: LOAD SELECTED USER DATA');
            break;
        default:
            console.log('UNKNOWN TAB: ' + sessionStorage.currTab);
    }

    // REQUEST LANGUAGE DATA FROM SERVER
    const generalConfig = JSON.parse(sessionStorage.general);
    ioConn.emit('LANG', [sessionStorage.currPage, generalConfig.lang]);
}


/////////////////////////////////////////////////////////////////////////////
// FUNCTION EXPORT
/////////////////////////////////////////////////////////////////////////////
export {buttonClick, navElemClick, tabLinkClick};