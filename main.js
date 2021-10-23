var express = require('express');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
require('log-timestamp');
const func = require("./functions");
const user = require("./user");
const share = require("./share");

func.initChecks();

var app = express();

app.get('/addUser', async function (req, res) {
    let username = req.query.user;
    let password = req.query.pass;
    if (Boolean(username) && Boolean(password)) {
        const exitCode = user.add(username, password);
        if (!exitCode) {
            console.log(`User ${username} added`);
            res.send("OK");
        } else {
            console.error(`addUser: User ${username}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/enableUser', async function (req, res) {
    let username = req.query.user;
    if (Boolean(username)) {
        const exitCode = user.enable(username);
        if (!exitCode) {
            console.log(`User ${username} enabled`);
            res.send("OK");
        } else {
            console.error(`enableUser: User ${username}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/removeUser', async function (req, res) {
    let username = req.query.user;
    if (Boolean(username)) {
        const exitCode = user.remove(username);
        if (!exitCode) {
            console.log(`User ${username} removed`);
            res.send("OK");
        } else {
            console.error(`removeUser: User ${username}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/listUsers', async function (req, res) {
    const out = user.list();
    const exitCode = out.exitcode;
    const list = out.stdout;
    if (!exitCode) {
        if (Boolean(list)) {
            const list_array = list.split("\n").filter(Boolean);
            const list_json = JSON.stringify(list_array);
            console.log("listUsers: " + list_json);
            res.send(list_json);
        } else {
            console.log(`listUsers: empty set`);
            res.send("[]");
        }
    } else {
        console.error(`listUsers: Exit code ${exitCode}`);
        res.send("FAIL");
    }
});

app.get('/listShares', async function (req, res) {
    const out = share.list();
    const list = out;
    if (Boolean(list)) {
        console.log("listShares: " + list);
        res.send(list);
    } else {
        console.log(`listShares: empty set`);
        res.send("[]");
    }
});

app.get('/addShare', async function (req, res) {
    let name = req.query.name;
    if (Boolean(name)) {
        const exitCode = share.add(name);
        if (!exitCode) {
            console.log(`Share ${name} added`);
            res.send("OK");
        } else {
            console.error(`addShare: Share ${name}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.get('/removeShare', async function (req, res) {
    let name = req.query.name;
    if (Boolean(name)) {
        const exitCode = share.remove(name);
        if (!exitCode) {
            console.log(`Share ${name} removed`);
            res.send("OK");
        } else {
            console.error(`removeShare: Share ${name}, Exit code ${exitCode}`);
            res.send("FAIL");
        }
    }
});

app.use(express.static(path.join(__dirname, 'html')));
app.listen(3000);

console.log('Listening on port 3000');
