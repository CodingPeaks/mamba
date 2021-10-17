var express = require('express');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
require('log-timestamp');
const lib = require("./functions");

lib.initChecks();

var app = express();

app.get('/addUser', async function(req, res) {
    let user = req.query.user;
    let pass = req.query.pass;
    if(Boolean(user) && Boolean(pass)){
        const exitCode = lib.addUser(user, pass);
        if(!exitCode){
            console.log(`User ${user} added`);
            res.send("OK");
        }else{
            console.error(`addUser: User ${user}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/enableUser', async function(req, res) {
    let user = req.query.user;
    if(Boolean(user)){
        const exitCode = lib.enableUser(user);
        if(!exitCode){
            console.log(`User ${user} enabled`);
            res.send("OK");
        }else{
            console.error(`enableUser: User ${user}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/deleteUser', async function(req, res) {
    let user = req.query.user;
    if(Boolean(user)){
        const exitCode = lib.deleteUser(user);
        if(!exitCode){
            console.log(`User ${user} deleted`);
            res.send("OK");
        }else{
            console.error(`deleteUser: User ${user}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/listUsers', async function(req, res) {
    const out = lib.listUsers();
    const exitCode = out.exitcode;
    const list = out.stdout;
    if(!exitCode){
        if(Boolean(list)){
            const list_array = list.split("\n").filter(Boolean);
            const list_json = JSON.stringify(list_array);
            console.log("listUsers: "+list_json);
            res.send(list_json);
        }else{
            console.log(`listUsers: empty set`);
            res.send("[]");
        }
    }else{
        console.error(`listUsers: Exit code ${exitCode}`);
        res.send("FAIL");
    }
});

app.use(express.static(path.join(__dirname, 'html')));
app.listen(3000);

console.log('Listening on port 3000');
