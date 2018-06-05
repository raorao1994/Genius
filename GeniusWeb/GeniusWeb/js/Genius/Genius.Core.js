/**
 * Genius UI Framework
 * 核心基础公共方法模块.
 * @author Created by RaoRao on 2018-06-05.
 * @version 1.0
 * @license Copyright (c) 2018 RaoRao
 */

//初始化顶层命名空间
if (!this["Genius"]) { Genius = {}; }
//初始化Setting命名空间
if (!this["Genius.Core"]) { Genius.Core = {}; }

/**
*获取url QueryStrign参数 
*parameter that 为当前窗体对象，即this
*parameter paramName 参数名
*/
Genius.Core.GetParam = function (that, paramName) {
	paramValue = "";
	isFound = false;
	if (that.location.search.indexOf("?") == 0 && that.location.search.indexOf("=") > 1) {
		arrSource = unescape(that.location.search).substring(1, that.location.search.length).split("&");
		i = 0;
		while (i < arrSource.length && !isFound) {
			if (arrSource[i].indexOf("=") > 0) {
				if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
					paramValue = arrSource[i].split("=")[1];
					isFound = true;
				}
			}
			i++;
		}
	}
	return paramValue;
};

/**
*生成GUID
*/
Genius.Core.GUID = function () {
	this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
	if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
		Genius.Genius.GUID.prototype.newGUID = function () {
			this.date = new Date(); var guidStr = '';
			sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
			sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
			for (var i = 0; i < 9; i++) {
				guidStr += Math.floor(Math.random() * 16).toString(16);
			}
			guidStr += sexadecimalDate;
			guidStr += sexadecimalTime;
			while (guidStr.length < 32) {
				guidStr += Math.floor(Math.random() * 16).toString(16);
			}
			return this.formatGUID(guidStr);
		}
		/* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
		Genius.Genius.GUID.prototype.getGUIDDate = function () {
			return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
		}
		/* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
		Genius.Core.GUID.prototype.getGUIDTime = function () {
			return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
		}
		/* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
		Genius.Core.GUID.prototype.addZero = function (num) {
			if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
				return '0' + Math.floor(num);
			} else {
				return num.toString();
			}
		}
		/*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
		Genius.Core.GUID.prototype.hexadecimal = function (num, x, y) {
			if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
			else { return parseInt(num.toString()).toString(x); }
		}
		/* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
		Genius.Core.GUID.prototype.formatGUID = function (guidStr) {
			var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
			return str1 + str2 + str3 + str4 + str5;
		}
	}
}
/**
*处理时间格式
* new Date().Format("yyyy-MM-dd");
* new Date().Format("yyyy-MM-dd hh:mm:ss");
*/
Genius.Core.DateFormat = function (data, fmt) {
	var o = {
		"M+": data.getMonth() + 1,                 //月份 
		"d+": data.getDate(),                    //日 
		"h+": data.getHours(),                   //小时 
		"m+": data.getMinutes(),                 //分 
		"s+": data.getSeconds(),                 //秒 
		"q+": Math.floor((data.getMonth() + 3) / 3), //季度 
		"S": data.getMilliseconds()             //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};
/**
*获取最后一个Javascript文件的文件目录路径
*/
Genius.Core.GetScriptPath = function () {
	//获取当前路径
	var scripts = document.getElementsByTagName("script")
	var script = scripts[scripts.length - 1];
	//IE8直接.src
	strJsPath = document.querySelector ? script.src : script.getAttribute("src", 4);
	var path = strJsPath.substr(0, strJsPath.lastIndexOf('/'));
};
/*
* ajax请求
* url 请求路径
* model 请求类型 post、get
* data 请求数据
* async 是否为异步：false同步，true异步
* callback 回调函数，返回数据
*/
Genius.Core.Ajax = function (url, model, data, async, callback) {
	model = model.toLowerCase();
	//创建xml请求对象
	var xhr = new XMLHttpRequest();
	//创建数据
	var fd = new FormData();
	//添加数据到请求
	var _url = '';
	if (data) {
		for (var item in data) {
			_url += item + "=" + data[item] + "&";
			if (model == 'post')
				fd.append(item, data[item]);
			//if(model=='get')
			//    _url+=item+"="+data[item]+"&"
		}
	}
	if (model == "get") {
		url = url + "?" + _url;
		url = url.substr(0, url.length - 1);
	}
	//打开连接
	xhr.open(model, url, async);
	//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhr.onreadystatechange = function () {
		if (xhr.status == 200) {
			if (xhr.readyState == 4) {
				if (callback instanceof Function)
					callback(xhr.responseText);
			}
		} else {
			console.log(url + "请求失败");
		}
	}
	//发送数据
	xhr.send(_url);
};
/*
* 加载css样式
* url CSS url地址
*/
Genius.Core.LoadCss = function (url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(link);
};
/*
* 动态加载并执行js文件
* url js url地址
*/
Genius.Core.LoadJs = function (url) {
	Genius.Core.Ajax(url, "get", {}, false, function (result) {
		eval(result);
	});
};
