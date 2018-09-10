let DB = (function(){
    "use strict";
    const mysql = require('mysql');

    const dbPoolConfig = {
        host            : config.get('dbPoolSettings.host'),
        user            : config.get('dbPoolSettings.user'),
        password        : config.get('dbPoolSettings.password'),
        database        : config.get('dbPoolSettings.database'),
        connectionLimit : config.get('dbPoolSettings.connectionLimit')
    };

    let numConnectionsInPool = 0;
    let dbConnectionsPool;

    function dbClient() {
        if(!new.target){
            return new dbClient();
        }
        console.log('CALLING INITIALIZE POOL');
        console.log('');
        dbConnectionsPool = mysql.createPool(dbPoolConfig);

        dbConnectionsPool.on('connection', function (connect) {
            numConnectionsInPool++;
            console.log('NUMBER OF CONNECTION IN POOL : ' + numConnectionsInPool);
        });
        // return dbConnectionsPool;
    }

    dbClient.prototype.executeQuery = function(sql, values, callback){
        let queryObject = {};
        if (typeof sql === 'object') {
            // query(options, cb)
            queryObject = sql;
            if (typeof values === 'function') {
                queryObject.callback = values;
            } else if (typeof values !== 'undefined') {
                queryObject.values = values;
            }
        } else if (typeof values === 'function') {
            // query(sql, cb)
            queryObject.sql      = sql;
            queryObject.values   = undefined;
            queryObject.callback = values;
        } else {
            // query(sql, values, cb)
            queryObject.sql      = sql;
            queryObject.values   = values;
            queryObject.callback = callback;
        }

        return dbConnectionsPool.query(queryObject.sql, queryObject.values, function(err, result){
            if(err){
                if(err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED'){
                    setTimeout(module.exports.dbHandler.getInstance().executeQuery.bind(null, sql, values, callback), 50);
                }
                else{
                    queryObject.callback(err, result);
                }
            }
            else{
                queryObject.callback(err, result);
            }
        });
    };

    let getClient = function () {
        return new dbClient();
    };

    exports.client = getClient();
})();