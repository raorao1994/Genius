/**
 * Genius UI Framework
 * DataTables模块.
 * @author Created by RaoRao on 2018-06-05.
 * @version 1.0
 * @license Copyright (c) 2018 RaoRao
 * 官方文档URL：http://www.datatables.club/
 */

(function (window, document) {
	//初始化顶层命名空间
	if (!this["Genius"]) { Genius = {}; }
	//初始化DataTables命名空间
	if (Genius.DataTables == undefined) { Genius.DataTables = {}; }
	//判断是否加载jQuery
	if (!this["jQuery"]) { console.log("未加载jQuery.js文件，请在加载jQuery.js文件"); return; }
	//判断是否加载Genius.Core
	if (!this["Genius.Core"]) { console.log("未加载Genius.Core.js文件，请在加载Genius.Core.js文件"); return; }
	//自动加载jquery.dataTables依赖组件
	var path = Genius.Core.GetScriptPath();
	var src = path + "/jquery.dataTables.min.css";
	Genius.Core.LoadCss(src);
	Genius.Core.LoadJs(path + "/jquery.dataTables.min.js");
	

})(window, document);