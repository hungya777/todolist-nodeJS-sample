const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'  //代表用JSON格式去解析
}

function errorHandle(res, errCode, msg){
    res.writeHead(errCode, headers);
    res.write(JSON.stringify({
        "status":"false",
        "message": msg
    }));
    res.end();
}

function successHandle(res, successCode, data){
    res.writeHead(successCode, headers);
    res.write(JSON.stringify({
        "status":"success",
        "data":data
    }));
    res.end();
}

module.exports = {
    errorHandle, 
    successHandle
};