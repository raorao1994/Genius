using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//[assembly: log4net.Config.XmlConfigurator(Watch = true)]
namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                throw new Exception("这是我的错误信息");
            }
            catch (Exception ex)
            {
                Genius.Log.LogOperater.Debug(ex, "Debug");
                Genius.Log.LogOperater.Info(ex, "Info");
                Genius.Log.LogOperater.Error(ex, "Error");
                Genius.Log.LogOperater.Fatal(ex, "Fatal");
                Genius.Log.LogOperater.Warn(ex, "Warn");
            }
            //log4net.ILog log = log4net.LogManager.GetLogger("12133");
            //log.Error("Error", new Exception("测试错误"));
            Console.WriteLine("完成");
            Console.Read();
        }
    }
}
