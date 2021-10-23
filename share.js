const ConfigParser = require('configparser');

const samba_config_file = '/etc/samba/smb.conf';

function list(){

    const config = new ConfigParser();

    const filter_out = ["global", "printers", "print$", "homes"];

    config.read(samba_config_file);

    var config_json = config._sections;

    filter_out.forEach(element => {
        delete config_json[element];
    });

    return JSON.stringify(config_json);

}

function add(name, parameters){

    const config = new ConfigParser();

    config.read(samba_config_file);

    config.addSection(name);

    for (const parameter in parameters) {
        const value = parameters[parameter];
        config.set(name, 'token', 'some value');
        console.log(parameter, value);
    }

    config.write(samba_config_file);

    return 0;
}

function remove(name){

    const config = new ConfigParser();

    config.read(samba_config_file);

    config.removeSection(name);

    config.write(samba_config_file);

    return 0;
}

module.exports = {
    list,
    add,
    remove
};