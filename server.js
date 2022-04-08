// nodeJS內建套件
const http = require('http');
// 第三方套件: 自動產生uuid
const { v4: uuidv4 } = require('uuid');
// 自己撰寫的JS
const handleInfo = require('./handleInfo');
const successHandle = handleInfo.successHandle; //正確處理資訊
const errHandle = handleInfo.errorHandle;  //錯誤處理資訊

const todos = [];
const requestListener = (req, res) =>{
    let body = "";    //對方傳來的body資料
    req.on('data', (chunk)=>{
        body += chunk;
        // console.log(body);
    });
    if(req.url == "/" && req.method == "GET"){  //取得所有代辦
        successHandle(res, 200, todos);
    }else if(req.url.startsWith('/todos') && req.method == "POST"){  //新增一筆代辦
        req.on('end', ()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){  //有title屬性
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    }
                    todos.push(todo);
                    successHandle(res, 200, todos);
                }else{  //無title屬性
                    errHandle(res, 400, "輸入資料格式無title屬性");
                }
            }catch(error){
                // console.log(error);
                errHandle(res, 400, "欄位未填寫正確，或無此todo id");
            }
        })
    }else if(req.url == "/todos" && req.method == "DELETE"){  //刪除所有代辦
        todos.length = 0; //將陣列todos清空
        successHandle(res, 200, todos);
    }else if(req.url.startsWith('/todos/') && req.method == "DELETE"){ //刪除單筆代辦
        const id = req.url.split('/').pop(); // url格式: 127.0.0.1:3005/todos/uuid; split('/')存成陣列格式[127.0.0.1:3005, todos, uuid]; pop()為取出陣列最後一筆: 即取出uuid
        // console.log(id);
        const aryIndex = todos.findIndex(element => element.id == id);
        // console.log(aryIndex);
        if(aryIndex !== -1){  //todo id 存在 todos陣列中
            todos.splice(aryIndex,1); //從陣列索引位置開始刪除 1 筆資料
            successHandle(res, 200, todos);
        }else{
            errHandle(res, 400, "todo id 不存在todos陣列中");
        }
    }else if(req.url.startsWith('/todos/') && req.method == "PATCH"){
        req.on('end', ()=>{
            try{
                const updateTitle = JSON.parse(body).title;  // 請求編輯: body中的title
                // console.log(updateTitle);
                const id = req.url.split('/').pop();
                const aryIndex = todos.findIndex(element => element.id == id);
                // console.log(id, aryIndex);
                if(updateTitle !== undefined && aryIndex !==-1){ // 有title屬性且todo id存在todos陣列中
                    todos[aryIndex].title = updateTitle;  //更新todos陣列對應index的title資料
                    successHandle(res, 200, todos);
                }else{  //無title屬性 or todo id不存在todos陣列中
                    errHandle(res, 400, "編輯單筆資料, 找不到todo id 或 無title屬性值。");
                }
            }catch(err){
                errHandle(res, 400, "編輯單筆資料時，欄位填寫不正確");
            }
        })
    }else if(req.method == "OPTIONS"){
        res.writeHead(200, headers);
        res.end();
    }else{
        errHandle(res, 404, "無對應的路由");
    }
}

const server = http.createServer(requestListener);
server.listen(3005);