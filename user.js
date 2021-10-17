var spawnSync = require('child_process').spawnSync;

function add(user, password){
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

function enable(user){
    const res = spawnSync('smbpasswd', ['-e', user]);
    return res.status;
} 

function remove(user){
    var res = 1;
    const res1 = removeSambaUser(user);

    if(!res1){
        const res2 = removeUnixUser(user)
        if(!res2){
            res = 0;
        }else{
            console.error("removeSambaUser: Exit code 1");
        }
    }else{
        console.error("removeUnixUser: Exit code 1");
    }

    return res;
}

function removeUnixUser(user){
    const res = spawnSync('userdel', [user]);
    return res.status;
}

function removeSambaUser(user){
    const res = spawnSync('smbpasswd', ['-x', user]);
    return res.status;
}

function list(){
    const res1 = spawnSync('pdbedit', ['-L'], { encoding: 'utf-8' });
    const res2 = spawnSync('cut', ['-d', ':', '-f', '1'], { encoding: 'utf8', input: res1.stdout });
    var res = {};
    res["exitcode"] = res2.status;
    res["stdout"] = res2.stdout;
    return res;
}

module.exports = {
    add,
    enable,
    remove,
    list
};