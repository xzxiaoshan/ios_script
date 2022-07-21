const scriptName = '月刷月有礼';

let magicJS = MagicJS(scriptName, "INFO");

// 检测指定的url响应结果中是否包含对应正则表达式匹配的内容
function monitorUrlContent(){  
  // 要检测的URL
  let monitorUrl = 'https://jf.ccb.com/towOnejsonIndex.html';
  // 检测响应结果的正则表达式  
  let monitorContentRegex = /月刷月有礼7月/;
  
  return new Promise((resolve, reject)=>{
    let options = {
      url: monitorUrl,
      headers: {
        "Host": "jf.ccb.com"
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        "Accept-Language": "zh,zh-CN;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"
        "Accept-Encoding": "gzip, deflate, br"
        "Connection": "keep-alive"
        "Cookie": "null=!a8SwlbV10sA1mDJOOJWst9It/d76v7/BqprEJ073Mp2/ZJYAf3Fxueo3phJ7jrIrYgNYqCDM5UR87PTC64XClaKpc+GAoCjJE+n3kQXg"
        "Upgrade-Insecure-Requests": "1"
        "Sec-Fetch-Dest": "document"
        "Sec-Fetch-Mode": "navigate"
        "Sec-Fetch-Site": "none"
        "Sec-Fetch-User": "?1"
      }
    }
    magicJS.get(options, (err, resp, data)=>{
      if (err){
        magicJS.logError(`请求[URL=${options.url}]异常：${err}`);
        reject('请求[URL=${options.url}]异常，请查阅日志！');
      }else{
        try{
          let dataString = typeof data === 'string'? data : JSON.stringify(data);
          magicJS.logDebug(`请求[URL=${options.url}]成功！响应内容长度=${dataString.length}`);
                    
          // js正则匹配
          if (dataString.match(monitorContentRegex)){     
            let msg = `发现需要检测的内容！URL=${options.url}`;
            magicJS.logInfo(msg);
            resolve(msg);
          }else{
            let msg = `未发现需要检测的内容！URL=${options.url}`;
            magicJS.logInfo(msg);
            resolve(msg);
          }
        }catch(err){
          magicJS.logError(`请求[URL=${options.url}]执行异常：${err}，接口响应：${data}`);
          reject('执行响应内容发生异常，请查阅日志！');
        }
      }
    })
  })
}

;(async()=>{
    let [rejectErr, resolveVal] = await magicJS.attempt(monitorUrlContent, []);
    let notifyMsg;
    if (rejectErr){
      notifyMsg = rejectErr;
    }else{
      notifyMsg = resolveVal;
    }
    // 通知
    magicJS.notify(scriptName, "", notifyMsg);
  }
  magicJS.done();
})();

