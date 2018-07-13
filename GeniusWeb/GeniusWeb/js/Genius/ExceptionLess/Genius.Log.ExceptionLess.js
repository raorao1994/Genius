/**
 * @文件名                Genius.Log.ExceptionLess.js
 * @作者                  陈兴旺
 * @命名空间              Genius.Log.ExceptionLess
 * @版本号和修改记录      0.5 
 * @日期和时间            2018-05-16
 * @说明                  exceptionless二次封装类，提供便捷的日志写入和简单的日志读取功能
 */
//自动加载依赖项
(function (window, document) {
    //初始化顶层命名空间
    if (!this["Genius"]) { Genius = {}; }
    //初始化Log命名空间
    if (Genius.Log == undefined) { Genius.Log = {}; }
    //获取当前JavaScript节点
	var scripts = document.getElementsByTagName("script")
	var script = scripts[scripts.length - 1];
    //获取当前JavaScript节点url
	strJsPath = document.querySelector ? script.src : script.getAttribute("src", 4);
	var path = strJsPath.substr(0, strJsPath.lastIndexOf('/'));
	//添加js配置文件脚本
	ajax(path + "/exceptionless.config.js", "get", {}, function (result) {
	    eval(result);
	})
	ajax(path + "/exceptionless.js", "get", {}, function (result) {
	    eval(result);
	})
    //访问日志类
	var ExceptionBaseLog = function (ApiKey, ServerUrl) {
	    //私有属性方法
	    var client = new exceptionless.ExceptionlessClient(ApiKey, ServerUrl);
	    /**
        *方法说明 Exception 异常日志写入
        *参数 erro 异常信息
        */
	    this.ThrowException = function (erro) {
	        client.submitException(erro);
	    }
	    /**
        *方法说明 日志写入
        *参数 msg 异常信息
        *参数 leve 异常级别(可空)，日志级别有这几种: Trace, Debug, Info, Warn, Error
        */
	    this.CreateLog = function (msg, leve) {
	        client.createLog("", msg, leve).submit();
	    }
	    /**
        *方法说明 FeatureUsage 功能用途日志写入
        *参数 msg 异常信息
        */
	    this.CreateFeatureUsage = function (msg) {
	        client.createFeatureUsage(msg).submit();
	    }
	    /**
        *方法说明 BrokenLinks 404错误日志写入
        *参数 msg 异常信息
        */
	    this.CreateNotFound = function (msg) {
	        client.createNotFound(msg).submit();
	    }
	};
	window.ExceptionBaseLog = ExceptionBaseLog;

    //判断默认配置信息是否存在
	if (!Genius.Log.ExceptionlessConfig.DefaultApiKey || !Genius.Log.ExceptionlessConfig.ServerUrl) {
	    console.log("missing Genius.Log.ExceptionlessConfig.DefaultApiKey or Genius.Log.ExceptionlessConfig.ServerUrl configuration item");
	    //alert("请设置Genius.Log.ExceptionlessConfig.DefaultApiKey、Genius.Log.ExceptionlessConfig.ServerUrl参数");
	}
	Genius.Log.ExceptionLess = {
	    _config: Genius.Log.ExceptionlessConfig,
	    defaultLog: new ExceptionBaseLog(Genius.Log.ExceptionlessConfig.DefaultApiKey, Genius.Log.ExceptionlessConfig.ServerUrl)
	};
    //判断是否配置了其他主题类型Log对象
	if (Genius.Log.ExceptionlessConfig.ApiKeys) {
	    for (var i = 0; i < Genius.Log.ExceptionlessConfig.ApiKeys.length; i++) {
	        var item = Genius.Log.ExceptionlessConfig.ApiKeys[i];
	        var Name = item["Name"];
	        var Key = item["Key"];
	        var Url = item["Url"];
	        if (!Url)
	            Url = Genius.Log.ExceptionlessConfig.ServerUrl;
	        Genius.Log.ExceptionLess[Name] = new ExceptionBaseLog(Key, Url);
	    }
	}
	Genius.Log.ExceptionLess.token = "";
	Genius.Log.ExceptionLess.Projects = [];
    //登录Exceptionless网站
    //判断是否存在账号密码
	if (!Genius.Log.ExceptionlessConfig.Email || !Genius.Log.ExceptionlessConfig.Password) {
	    console.log("missing Genius.Log.ExceptionlessConfig.email or Genius.Log.ExceptionlessConfig.password configuration item");
	    //alert("请设置Genius.Log.ExceptionlessConfig.email、Genius.Log.ExceptionlessConfig.password参数");
	}
    //获取查询服务各项参数
	var _data = {
	    "email": Genius.Log.ExceptionlessConfig.Email,
	    "password": Genius.Log.ExceptionlessConfig.Password,
	    "invite_token": "123456798"
	};
    //获取用户项目列表
	ajax(Genius.Log.ExceptionlessConfig.ServerUrl + "/api/v2/auth/login", "post", _data, function (result) {
	    var data = JSON.parse(result);
	    Genius.Log.ExceptionLess.token = data.token;
	    var _url = Genius.Log.ExceptionlessConfig.ServerUrl + "/api/v2/projects?access_token=" + data.token;
	    ajax(_url, "get", {}, function (result1) {
	        var data = JSON.parse(result1);
	        Genius.Log.ExceptionLess.Projects = data;
	    })
	});
    /*
    * 类说明 Genius.Log.ExceptionLess.Query实现对Exceptionless平台数据的查询
    */
	Genius.Log.ExceptionLess.Query = {
	    /*
        * 方法说明 GetAllCount 获取所有该用户所有数据条数
        * 参数说明 filter 过滤条件
        * 参数说明 callBack 回调函数
        */
	    GetAllCount: function (filter,callBack) {
	        if (Genius.Log.ExceptionLess.token == "") {
	            setTimeout(function () {
	                Genius.Log.ExceptionLess.Query.AllCount(callBack);
	            }, 500);
	            return;
	        }
	        var url = Genius.Log.ExceptionlessConfig.ServerUrl + "/api/v2/events/count?access_token=" + Genius.Log.ExceptionLess.token + "&filter=" + filter;
	        ajax(url, "get", {}, function (result) {
	            var data = JSON.parse(result);
	            callBack(data.total);
	        })
	    },
	    /*
        * 方法说明 GetCount 获取所有该用户,某项目的所有数据条数
        * 参数说明 projectName 项目名
        * 参数说明 filter 过滤器
        * 参数说明 callBack 回调函数
        */
	    GetCount: function (projectName, filter, callBack) {
	        if (Genius.Log.ExceptionLess.token == "") {
	            setTimeout(function () {
	                Genius.Log.ExceptionLess.Query.Count(projectName, filter, callBack);
	            }, 500);
	            return;
	        }
	        var organizationId = "";
	        //获取organization_id
	        for (var i = 0; i < Genius.Log.ExceptionLess.Projects.length; i++) {
	            if (Genius.Log.ExceptionLess.Projects[i].name == projectName) {
	                organizationId = Genius.Log.ExceptionLess.Projects[i].organization_id;
	            }
	        }
	        var url = Genius.Log.ExceptionlessConfig.ServerUrl + "/api/v2/organizations/" + organizationId + "/events/count?access_token=" + Genius.Log.ExceptionLess.token + "&filter=" + filter;
	        ajax(url, "get", {}, function (result) {
	            var data = JSON.parse(result);
	            callBack(data.total);
	        })
	    },
	    /*
        * 方法说明 GetPage 获取所有该用户某一页数据数据条数
        * 参数说明 filter 过滤器
        * 参数说明 page 第几页从1开始
        * 参数说明 pageNum 每页多少条数据
        * 参数说明 callBack 回调函数
        */
	    GetPage: function (filter, page, pageNum, callBack) {
	        if (Genius.Log.ExceptionLess.token == "") {
	            setTimeout(function () {
	                Genius.Log.ExceptionLess.Query.GetPage(projectName, filter, page, callBack);
	            }, 500);
	            return;
	        }
	        if (!pageNum) pageNum = 100;
	        var url = Genius.Log.ExceptionlessConfig.ServerUrl + "/api/v2/events?access_token=";
	        url = url + Genius.Log.ExceptionLess.token + "&limit=" + pageNum + "&filter=" + filter + "&page=" + page;
	        ajax(url, "get", {}, function (result) {
	            var data = JSON.parse(result);
	            callBack(data);
	        })
	    },
	    /*
        * 方法说明 GetProPage 获取所有该用户,某项目的某一页数据数据条数
        * 参数说明 projectName 项目名
        * 参数说明 filter 过滤器
        * 参数说明 page 第几页从1开始
        * 参数说明 pageNum 每页多少条数据
        * 参数说明 callBack 回调函数
        */
	    GetProjectPage: function (projectName, filter, page, pageNum,callBack) {
	        if (Genius.Log.ExceptionLess.token == "") {
	            setTimeout(function () {
	                Genius.Log.ExceptionLess.Query.GetPage(projectName, filter, page, callBack);
	            }, 500);
	            return;
	        }
	        if (!pageNum) pageNum = 100;
	        var organizationId = "";
	        //获取organization_id
	        for (var i = 0; i < Genius.Log.ExceptionLess.Projects.length; i++) {
	            if (Genius.Log.ExceptionLess.Projects[i].name == projectName) {
	                organizationId = Genius.Log.ExceptionLess.Projects[i].organization_id;
	            }
	        }
	        var url = Genius.Log.ExceptionlessConfig.ServerUrl + "/api/v2/organizations/" + organizationId + "/events?access_token=";
	        url = url + Genius.Log.ExceptionLess.token + "&limit=" + pageNum + "&filter=" + filter + "&page=" + page;
	        ajax(url, "get", {}, function (result) {
	            var data = JSON.parse(result);
	            callBack(data);
	        })
	    }
	};
    /*
    * ajax请求
    * url 请求路径
    * model 请求类型 post、get
    * data 请求数据
    * callback 回调函数，返回数据
    */
	function ajax(url, model, data, callback) {
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
	            //if(model=='post')
	            //    fd.append(item, data[item]);
	            //if(model=='get')
	            //    _url+=item+"="+data[item]+"&"
	        }
	    }
	    if (model == "get") {
	        url = url + "?" + _url;
	        url = url.substr(0, url.length - 1);
	    }
	    //打开连接
	    xhr.open(model, url, false);
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
	}

})(window, document);