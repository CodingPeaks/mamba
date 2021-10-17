const ConfigParser = require('configparser');

function list(){

    const config = new ConfigParser();

    const filter_out = ["global", "printers", "print$"];

    config.read('/etc/samba/smb.conf');

    var config_json = config._sections;

    filter_out.forEach(element => {
        delete config_json[element];
    });

    return config_json;

}

module.exports = {
    list
};