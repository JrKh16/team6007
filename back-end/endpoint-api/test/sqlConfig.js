var dbconfig = {
    development: {
        server: '192.168.56.106',
        database:'team0_web_labDB',
        user:'sa',
        password:'P@ssw0rd',
        port: 1433,
        options:{
            encript: true,
            setTimeout: 12000,
            enableArithAbort: true,
            trustServerCertificate: true,
            trustedconnection:  true,
            instancename:  '192.168.56.106'  // SQL Server instance name
        }
    },
    production: {
        server: '192.168.56.106',
        database:'team0_web_labDB',
        user:'sa',
        password:'P@ssw0rd',
        port: 1433,
        options:{
            encript: true,
            setTimeout: 12000,
            enableArithAbort: true,
            trustServerCertificate: true,
            trustedconnection:  true,
            instancename:  '192.168.56.106'  // SQL Server instance name
        }
    },

};
module.exports = dbconfig;