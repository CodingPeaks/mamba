var commandExists = require('command-exists').sync;
require('log-timestamp');

var pkg_requirements = ["samba", "pdbedit", "smbpasswd", "cut"];

function initChecks() {

    var code = 0;

    pkg_requirements.forEach(element => {
        if(commandExists(element) == false){
            console.log(`Requirement not satisfied: ${element}`);
            code = 1;
        }
    });

    if (code) {
        process.exit(1);
    }else{
        console.log("Checks OK")
    }
}

module.exports = {
    initChecks
};