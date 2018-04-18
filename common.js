/**
 * 有道词典划词扩展 V3 - 可添加单词本，记录、导出查询历史！
 * @version v3.2.3
 * @link https://github.com/g8up/youDaoDict
 * @author g8up
 */
!function(o){var e=!1,n={dict_enable:["checked",!1],ctrl_only:["checked",!0],english_only:["checked",!0],auto_speech:["checked",!0],history_count:5};o.log=function(){e&&console.debug.apply(console,arguments)};var c=function(o,e){for(var n in o){var c=e[n];"undefined"!=typeof c&&(o[n]=c)}},l=localStorage.ColorOptions;l?c(n,JSON.parse(l)):localStorage.ColorOptions=JSON.stringify(n),o.Options=n}(window);