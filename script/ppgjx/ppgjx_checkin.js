const scriptName = '皮皮工具箱签到';

let magicJS = MagicJS(scriptName, "INFO");

const getCookieRegex = /^https?:\/\/api\.ppgjx\.com\/app\/user\/(getInfo|sign)/;

const ppgjxTokenKey = "ppgjx_token";
const ppgjxUidKey = "ppgjx_uid";

/**
 * 签到
 * 
 * @returns 
 */
function checkIn() {
  // 要检测的URL
  let monitorUrl = 'https://api.ppgjx.com/app/user/sign?version=3.0.6&ch=ios';
  
  return new Promise((resolve, reject)=>{
    let token = magicJS.read(ppgjxTokenKey);
    let uid = magicJS.read(ppgjxUidKey);
    // magicJS.logInfo("Uid=" + uid + "; Token=" + token);
    // magicJS.logInfo($persistentStore.read(ppgjxUidKey))
    if(!token){
      reject("请先获取Cookie！！！");
      return;
    }

    let options = {
      url: monitorUrl,
      headers: {
        "Host": "api.ppgjx.com",
        "appid": "com.ppgjx",
        "uid": uid,
        "version": "3.0.6",
        "Accept": "*/*",
        "Accept-Language": "zh-Hans-CN;q=1",
        "Accept-Encoding": "gzip, deflate, br",
        "platform": "ios",
        "token": token,
        "language": "0",
        "User-Agent": "PPTool/3.0.6 (iPhone; iOS 15.4.1; Scale/3.00)",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "device": "iphone"
      },
      body: {}
    }
    magicJS.post(options, (err, resp, data)=>{
      if (err){
        magicJS.logError(`请求[URL=${options.url}]异常：${err}`);
        reject('❌请求[URL=${options.url}]异常，请查阅日志！');
      }else{
        try{
          let dataString = typeof data === 'string'? data : JSON.stringify(data);
          magicJS.logDebug(`请求[URL=${options.url}]成功！响应内容长度=${dataString.length}`);
          // 剩余可兑换数量
          let dataJsonObj = JSON.parse(data);
          let msg = "签到结果：" + dataJsonObj.msg;
          magicJS.logInfo(msg);
          resolve(msg);
        }catch(err){
          magicJS.logError(`请求[URL=${options.url}]执行异常：\n${err}，\n接口响应：\n${data}`);
          reject('❌执行响应内容发生异常，请查阅日志！');
        }
      }
    })
  })
}

/**
 * 获取Token
 * 
 * @returns 
 */
function getToken() {
  return new Promise((resolve, reject)=>{
    let token = magicJS.request.headers.token;
    let uid = magicJS.request.headers.uid;
    let hisToken = magicJS.read(ppgjxTokenKey);
    let hisUid = magicJS.read(ppgjxUidKey);
    if (token !== hisToken || uid !== hisUid) {
      magicJS.write(ppgjxTokenKey, token);
      magicJS.write(ppgjxUidKey, uid);
      magicJS.logInfo(`旧的Token：${hisToken}\n新的Token：${token}\nToken不同，写入新的Token成功！`);
      resolve("Token写入成功！！");
    } else {
      magicJS.logInfo("Token没有变化，无需更新");
    }
  })
}

(async () => {
  if (magicJS.isRequest && getCookieRegex.test(magicJS.request.url)) {
    let [rejectErr, resolveVal] = await magicJS.attempt(getToken(), "");
    if (resolveVal){
      // 通知
      magicJS.notify(scriptName, "", resolveVal);
    }
  } else {
    let [rejectErr, resolveVal] = await magicJS.attempt(checkIn(), "");
    if (resolveVal){
      // 通知
      magicJS.notify(scriptName, "", resolveVal);
    }
  }
  magicJS.done();
})();

