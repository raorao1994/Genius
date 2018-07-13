1、直接引用Robin.Log.ExceptionLess.js文件，
2、js文件需要引用exceptionless.js和exceptionless.config.js动态库,会自动在同一文件夹下加载
3、需要在配置文件中设置相应节点，具体配置如下
Robin.Log.ExceptionlessConfig = {
    //Exceptionless网站地址
    ServerUrl: "http://172.30.80.25:9001",
    DefaultApiKey: "1ACDVYQ5B22wYbZijV4oEIvcXONusO6dFbAabQpS",
    Email: "123456789@qq.com",
    Password: "123456789",
    /*
    *Name Log对象的名称，Key为ApiKey,Url为ServerUrl（可为空，空的话则使用默认ServerUrl）
    */
    ApiKeys:[
        {Name: "AccessLog", Key: "1ACDVYQ5B22wYbZijV4oEIvcXONusO6dFbAabQpS", Url: "http://172.30.80.25:9001" },
        {Name:"SecurityLog",Key:"ZMqI3R4pyR1bpEwDlt0cJAHkDC6sPjWSdWASUu3C"},
        {Name:"OperationLog",Key:"erRzz8oHMbK9NDzQTzCpi5gGveh61OXqiUcBJGcx"},
        {Name:"SystemLog",Key:"VY8oKQ9pAU0ZwIcytrXP09GaAmWwjLXDMHNQD6xL"},
    ]
};
4、使用
写入：
Robin.Log.ExceptionLess.defaultLog.ThrowException(erro);
Robin.Log.ExceptionLess.defaultLog.CreateLog("log测试数据","Info");
Robin.Log.ExceptionLess.defaultLog.CreateFeatureUsage("功能用途日志");
Robin.Log.ExceptionLess.defaultLog.CreateNotFound("404错误日志");

Robin.Log.ExceptionLess.OperationLog.CreateFeatureUsage("功能用途日志");

读取：
//获取所有该用户所有数据条数
Robin.Log.ExceptionLess.Query.GetAllCount("",function (data) {
    alert(data);
});
//获取所有该用户,某项目的所有数据条数
Robin.Log.ExceptionLess.Query.GetCount("访问日志","",function (data) {
    console.log(data);
});
//获取所有该用户某一页数据数据条数
Robin.Log.ExceptionLess.Query.GetPage("level:Error",1,100,function (data) {
    console.log(data);
});
//获取所有该用户,某项目的某一页数据数据条数
Robin.Log.ExceptionLess.Query.GetProjectPage("访问日志","level:Error",1,100,function (data) {
    console.log(data);
});