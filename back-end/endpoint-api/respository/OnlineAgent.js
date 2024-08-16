
const sql = require('mssql');
const sqlConfig = require('../sqlConfig')['development'];

const { v4: uuid } = require('uuid');

console.log("sqlConfig: ", sqlConfig);

async function getOnlineAgentByAgentCode(agentcode) {

    try {
        console.log("agentcode: ", agentcode);

        let pool = await sql.connect(sqlConfig);
        let result = await pool.request().query(`SELECT * FROM [OnlineAgents] WHERE [agent_code] = '${agentcode}'`); //@agentcode
        //let result = await pool.request().query(`SELECT * FROM [OnlineAgents] WHERE [agent_code] LIKE '99%'`); //@agentcode

        if (!result || result.recordsets[0].length === 0) {

            return ({
                error: true,
                errMessage: 'Agent not found',
            });

        } else {

            return ({
                error: false,
                returnCode: 1,
                data: result.recordset[0]
            });

        }

    }
    catch (error) {
        console.log(error);

    }

}


async function postOnlineAgentStatus(AgentCode, AgentName, IsLogin, AgentStatus){

    console.log("----------------");
    console.log("AgentCode: " + AgentCode);
    console.log("AgentName: " + AgentName);
    console.log("IsLogin: " + IsLogin);
    console.log("AgentStatus: " + AgentStatus);

    try {

        let pool = await sql.connect(sqlConfig);
        let request = await pool.request();

        let agentid = 999; // uuid
        const uniqueId = uuid(); // agent_id


        console.dir("--------request---------");
        request.input("agent_id", sql.Int, agentid);
        request.input("agent_code", sql.VarChar(20), AgentCode);
        request.input("uuid", sql.VarChar(50), uniqueId);
        request.input("AgentName", sql.VarChar(20), AgentName);
        request.input("IsLogin", sql.Char(1), IsLogin);
        request.input("AgentStatus", sql.Char(1), AgentStatus);

        let result = await pool.request().query(`SELECT * FROM [OnlineAgents] WHERE [agent_code] = '${AgentCode}'`); //@agentcode

        if (!result || result.recordsets[0].length === 0) {
            // Can insert
            let result2 = await pool.request().query("INSERT INTO [OnlineAgents] (agent_code, agent_id, AgentName, IsLogin, AgentStatus, uuid) OUTPUT inserted.agent_code, inserted.uuid, inserted.StartOnline VALUES ('" + AgentCode + "'," + agentid + ",'" + AgentName + "','" + IsLogin + "','" + AgentStatus + "','" + uniqueId + "');");
            console.dir(result2.recordset[0]);

            return ({
                error: false,
                returnCode: 0,
                data: 'Agent was inserted, status has been set also',
            });

        }
        else {
            //Can not insert / Update
            let result2 = await pool.request().query("UPDATE [OnlineAgents] SET [AgentName] = '" + AgentName + "', [IsLogin] = '" + IsLogin + "', [AgentStatus] = '" + AgentStatus + "'  WHERE [agent_code] = '" + AgentCode + "'; ");
            console.dir(result2);

            return ({
                error: false,
                returnCode: 1,
                data: 'Agent was updated',
            });

        }

    } catch (error) {
        console.log(error);
        //callBack(error);
    }

}

async function deleteOnlineAgent(AgentCode) {
    try {
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();

        let result = await request.input("agent_code", sql.VarChar(20), AgentCode)
                                  .query('DELETE FROM [OnlineAgents] WHERE [agent_code] = @agent_code;');

        if (result.rowsAffected[0] === 0) {
            return {
                error: true,
                errMessage: 'Agent not found or could not be deleted',
            };
        } else {
            return {
                error: false,
                returnCode: 1,
                data: 'Agent was deleted',
            };
        }
    } catch (error) {
        console.error('Error deleting agent:', error.message); // Provide more detailed error info
        return {
            error: true,
            errMessage: 'Error deleting agent',
        };
    } finally {
        // Optionally close the connection if your library does not handle it automatically
        // pool.close();
    }
}

module.exports.OnlineAgentRepo = {

    getOnlineAgentByAgentCode: getOnlineAgentByAgentCode,
    postOnlineAgentStatus: postOnlineAgentStatus,
    deleteOnlineAgent: deleteOnlineAgent

}
