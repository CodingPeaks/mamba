var express = require('express');
var app = express();
var path = require('path');
var spawnSync = require('child_process').spawnSync;
require('log-timestamp');
var commandExists = require('command-exists').sync;

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
    }
}

function addUser(user, password){
    var res = 1;
    const res1 = addUnixUser(user);

    if(!res1){
        const res2 = addSambaUser(user, password)
        if(!res2){
            res = 0;
        }else{
            console.error("addSambaUser: Exit code 1");
        }
    }else{
        console.error("addUnixUser: Exit code 1");
    }

    return res;
}

function addUnixUser(user){
    const res = spawnSync('useradd', ['-M', '-d', `/samba/${user}`, '-s', '/usr/sbin/nologin', '-G', 'sambashare', user]);
    return res.status;
}

function addSambaUser(user, password){
    const res = spawnSync('smbpasswd', ['-a', '-s', user], {
        input: `${password}\n${password}\n`,
    });
    return res.status;
}

function enableUser(user){
    const res = spawnSync('smbpasswd', ['-e', user]);
    return res.status;
} 

function deleteUser(user){
    var res = 1;
    const res1 = deleteSambaUser(user);

    if(!res1){
        const res2 = deleteUnixUser(user)
        if(!res2){
            res = 0;
        }else{
            console.error("deleteSambaUser: Exit code 1");
        }
    }else{
        console.error("deleteUnixUser: Exit code 1");
    }

    return res;
}

function deleteUnixUser(user){
    const res = spawnSync('userdel', [user]);
    return res.status;
}

function deleteSambaUser(user){
    const res = spawnSync('smbpasswd', ['-x', user]);
    return res.status;
}

function listUsers(){
    const res1 = spawnSync('pdbedit', ['-L'], { encoding: 'utf-8' });
    const res2 = spawnSync('cut', ['-d', ':', '-f', '1'], { encoding: 'utf8', input: res1.stdout });
    var res = {};
    res["exitcode"] = res2.status;
    res["stdout"] = res2.stdout;
    return res;
}

module.exports = {
    initChecks,
    addUser,
    enableUser,
    deleteUser,
    listUsers
};