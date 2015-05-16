#-*-coding:utf-8-*-

import sys 
import json
import Image
import pycurl
import urllib
import StringIO
import tempfile
import ImageFilter  
import ImageEnhance 
import threading
import datetime
import urllib2
 
import tornado.locale
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from pytesser import *  
from hashlib import md5
from datetime import datetime
from BeautifulSoup import BeautifulSoup
from tornado.options import define, options

if __name__ == "__main__":
    define("port", default=8000, type=int, help="run on the given port")

class Application(tornado.web.Application):
    def __init__(self):
        self.array = {"mkebiao":"","skebiao":"","gkebiao":""}
        handlers = [
            (r"/search",KebiaoHandler),
        ]
        settings = dict(
            debug=True
        )

        tornado.web.Application.__init__(self,handlers=handlers,**settings)


class KebiaoHandler(tornado.web.RequestHandler):
    def post(self):
        SID = self.get_argument("SID",None)
        password = self.get_argument("password",None)
        tpassword = self.get_argument("tpassword",None)
        if not SID:
            no_username = {
                    "errmsg":"no_username",
                    "errcode":1
            }
            self.write(no_username)
            return
        if not password:
            no_password = {
                    "errmsg":"no_password",
                    "errcode":1
            }
            self.write(no_password)
            return

        threads = []
        t1 = threading.Thread(target=self.KebiaoParse,args=(SID,password))
        threads.append(t1)
        t2 = threading.Thread(target=self.ShiyanParse,args=(SID,password))
        threads.append(t2)
        t3 = threading.Thread(target=self.GongParse,args=(SID,tpassword))
        threads.append(t3)
       
        for t in threads:
            t.setDaemon(True)
            t.start()
        for t in threads:
            t.join()

        #messages = json.dumps(self.application.array)
        #self.render("kebiao.html",message=messages)
        self.set_header("Access-Control-Allow-Origin","*")
        self.write(json.dumps(self.application.array))
    def on_finish(self):
        self.application.array = {"mkebiao":"","skebiao":"","gkebiao":""}
        #self.kebiao = json.dumps({"html":self.html,"shtml":self.shtml,"ghtml":ghtml})

    def KebiaoParse(self,SID,password):
        login_url =  "http://202.202.1.176:8080/_data/index_login.aspx"
        core_url = "http://202.202.1.176:8080/znpk/Pri_StuSel_rpt.aspx"
        hash_value = md5(SID+md5(password).hexdigest()[0:30].upper()+"10611").hexdigest()[0:30].upper()
        postdate = urllib.urlencode({
                'Sel_Type' : 'STU',
                'txt_dsdsdsdjkjkjc' : SID,
                'txt_dsdfdfgfouyy' : password,
                'txt_ysdsdsdskgf' : "",
                "pcInfo" : "Mozilla%2F4.0+%28compatible%3B+MSIE+7.0%3B+Windows+NT+6.1%3B+Trident%2F7.0%3B+SLCC2%3B+.NET+CLR+2.0.50727%3B+.NET+CLR+3.5.30729%3B+.NET+CLR+3.0.30729%3B+Media+Center+PC+6.0%3B+.NET4.0C%29x860+SN%3ANULL",
                "typeName" : "%D1%A7%C9%FA",
                "aerererdsdxcxdfgfg" : "",
                "efdfdfuuyyuuckjg" : hash_value

                        })
        postcore = urllib.urlencode({
                        "Sel_XNXQ":'20141',
                        "rad":"on",
                        "px":"1",
                        'Submit01':'%BC%EC%CB%F7',
                        })
        #user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
        #headers = {'User_agent':self.user_agent}
        headers = [
            "Accept: image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, imagepeg, application/x-ms-xbap, */*",
            "Referer: http://202.202.1.176:8080/_data/index_login.aspx",
            "Accept-Language: zh-CN",
            "User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)",
            "Cookie: safedog-flow-item=6760F1067699A299F8CFAFC5221309D7; ASP.NET_SessionId=cnclfc45ela5vh55mrcrao45",
            "Content-Type: application/x-www-form-urlencoded",
            "Accept-Encoding: gzip, deflate",
            "Connection: Keep-Alive",
            "DNT: 1",
            "Host: 202.202.1.176:8080"
            ]
        c = pycurl.Curl()
        fp = StringIO.StringIO()
        c.setopt(pycurl.URL,login_url)
        c.setopt(c.WRITEFUNCTION,fp.write)
        c.setopt(pycurl.FOLLOWLOCATION,1)
        c.setopt(pycurl.MAXREDIRS,5)
        #c.setopt(pycurl.PROXY,"183.203.22.76:80")
        c.setopt(pycurl.CONNECTTIMEOUT,60)
        #c.setopt(pycurl.USERAGENT,user_agent)
        c.setopt(pycurl.HTTPHEADER,headers)
        c.setopt(pycurl.POSTFIELDS,postdate)
        c.setopt(pycurl.COOKIEFILE,"")
        c.perform()

        c.setopt(pycurl.URL,core_url)
        c.setopt(pycurl.POSTFIELDS,postcore)
        c.setopt(c.WRITEFUNCTION,fp.write)
        c.setopt(pycurl.COOKIEFILE,"")
        c.perform()
        html = fp.getvalue().decode("gbk")

        x =html.find("节次".decode("utf-8"))
        data = html[x:]
        soup = BeautifulSoup(data,fromEncoding='gbk')
        x=soup("td")
        
        kebiao_dict = {"序号":[],"课程":[],"任课教师":[],"周次":[],"节次":[],"地点":[]}
        for i in range(len(x)):
            if i%13 == 0:
                kebiao_dict["序号"].append(x[i].text)
            if i%13 == 1:
                kebiao_dict["课程"].append(x[i].text)
            if i%13 == 9:
                kebiao_dict["任课教师"].append(x[i].text)
            if i%13 == 10:
                kebiao_dict["周次"].append(x[i].text)
            if i%13 == 11:
                kebiao_dict["节次"].append(x[i].text)
            if i%13 == 12:
                kebiao_dict["地点"].append(x[i].text)
        #kebiao_json = json.dumps(kebiao_dict)
        self.application.array["mkebiao"] = kebiao_dict

    def ShiyanParse(self,SID,password):
        slogin_url = "http://syjx.cqu.edu.cn/login"
        kebiao_url = "http://syjx.cqu.edu.cn/admin/schedule/getPrintStudentSchedule" 
        spostdate = urllib.urlencode({
                    "username":SID,
                    "password":md5(password).hexdigest()
            })
        sspostdate = urllib.urlencode({"stuNum":SID})
        suser_agent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36"
        c = pycurl.Curl()
        fp = StringIO.StringIO()
        c.setopt(pycurl.URL,slogin_url)
        c.setopt(c.WRITEFUNCTION,fp.write)
        c.setopt(pycurl.FOLLOWLOCATION,1)
        c.setopt(pycurl.MAXREDIRS,5)
        c.setopt(pycurl.CONNECTTIMEOUT,60)
        c.setopt(pycurl.USERAGENT,suser_agent)
        c.setopt(pycurl.POSTFIELDS,spostdate)
        c.setopt(pycurl.COOKIEFILE,"")
        c.perform()

        c.setopt(pycurl.URL,kebiao_url)
        c.setopt(c.WRITEFUNCTION,fp.write)
        c.setopt(pycurl.USERAGENT,suser_agent)
        c.setopt(pycurl.POSTFIELDS,sspostdate)
        c.setopt(pycurl.COOKIEFILE,"")
        c.perform()
        shtml = fp.getvalue().decode("utf-8").split("</html>")[1].strip()
        self.application.array["skebiao"] = shtml

    def GongParse(self,SID,password):
        checkcode_url = "http://sport.cqu.edu.cn/Tool/GetValidateCode"
        checkcode = urllib.urlopen(checkcode_url).read()
        with open("j.jpg","wb") as f:
            f.write(checkcode)
        #temp_file = tempfile.NamedTemporaryFile(delete=True)
        #temp_file.write(checkcode)
        #temp_file.seek(0)
        name = "j.jpg"
        threshold = 140  
        table = []  
        for i in range(256):  
            if i < threshold:  
                table.append(0)  
            else:  
                table.append(1)   
        rep={'O':'0',  
            'I':'1','L':'1',  
            'Z':'2',  
            'S':'8'  
            };  
        im = Image.open(name)  
        imgry = im.convert('L')  
        imgry.save('g'+name)  
        out = imgry.point(table,'1')  
        out.save('b'+name)  
        text = image_to_string(out)  
        text = text.strip()  
        text = text.upper();
        for r in rep:  
            text = text.replace(r,rep[r])    
        checknum = text.split(" ")[0]

        glogin_url = "http://sport.cqu.edu.cn/Home/Login"
        tkebiao_url = "http://sport.cqu.edu.cn/ArrangeClass/isOrder"
        gpostdate = urllib.urlencode({
                    "userid":SID,
                    "userpwd":password,
                    "usertype":"student",
                    "validcode":checknum,
                    "rememberUserid":"false"
            })
        guser_agent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36"
        c = pycurl.Curl()
        fp = StringIO.StringIO()
        c.setopt(pycurl.URL,glogin_url)
        c.setopt(c.WRITEFUNCTION,fp.write)
        c.setopt(pycurl.FOLLOWLOCATION,1)
        c.setopt(pycurl.MAXREDIRS,5)
        c.setopt(pycurl.CONNECTTIMEOUT,60)
        c.setopt(pycurl.USERAGENT,guser_agent)
        c.setopt(pycurl.POSTFIELDS,gpostdate)
        c.setopt(pycurl.COOKIEFILE,"")
        c.perform()

        c.setopt(pycurl.URL,tkebiao_url)
        c.setopt(c.WRITEFUNCTION,fp.write)
        c.setopt(pycurl.USERAGENT,guser_agent)
        c.setopt(pycurl.POSTFIELDS,"")
        c.setopt(pycurl.COOKIEFILE,"")
        c.perform()
        ghtml = fp.getvalue().decode("utf-8").split("</html>")[1]
        self.application.array["gkebiao"] = ghtml


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
   main()
    
   