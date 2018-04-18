/**
 * 有道词典划词扩展 V3 - 可记录、导出查询历史的有道词典划词扩展
 * @version v3.2.4.1
 * @author g8up
 */
"use strict";const set=(e,t)=>new Promise((n,a)=>{chrome.storage.sync.set({[e]:t},()=>{n()})}).catch(e=>{console.warn(e)}),get=e=>new Promise((t,n)=>{chrome.storage.sync.get(e,e=>{t(e)})}).catch(e=>{console.warn(e)});var chromeSync={set:set,get:get};class Storage{constructor(e,t){this.name=e,this.defaultValue=t}}var OPTION_STORAGE_ITEM="Setting";const DEFAULT={dict_enable:["checked",!1],ctrl_only:["checked",!0],english_only:["checked",!0],auto_speech:["checked",!0],history_count:5};class Setting extends Storage{constructor(){super(OPTION_STORAGE_ITEM,DEFAULT)}get(){return chromeSync.get(this.name).then(e=>{let t=this.defaultValue;return e&&Object.keys(e).length>0&&(t=e[this.name]),t})}set(e){return chromeSync.set(this.name,e)}}function isJapanese(e){return!/[^\u0800-\u4e00]/.test(e)}function isKoera(e){for(var t=0,n=e.length;t<n;t++)if(e.charCodeAt(t)>12592&&e.charCodeAt(t)<12687||e.charCodeAt(t)>=44032&&e.charCodeAt(t)<=55203)return!0;return!1}function isContainJapanese(e){for(var t=0,n=0,a=e.length;n<a;n++)isJapanese(e.charAt(n))&&t++;return t>2}function isContainKoera(e){for(var t=0,n=0,a=e.length;n<a;n++)isKoera(e.charAt(n))&&t++;return t>0}function qs(e){return Object.keys(e).map(function(t){return t+"="+encodeURIComponent(e[t])}).join("&")}var noop=function(){},ajax=function(e){var t=e.url,n=e.type||"GET",a=(e.dataType||"").toLowerCase(),o=e.data,s=e.success||noop,r=(e.error,new XMLHttpRequest);r.onreadystatechange=function(e){if(4==r.readyState&&200==r.status){var t=r.responseText;"json"===a||"xml"===a&&(t=r.responseXML),s(t)}};var i=qs(o);"GET"===n&&(t+="?"+i),r.open(n,t,!0),r.send("GET"===n?null:i)},setting=new Setting,Options=null;function genTable(e,t,n,a,o,s,r){var i="";isContainKoera(e)&&(i="&le=ko"),isContainJapanese(e)&&(i="&le=jap");var d="",c=(a&&o?"http://www.youdao.com/search?keyfrom=chrome.extension&ue=utf8":"http://dict.youdao.com/search?keyfrom=chrome.extension")+"&q="+encodeURIComponent(e)+i;return d=['<div id="yddContainer">','<div class="yddTop" class="ydd-sp">','<div class="yddTopBorderlr">','<a class="yddKeyTitle" href="',c,'" target=_blank title="查看完整释义">',e,"</a>",'<span class="ydd-phonetic" style="font-size:10px;">',n,"</span>",'<span class="ydd-voice">',t,"</span>",'<a class="ydd-detail" href="http://www.youdao.com/search?q=',encodeURIComponent(e),'&ue=utf8&keyfrom=chrome.extension" target=_blank>详细</a>','<a class="ydd-detail" href="#" id="addToNote" title="添加到单词本">+</a>','<a class="ydd-close" href="javascript:void(0);">&times;</a>',"</div>","</div>",'<div class="yddMiddle">'].join(""),a&&o?d+='<div class="no-result">没有英汉互译结果<br/><a href="'+c+'" target=_blank>请尝试网页搜索</a></div>':(d+=0==a?renderTransDetail("基本翻译",s):"",d+=0==o?renderTransDetail("网络释义",r):""),d+="</div></div>"}function renderTransDetail(e,t){return['<div class="ydd-trans-wrapper">','<div class="ydd-tabs">','<span class="ydd-tab">',e,"</span>","</div>",t,"</div>"].join("")}function translateXML(e){var t=!1,n=!1,a=e.getElementsByTagName("yodaodict")[0],o={phrase:"return-phrase",speach:"dictcn-speach",lang:"lang",phonetic:"phonetic-symbol"},s={};for(var r in o){var i=o[r];if((i=a.getElementsByTagName(i)).length){var d=i[0].childNodes[0];if("undefined"!=d){s[r]=d.nodeValue;continue}}s[r]=""}var c=s.phrase;s.phonetic&&(s.phonetic="["+s.phonetic+"]");var l="",u=a.getElementsByTagName("translation");if(u.length)if(void 0===u[0].childNodes[0])t=!0;else for(var p=0;p<u.length;p++){l+='<div class="ydd-trans-container">'+u[p].getElementsByTagName("content")[0].textContent+"</div>"}else t=!0;var h="",g=a.getElementsByTagName("web-translation");if(g.length)if(void 0===g[0].childNodes[0])n=!0;else for(p=0;p<g.length;p++){r=g[p].getElementsByTagName("key")[0].childNodes[0].nodeValue;var m=g[p].getElementsByTagName("trans")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;h+='<div class="ydd-trans-container"><a href="http://dict.youdao.com/search?q='+encodeURIComponent(r)+"&keyfrom=chrome.extension&le="+s.lang+'" target=_blank>'+r+":</a> ",h+=m+"<br /></div>"}else n=!0;return genTable(c,s.speach,s.phonetic,t,n,l,h)}function translateTransXML(e){var t=e.indexOf("CDATA["),n=e.indexOf("]]"),a=e.substring(t+6,n),o=e.substring(n+2,e.length-1);t=o.indexOf("CDATA["),n=o.indexOf("]]");var s=o.substring(t+6,n);return trans_str_tmp=s.trim(),input_str_tmp=a.trim(),(isContainChinese(input_str_tmp)||isContainJapanese(input_str_tmp)||isContainKoera(input_str_tmp))&&input_str_tmp.length>15?input_str_tmp=input_str_tmp.substring(0,8)+" ...":input_str_tmp.length>25&&(input_str_tmp=input_str_tmp.substring(0,15)+" ..."),trans_str_tmp==input_str_tmp?null:['<div id="yddContainer">','<div class="yddTop" class="ydd-sp">','<div class="yddTopBorderlr">','<a class="ydd-icon" href="http://fanyi.youdao.com/translate?i='+encodeURIComponent(a)+'&keyfrom=chrome" target=_blank">有道词典</a>',"<span>"+input_str_tmp.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")+"</span>",'<a href="http://fanyi.youdao.com/translate?i='+encodeURIComponent(a)+'&smartresult=dict&keyfrom=chrome.extension" target=_blank>详细</a>','<a class="ydd-close">&times;</a>',"</div>","</div>",'<div class="yddMiddle">','<div class="ydd-trans-wrapper">','<div class="ydd-trans-container">',s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),"</div>","</div>","</div>","</div>"].join("")}function fetchWordOnline(e,t){ajax({url:"http://dict.youdao.com/fsearch",data:{client:"deskdict",keyfrom:"chrome.extension",xmlVersion:"3.2",dogVersion:"1.0",ue:"utf8",q:e,doctype:"xml",pos:"-1",vendor:"unknown",appVer:"3.1.17.4208",le:isContainKoera(e)?"ko":"eng"},dataType:"xml",success:function(e){var n=translateXML(e);null!=n&&t(n)}})}function fetchTranslate(e,t){ajax({url:"http://fanyi.youdao.com/translate",data:{client:"deskdict",keyfrom:"chrome.extension",xmlVersion:"1.1",dogVersion:"1.0",ue:"utf8",i:e,doctype:"xml"},dataType:"xml",success:function(e){var n=translateTransXML(e);null!=n&&t({data:n})}})}function publishOptionChangeToTabs(e){chrome.tabs.query({status:"complete"},function(t){t.length&&t.forEach(function(t){chrome.tabs.sendMessage(t.id,{optionChanged:e},function(e){})})})}function playAudio$1(e){var t="http://dict.youdao.com/speech?audio="+e,n=document.createElement("audio");n.autoplay=!0,n.src=t}setting.get().then(function(e){Options=e}),chrome.storage.onChanged.addListener(function(e,t){if("sync"===t)for(var n in e)if(n===OPTION_STORAGE_ITEM){var a=e[n];Object.assign(Options,a.newValue),console.log(Options),publishOptionChangeToTabs(Options);break}}),chrome.runtime.onMessage.addListener(function(e,t,n){switch(e.action){case"getOption":return setting.get().then(function(e){n({option:e})}),!0;case"dict":return fetchWordOnline(e.word,n),!0;case"translate":return fetchTranslate(e.word,n),!0;case"speech":playAudio$1(e.word);break;case"login-youdao":loginYoudao();break;case"youdao-add-word":return addWord(e.word,function(){popBadgeTips("OK","green"),n()},function(){loginYoudao()}),!0}});var YouDaoLoginUrl="http://dict.youdao.com/wordbook/wordlist";function loginYoudao(){chrome.tabs.create({url:YouDaoLoginUrl},function(e){})}var YouDaoAddWordUrl="http://dict.youdao.com/wordbook/ajax";function addWord(e,t,n){ajax({url:YouDaoAddWordUrl,data:{action:"addword",le:"eng",q:e},dataType:"json",success:function(e){var a=e.message;"adddone"===a?t&&t():"nouser"===a&&n&&n()}})}function setBadge(e,t){chrome.browserAction.setBadgeText({text:e}),t&&chrome.browserAction.setBadgeBackgroundColor({color:t})}function hideBadge(){setBadge("","")}function popBadgeTips(e,t){setBadge(e+"",t),setTimeout(hideBadge,3e3)}