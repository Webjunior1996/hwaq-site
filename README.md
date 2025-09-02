# hwaq-site
建站模板

所有说明见文档  https://shimo.im/docs/m4kMM5Lob9f7ZWkD
## version:20250604
增加阿拉伯语反向，当html[lang='sa']，basic.css 调整方向，slick.js已按照条件二开，请下载此版本。

## version:20250612
增加：  
1.当a链接为jpg,png.mp4时，不必再添加data属性，直接可打开fancybox;  
2.slick 添加 wap类 可在手机端时滚动数量*2 （填补某些图片在手机端过大）  
调整文件：index.html,basic.js  

## version:20250902
增加：  
1.手机版模板文件 可自由切换5种手机版 {include file="index/header-mobile" mobile="0" action="/product/" logo="logo.png" search="s"/}  
  // mobile 有五种选择 1-5  默认为0 随机  
  // action 搜索页面  
  // logo logo图片名称  
  // search 搜索参数名称  
2.调整main.less文件内容 移除默认手机版内容  
