console.log('>>>>>>>>>>>> 最红星期五商品详情页按钮提前显示 script start');
var resBody = JSON.parse($response.body);

//05是???，12是次数用完，02是未开始
if(resBody.data.buttonType == '02'){
  resBody.data.buttonType = '01';
}

$done({body: JSON.stringify(resBody)});
