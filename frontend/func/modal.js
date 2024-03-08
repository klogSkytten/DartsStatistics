// SHOW CONFIGURATION MODAL
function showConfigModal (confSet, ioConn) {
    // DECLARE MODAL ELEMENTS
    const modal = document.querySelector('.modal');
    const headline = document.createElement('h3');
    const description = document.createElement('p');
    const mainCntnt = document.createElement('div');
    const footer = document.querySelector('.modalFooter');
    const button = document.querySelector('.modalFooter .submitInput');

    // CHECK IF NO LANGUAGE IS SELECTED YET
    if (confSet.data.general.lang == '') {
        confSet.command = 'noLang';
    }

    // MODAL CONTENT
    switch (confSet.command) {
        // SETUP TO SELECT LANGUAGE OF WEBAPP
        case 'noLang':
            modal.id = 'noLang';
            headline.innerHTML = '';
            description.innerHTML = '';
            mainCntnt.classList.add('form-group');

            // LANGUAGE BUTTONS
            for (const lang in confSet.lang.availLangs) {
                // CREATE BUTTON
                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-primary');
                btn.innerHTML = confSet.lang.availLangs[lang].toUpperCase();
                btn.addEventListener('click', function(){
                    // SAVE LANGUAGE
                    confSet.data.general.lang = lang;

                    // CLOSE MODAL AND OPEN NEXT ONE
                    modal.close();
                    confSet.command = 'firstStart';
                    showConfigModal(confSet, ioConn);
                });

                // ADD BUTTON TO MAIN CONTENT
                mainCntnt.appendChild(btn);
            }
            break;
        
        // SETUP FOR FIRST START
        case 'firstStart':
            const lang = confSet.data.general.lang;
            modal.id = 'firstStart';
            headline.innerHTML = confSet.lang.firstStart.headline[lang];
            description.innerHTML = confSet.lang.firstStart.description[lang];
            mainCntnt.classList.add('form-group');
            console.log(confSet);
            
            // FORMULAR FIELDS
            for (const prop in confSet.data.general) {
                // SKIP LANGUAGE
                if (prop == 'lang') {
                    continue;
                }
                
                // LABEL
                const lbl = document.createElement('label');
                lbl.classList.add('form-label');
                lbl.htmlFor = prop + 'Input';

                // INPUT
                const inp = document.createElement('input');
                inp.classList.add('form-input');
                inp.id = prop + 'Input';
                inp.value = confSet.data.general[prop];
                switch (prop) {
                    case 'systemName':
                        lbl.innerHTML = '<b>' + confSet.lang.firstStart[prop][lang] + '</b>';
                        inp.type = 'text';
                        inp.addEventListener('input', function() {
                            // CHANGE SYSTEM NAME
                            document.querySelector('#systemName h1').innerText = this.value;
                        });
                        break;
                    case 'accentColor':
                        lbl.innerHTML = '<b>' + confSet.lang.firstStart[prop][lang] + '</b>';
                        inp.classList.add('form-input-color');
                        inp.type = 'color';
                        inp.addEventListener('input', function() {
                            // CHANGE COLOR ACCORDING TO USER SELECTION
                            document.querySelector(':root').style.setProperty('--accent', this.value);
                        });
                        break;
                }

                // ADD FORMULAR FIELDS TO MAIN CONTENT
                mainCntnt.appendChild(lbl);
                mainCntnt.appendChild(inp);
            }

            // SETUP BUTTON
            button.innerHTML = confSet.lang.firstStart.button[lang];
            button.addEventListener('click', function() {
                // SAVE CONFIG AND CLOSE MODAL
                saveConfigData (ioConn, lang);
                closeModal(modal);
            });
            footer.appendChild(button);
            break;

        // UPDATED 
        case 'updated':
            modal.id = 'updated';
            headline.innerHTML = 'Es gibt Neuigkeiten!';
            description.innerHTML = 'Ein neues Update ist eingespielt worden. Folgende Features sind hinzugefügt worden';
            const changes = document.createElement('div');
            changes.classList.add('change-list');

            // CHANGE LIST
            for (const category in confSet.newProps) {
                const list = document.createElement('ul');
                list.innerHTML = 'conf_' + category;
                for (const change in confSet.newProps[category]) {
                    const item = document.createElement('li');
                    item.innerHTML = 'conf_' + category + '_' + change;
                    list.appendChild(item);
                }

                // ADD CHANGE LIST TO MAIN CONTENT
                mainCntnt.appendChild(list);
            }

            // SETUP BUTTON
            button.innerHTML = 'Verstanden';
            button.addEventListener('click', function() {
                // ACKNOWLEDGE CONFIG AND CLOSE MODAL
                ioConn.emit('CONFIG', confSet.newProps);
                closeModal(modal);
            });
            footer.appendChild(button);
            break;
    }

    // REBUILD AND SHOW MODAL
    modal.replaceChildren(headline, description, mainCntnt, footer);
    modal.showModal();
}

// SAVE CONFIGURATION DATA
function saveConfigData (io, language) {
    const confModalForms = document.querySelector('.modal .form-group');
    let data = {general: Object()};
    
    if (confModalForms !== null) {
        // GET VALUES FROM INPUT FIELDS
        confModalForms.querySelectorAll('input').forEach(inp => {
            data.general[inp.id.replace('Input', '')] = inp.value;
        });

        // SAVE LANGUAGE
        data.general.lang = language;

        // SEND DATA TO SERVER
        io.emit('CONFIG', data);
    }
}

// FADE IN START PAGE
function closeModal (modal) {
    // CLOSE MODAL
    modal.close();
    
    // FADE IN START PAGE
    const startPage = document.querySelector('.startPage');
    startPage.classList.add('active');
}

// FUNCTION EXPORT
export {showConfigModal};