/**
 * @作者 RaoRao
 * @命名空间 Robin.Log.ExceptionLess
 */
//初始化顶层命名空间
if (!this["Robin"]) { Robin = {}; }
//初始化Log命名空间
if (!this["Robin.Log"]) { Robin.Log = {}; }

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

