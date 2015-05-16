#-*-coding:utf-8-*-

import json
import pycurl
import urllib
import StringIO

import tornado.locale
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from hashlib import md5
from datetime import datetime
from BeautifulSoup import BeautifulSoup
from tornado.options import define, options

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

if __name__ == "__main__":
    define("port", default=8001, type=int, help="run on the given port")

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/grade",GradeHandler),
        ]
        settings = dict(
            debug=True
        )

        tornado.web.Application.__init__(self,handlers=handlers,**settings)


class GradeHandler(tornado.web.RequestHandler):
    def post(self):
            SID = self.get_argument("SID",None)
            password = self.get_argument("password",None)
            teamnumber = self.get_argument("teamnumber",None)
            if not SID:
                no_username = {
                    "errmsg":"no_username",
                    "errcode":1
                }
                self.write(no_username)
                return
            if not password:
                no_password={
                    "errmsg":"no_password",
                    "errcode":1
                }
                self.write(no_password)
                return
            if not teamnumber:
                teamnumber = "0"
            self.set_header("Access-Control-Allow-Origin","*")

            login_url =  "http://202.202.1.176:8080/_data/index_login.aspx"
            prefix_core_url = "http://202.202.1.176:8080/xscj/Stu_MyScore.aspx"
            core_url = "http://202.202.1.176:8080/xscj/Stu_MyScore_rpt.aspx"

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

            c.setopt(pycurl.URL,prefix_core_url)
            c.setopt(c.WRITEFUNCTION,fp.write)
            c.setopt(pycurl.COOKIEFILE,"")
            c.perform()
            html = fp.getvalue().decode("gbk")
            soup = BeautifulSoup(html)
            try:
                txt_xm = str(soup("input")[18]).split('value="')[1].split('"')[0]
            except:
                wrong = {
                    "errmsg":"wrong SID or password",
                    "errcode":1
                }
                self.write(wrong)
                return

            postcore = urllib.urlencode({
                            "sel_xn":'2014',
                            "sel_xq":teamnumber,
                            "SJ":"1",
                            'btn_search':'%BC%EC%CB%F7',
                            "SelXNXQ":"2",
                            "txt_xm":txt_xm,
                            "zfx_flag":"0"
                            })

            c.setopt(pycurl.URL,core_url)
            c.setopt(pycurl.POSTFIELDS,postcore)
            c.setopt(c.WRITEFUNCTION,fp.write)
            c.setopt(pycurl.COOKIEFILE,"")
            c.perform()
            fhtml = fp.getvalue().decode("gbk")

            soup2 = BeautifulSoup(fhtml)
            table = soup2("table")[-2]("td")
            GPA = soup2("table")[-1]("td")[-1].text
            count = len(table)/11
            if count == 0:
                wrong = {
                    "errmsg":"cannot search",
                    "errcode":1
                }
                self.write(wrong)
                return

            team = table[0].text
            grade_dict = {"课程总数":count,"学年学期":team,"GPA":GPA,"课程名称":[],"学分":[],"成绩":[]}
            for i in range(len(table)):
                if i % 11 == 1:
                    grade_dict["课程名称"].append(table[i].text)
                if i % 11 == 2:
                    grade_dict["学分"].append(table[i].text)
                if i % 11 == 6:
                    grade_dict["成绩"].append(table[i].text)
                    
            self.write(json.dumps(grade_dict))


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
   main()
    
