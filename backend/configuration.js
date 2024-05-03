//REQUIREMENTS
const fs = require('fs');
const yaml = require('js-yaml');

//////////////////////////////////////////////////////////////////////
// GET CONFIGURATION FROM CONFIGURATION FILE
//////////////////////////////////////////////////////////////////////
function getConfig (confSet) {
    let set = Object();
    const filePath = confSet.file;
    const filePathDflt = confSet.fileDflt;

    try {
        // READ CONFIGURATION SET FROM YAML FILE
        set.command = 'loaded';
        set.data = yaml.load(fs.readFileSync(filePath, 'utf8'));
        console.log('Loaded Configuration');
    } catch {
        // READ DEFAULT CONFIGURATION SET IF YAML FILE NOT EXISTS (ONLY FIRST START)
        set.command = 'firstStart';
        set.data = yaml.load(fs.readFileSync(filePathDflt, 'utf8'));
        console.log('Setup Configuration');
    }

    // UPDATE CONFIGURATION SET
    if (set.command == 'loaded') {
        // COMPARE BOTH CONFIGURATION SETS BY THEIR PROPERTIES
        set.newProps = compareConfigSets(set.data, yaml.load(fs.readFileSync(filePathDflt, 'utf8')), 'update');

        // CHECK FOR NEW PROPERTIES
        if (Object.keys(set.newProps).length > 0) {
            set.command = 'updated';
            console.log('  -> Configuration updated');
            
            // SAVE CONFIGURATION SET TO YAML FILE
            saveConfig (filePath, set);
        }
    }
    return set;
}

//////////////////////////////////////////////////////////////////////
// COMPARE CONFIGURATION SETS BY COMPARING PROPERTIES
//
// DEPENDING ON [PURPOSE], THE RETURN DATA INCLUDES A WHOLE NEW
// DATASET (INHERIT FROM ORIGINAL DATASET) OR ONLY THE NEW PROPERTIES
//////////////////////////////////////////////////////////////////////
function compareConfigSets(origData, newData, purpose) {
    let retData;

    // ANALYSE PURPOSE
    switch (purpose) {
        // RETURNS MERGED DATA
        case 'merge':
            retData = origData;
            break;
        case 'update':
            // RETURNS ONLY NEW PROPERTIES
            retData = Object();
            break;
        default:
            // INVALUD PURPOSE
            console.error('ERROR: Invalid Purpose in function \'compareConfigSets\'');
            return false;
    }

    // ITERATE OVER EACH KEY FROM NEW DATASET
    for (const [key, value] of Object.entries(newData)) {
        // COMPARE IF KEY IS EITHER IN ORIGINAL DATASET
        if (Object.keys(origData).includes(key)) {
            // CHECK IF VALUE IS AN OBJECT AS WELL
            if (typeof value === 'object') {
                // CALL FUNCTION RECURSIVELY
                retData[key] = compareConfigSets(origData[key], value, purpose);
                if (Object.keys(retData[key]).length === 0) {
                    // REMOVE EMPTY SUBOBJECTS
                    delete retData[key];
                }
            } else if (purpose === 'merge') {
                // MERGE DATA
                retData[key] = newData[key];
            }
        } else {
            // ADD KEY TO THE ORIGINAL DATASET
            retData[key] = newData[key];
        }
    }
    return retData;
}

//////////////////////////////////////////////////////////////////////
// SAVE CONFIGURATION TO CONFIGURATION FILE
//////////////////////////////////////////////////////////////////////
function saveConfig (confFile, confSet) {
    // CHECK IF THERE ARE NEW PROPERTIES IN CONFIGURATION SET
    // OHTERWISE IT MAKES NO SENSE TO SAVE THE CONFIGURATION SET
    if (confSet.hasOwnProperty('newProps')) {
        // MERGE CONFIGURATION SET PROPERTIES
        confSet.data = compareConfigSets(confSet.data, confSet.newProps, 'merge');
        
        // CREATE USERDATA DIRECTORY IF IT DOES NOT EXIST YET
        const userDir = confFile.replace('/config.yaml', '')
        try {
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir);
                console.log('Created userdata directory');
            }
        } catch (err) {
            console.error(err);
        }
        
        // WRITE CONFIGURATION SET TO YAML FILE
        fs.writeFileSync(confFile, yaml.dump(confSet.data), 'utf8');
        console.log('Configuration saved');
    } else {
        console.log('Configuration not saved');
    }
}

// FUNCTION EXPORT
module.exports = {getConfig, saveConfig}