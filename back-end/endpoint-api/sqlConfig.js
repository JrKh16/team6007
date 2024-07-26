var dbconfig = {
    web_labDB: {
        server: '192.168.1.108',
        database:'team6_web_labDB',
        user:'sa',
        password:'admin@123',
        port: 1433,
        options:{
            encript: true,
            setTimeout: 12000,
            enableArithAbort: true,
            trustServerCertificate: true,
            trustedconnection:  true,
            instancename:  '192.168.1.108'  // SQL Server instance name
        }
    },

};
module.exports = dbconfig;