// prettier-ignore
function MagicJS(e="MagicJS",t="INFO"){return new class{constructor(){if(this._startTime=Date.now(),this.version="2.2.3.7",this.scriptName=e,this.logLevels={DEBUG:5,INFO:4,NOTIFY:3,WARNING:2,ERROR:1,CRITICAL:0,NONE:-1},this.isLoon="undefined"!=typeof $loon,this.isQuanX="undefined"!=typeof $task,this.isJSBox="undefined"!=typeof $drive,this.isNode="undefined"!=typeof module&&!this.isJSBox,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.node={request:void 0,fs:void 0,data:{}},this.iOSUserAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1",this.pcUserAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59",this._logLevel="INFO",this.logLevel=t,this._barkUrl="",this._barkKey="",this.isNode){this.node.fs=require("fs"),this.node.request=require("request");try{this.node.fs.accessSync("./magic.json",this.node.fs.constants.R_OK|this.node.fs.constants.W_OK)}catch(e){this.node.fs.writeFileSync("./magic.json","{}",{encoding:"utf8"})}this.node.data=require("./magic.json")}else this.isJSBox&&($file.exists("drive://MagicJS")||$file.mkdir("drive://MagicJS"),$file.exists("drive://MagicJS/magic.json")||$file.write({data:$data({string:"{}"}),path:"drive://MagicJS/magic.json"}))}set barkUrl(e){try{let t=e.replace(/\/+$/g,"");this._barkUrl=`${/^https?:\/\/([^/]*)/.exec(t)[0]}/push`,this._barkKey=/\/([^\/]+)\/?$/.exec(t)[1]}catch(e){this.logDebug("Bark config error.")}}set logLevel(e){let t=this.read("magicjs_loglevel");this._logLevel=t||e.toUpperCase()}get logLevel(){return this._logLevel}get isRequest(){return"undefined"!=typeof $request&&"undefined"==typeof $response}get isResponse(){return"undefined"!=typeof $response}get isDebug(){return"DEBUG"===this.logLevel}get request(){return"undefined"!=typeof $request?$request:void 0}get response(){return"undefined"!=typeof $response?($response.hasOwnProperty("status")&&($response.statusCode=$response.status),$response.hasOwnProperty("statusCode")&&($response.status=$response.statusCode),$response):void 0}get platform(){return this.isSurge?"Surge":this.isQuanX?"Quantumult X":this.isLoon?"Loon":this.isJSBox?"JSBox":this.isNode?"Node.js":"Unknown"}read(e,t=""){let s="";this.isSurge||this.isLoon?s=$persistentStore.read(e):this.isQuanX?s=$prefs.valueForKey(e):this.isNode?s=this.node.data:this.isJSBox&&(s=$file.read("drive://MagicJS/magic.json").string);try{this.isNode&&(s=s[e]),this.isJSBox&&(s=JSON.parse(s)[e]),t&&("string"==typeof s&&(s=JSON.parse(s)),s=s&&"object"==typeof s?s[t]:null)}catch(i){this.logError(i),s=t?{}:null,this.del(e)}void 0===s&&(s=null);try{if(s&&"string"==typeof s){var i=JSON.parse(s);"object"==typeof i&&i&&(s=i)}}catch(e){}return this.logDebug(`READ DATA [${e}]${t?`[${t}]`:""}(${typeof s})\n${JSON.stringify(s)}`),s}write(e,t,s=""){let i=s?{}:"";if(s&&(this.isSurge||this.isLoon)?i=$persistentStore.read(e):s&&this.isQuanX?i=$prefs.valueForKey(e):this.isNode?i=this.node.data:this.isJSBox&&(i=JSON.parse($file.read("drive://MagicJS/magic.json").string)),s){try{"string"==typeof i&&(i=JSON.parse(i)),i="object"==typeof i&&i?i:{}}catch(t){this.logError(t),this.del(e),i={}}this.isJSBox||this.isNode?(i[e]&&"object"==typeof i[e]||(i[e]={}),i[e].hasOwnProperty(s)||(i[e][s]=null),void 0===t?delete i[e][s]:i[e][s]=t):void 0===t?delete i[s]:i[s]=t}else this.isNode||this.isJSBox?void 0===t?delete i[e]:i[e]=t:i=void 0===t?null:t;"object"==typeof i&&(i=JSON.stringify(i)),this.isSurge||this.isLoon?$persistentStore.write(i,e):this.isQuanX?$prefs.setValueForKey(i,e):this.isNode?this.node.fs.writeFileSync("./magic.json",i):this.isJSBox&&$file.write({data:$data({string:i}),path:"drive://MagicJS/magic.json"}),this.logDebug(`WRITE DATA [${e}]${s?`[${s}]`:""}(${typeof t})\n${JSON.stringify(t)}`)}del(e,t=""){this.logDebug(`DELETE KEY [${e}]${t?`[${t}]`:""}`),this.write(e,null,t)}notify(e=this.scriptName,t="",s="",i=""){if(i=(e=>{let t={};if("string"==typeof e)this.isLoon?t={openUrl:e}:this.isQuanX?t={"open-url":e}:this.isSurge&&(t={url:e});else if("object"==typeof e)if(this.isLoon)t.openUrl=e["open-url"]?e["open-url"]:"",t.mediaUrl=e["media-url"]?e["media-url"]:"";else if(this.isQuanX)t=e["open-url"]||e["media-url"]?e:{};else if(this.isSurge){let s=e["open-url"]||e.openUrl;t=s?{url:s}:{}}return t})(i),1==arguments.length&&(e=this.scriptName,t="",s=arguments[0]),this.logNotify(`title:${e}\nsubTitle:${t}\nbody:${s}\noptions:${"object"==typeof i?JSON.stringify(i):i}`),this.isSurge)$notification.post(e,t,s,i);else if(this.isLoon)i?$notification.post(e,t,s,i):$notification.post(e,t,s);else if(this.isQuanX)$notify(e,t,s,i);else if(this.isJSBox){let i={title:e,body:t?`${t}\n${s}`:s};$push.schedule(i)}this._barkUrl&&this._barkKey&&this.notifyBark(e,t,s)}notifyDebug(e=this.scriptName,t="",s="",i=""){"DEBUG"===this.logLevel&&(1==arguments.length&&(e=this.scriptName,t="",s=arguments[0]),this.notify(e,t,s,i))}notifyBark(e=this.scriptName,t="",s="",i=""){let o={url:this._barkUrl,headers:{"Content-Type":"application/json; charset=utf-8"},body:{title:e,body:t?`${t}\n${s}`:s,device_key:this._barkKey}};this.post(o,e=>{})}log(e,t="INFO"){this.logLevels[this._logLevel]<this.logLevels[t.toUpperCase()]||console.log(`[${t}] [${this.scriptName}]\n${e}\n`)}logDebug(e){this.log(e,"DEBUG")}logInfo(e){this.log(e,"INFO")}logNotify(e){this.log(e,"NOTIFY")}logWarning(e){this.log(e,"WARNING")}logError(e){this.log(e,"ERROR")}logRetry(e){this.log(e,"RETRY")}adapterHttpOptions(e,t){let s="object"==typeof e?Object.assign({},e):{url:e,headers:{}};s.hasOwnProperty("header")&&!s.hasOwnProperty("headers")&&(s.headers=s.header,delete s.header),s.headers&&"object"==typeof s.headers&&s.headers["User-Agent"]||(s.headers&&"object"==typeof s.headers||(s.headers={}),this.isNode?s.headers["User-Agent"]=this.pcUserAgent:s.headers["User-Agent"]=this.iOSUserAgent);let i=!1;if(("object"==typeof s.opts&&(!0===s.opts.hints||!0===s.opts["Skip-Scripting"])||"object"==typeof s.headers&&!0===s.headers["X-Surge-Skip-Scripting"])&&(i=!0),i||(this.isSurge?s.headers["X-Surge-Skip-Scripting"]=!1:this.isLoon?s.headers["X-Requested-With"]="XMLHttpRequest":this.isQuanX&&("object"!=typeof s.opts&&(s.opts={}),s.opts.hints=!1)),this.isSurge&&!i||delete s.headers["X-Surge-Skip-Scripting"],!this.isQuanX&&s.hasOwnProperty("opts")&&delete s.opts,this.isQuanX&&s.hasOwnProperty("opts")&&delete s.opts["Skip-Scripting"],"GET"===t&&!this.isNode&&s.body){let e=Object.keys(s.body).map(e=>void 0===s.body?"":`${encodeURIComponent(e)}=${encodeURIComponent(s.body[e])}`).join("&");s.url.indexOf("?")<0&&(s.url+="?"),s.url.lastIndexOf("&")+1!=s.url.length&&s.url.lastIndexOf("?")+1!=s.url.length&&(s.url+="&"),s.url+=e,delete s.body}return this.isQuanX?(s.hasOwnProperty("body")&&"string"!=typeof s.body&&(s.body=JSON.stringify(s.body)),s.method=t):this.isNode?(delete s.headers["Accept-Encoding"],"object"==typeof s.body&&("GET"===t?(s.qs=s.body,delete s.body):"POST"===t&&(s.json=!0,s.body=s.body))):this.isJSBox&&(s.header=s.headers,delete s.headers),s}adapterHttpResponse(e){let t={body:e.body,headers:e.headers,json:()=>JSON.parse(t.body)};return e.hasOwnProperty("statusCode")&&e.statusCode&&(t.status=e.statusCode),t}get(e,t){let s=this.adapterHttpOptions(e,"GET");this.logDebug(`HTTP GET: ${JSON.stringify(s)}`),this.isSurge||this.isLoon?$httpClient.get(s,t):this.isQuanX?$task.fetch(s).then(e=>{e.status=e.statusCode,t(null,e,e.body)},e=>t(e.error,null,null)):this.isNode?this.node.request.get(s,(e,s,i)=>{s=this.adapterHttpResponse(s),t(e,s,i)}):this.isJSBox&&(s.handler=(e=>{let s=e.error?JSON.stringify(e.error):void 0,i="object"==typeof e.data?JSON.stringify(e.data):e.data;t(s,e.response,i)}),$http.get(s))}getPromise(e){return new Promise((t,s)=>{magicJS.get(e,(e,i)=>{e?s(e):t(i)})})}post(e,t){let s=this.adapterHttpOptions(e,"POST");if(this.logDebug(`HTTP POST: ${JSON.stringify(s)}`),this.isSurge||this.isLoon)$httpClient.post(s,t);else if(this.isQuanX)$task.fetch(s).then(e=>{e.status=e.statusCode,t(null,e,e.body)},e=>{t(e.error,null,null)});else if(this.isNode){let e=this.node.request.post(s,t);e.status=e.statusCode,delete e.statusCode}else this.isJSBox&&(s.handler=(e=>{let s=e.error?JSON.stringify(e.error):void 0,i="object"==typeof e.data?JSON.stringify(e.data):e.data;t(s,e.response,i)}),$http.post(s,{}))}done(e={}){this._endTime=Date.now();let t=(this._endTime-this._startTime)/1e3;magicJS.logDebug(`SCRIPT COMPLETED: ${t}S.`),"undefined"!=typeof $done&&$done(e)}isToday(e){if(null==e)return!1;{let t=new Date;return"string"==typeof e&&(e=new Date(e)),t.getFullYear()==e.getFullYear()&&t.getMonth()==e.getMonth()&&t.getDay()==e.getDay()}}isNumber(e){return"NaN"!==parseFloat(e).toString()}attempt(e,t=null){return e.then(e=>[null,e]).catch(e=>(this.logError(e),[e,t]))}retry(e,t=5,s=0,i=null){return(...o)=>new Promise((r,n)=>{(function o(...a){Promise.resolve().then(()=>e.apply(this,a)).then(e=>{"function"==typeof i?Promise.resolve().then(()=>i(e)).then(()=>{r(e)}).catch(e=>{t>=1?s>0?setTimeout(()=>o.apply(this,a),s):o.apply(this,a):n(e),t--}):r(e)}).catch(e=>{this.logRetry(e),t>=1&&s>0?setTimeout(()=>o.apply(this,a),s):t>=1?o.apply(this,a):n(e),t--})}).apply(this,o)})}formatTime(e,t="yyyy-MM-dd hh:mm:ss"){var s={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}now(){return this.formatTime(new Date,"yyyy-MM-dd hh:mm:ss")}today(){return this.formatTime(new Date,"yyyy-MM-dd")}sleep(e){return new Promise(t=>setTimeout(t,e))}}(e)}