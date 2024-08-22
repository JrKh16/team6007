const hapi = require('@hapi/hapi');
const AuthBearer = require('hapi-auth-bearer-token');
const fs = require('fs');
const OnlineAgent = require('./respository/OnlineAgent');

const apiport = 8443;

const init = async () => {
    const tls = {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
    };

    const server = hapi.Server({
        port: apiport,
        host: '0.0.0.0',
        tls: tls,
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Access-Control-Allow-Headers', 'Access-Control-Allow-Origin', 'Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
                additionalHeaders: ['Origin', 'x-ms-request-id'],
                credentials: true
            }
        }
    });

    await server.register(require('@hapi/inert'));
    await server.register(AuthBearer);

    server.auth.strategy('simple', 'bearer-access-token', {
        allowQueryToken: true,
        validate: async (request, token, h) => {
            const isValid = token === '00D5D0000001aaZ!ARgAQGuQzp.mOv2jmhXkfIsjgywpCIh7.HZpc6vED1LCbc90DTaVDJwdNqbTW5r4uZicv8AFfkOE1ialqnR8UN5.wnAg3O7h';
            const credentials = { token };
            const artifacts = { test: 'info' };
            return { isValid, credentials, artifacts };
        }
    });

    server.auth.default('simple');

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            return 'Hello P!, Welcome to Endpoint Web Report API.';
        }
    });

    server.route({
        method: 'GET',
        path: '/api/v1/getOnlineAgentByAgentCode',
        handler: async (request, h) => {
            const { agentcode } = request.query;
            try {
                const responsedata = await OnlineAgent.OnlineAgentRepo.getOnlineAgentByAgentCode(agentcode);
                return responsedata;
            } catch (err) {
                console.error(err);
                return h.response('An error occurred').code(500);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/v1/postOnlineAgentStatus',
        options: {
            payload: {
                parse: true,
                allow: ['application/json', 'multipart/form-data'],
                multipart: true
            }
        },
        handler: async (request, h) => {
            const { AgentCode, AgentName, IsLogin, AgentStatus } = request.payload;
            try {
                const responsedata = await OnlineAgent.OnlineAgentRepo.postOnlineAgentStatus(AgentCode, AgentName, IsLogin, AgentStatus);
                return responsedata;
            } catch (err) {
                console.error(err);
                return h.response('An error occurred').code(500);
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/api/v1/deleteOnlineAgent',
        handler: async (request, h) => {
            const { agentcode } = request.query;
            
            if (!agentcode) {
                return h.response('Agent code is required').code(400);
            }
    
            try {
                const responsedata = await OnlineAgent.OnlineAgentRepo.deleteOnlineAgent(agentcode);
                if (responsedata) {
                    return h.response('Agent deleted successfully').code(200);
                } else {
                    return h.response('Agent not found').code(404);
                }
            } catch (err) {
                console.error(err);
                return h.response('An error occurred').code(500);
            }
        }
    });

    await server.start();
    console.log('Webreport API Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();