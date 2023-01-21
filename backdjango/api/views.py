from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db import connection
import bcrypt
import jwt
import time
import json

def dictfetchall(cursor):
    desc = cursor.description
    return [dict(zip([col[0] for col in desc], row)) for row in cursor.fetchall()]

@csrf_exempt
def cart_view(self):
    if self.method == 'GET':
        return get_cart(self)
    if self.method == 'POST':
        return post_cart(self)
    if self.method == 'DELETE':
        return delete_cart(self)

@csrf_exempt
def product_view(self):
    if self.method == 'GET':
        return get_product(self)

@csrf_exempt
def request_view(self):
    if self.method == 'GET':
        return get_request(self)
    if self.method == 'POST':
        return post_request(self)
    if self.method == 'DELETE':
        return delete_request(self)
@csrf_exempt
def request_pk_view(self, pk):
    if self.method == 'GET':
        return get_request_pk(self, pk)
    if self.method == 'PATCH':
        return patch_request_pk(self, pk)

@csrf_exempt
def reqterm_view(self):
    if self.method == 'GET':
        return get_reqterm(self)
    if self.method == 'POST':
        return post_reqterm(self)

@csrf_exempt
def reqterm_pk_view(self, pk):
    if self.method == 'GET':
        return get_reqterm_pk(self, pk)
    if self.method == 'PATCH':
        return patch_reqterm_pk(self, pk)

def get_cart(self):
    usernum = self.GET.get('usernum', None)
    cursor = connection.cursor()
    query = 'SELECT * FROM "CART" WHERE "USERNUM" = %s'
    val = usernum,
    cursor.execute(query, val)
    data = dictfetchall(cursor)
    response = JsonResponse(data, safe=False)
    return response

def get_cart2(self):
    cursor = connection.cursor()
    # 토큰 해석
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiInaWQnIiwic3RhcnRfYXQiOjE2NzQxOTgwMTAsImV4cCI6MTY3NDIwODAxMH0.P9Gh3dxTHvWiryYajjLdc1XJVNOKCS_SZy_4gGGeSIM"
    public_key = 'very_secret'
    decoded = jwt.decode(token, public_key, algorithms='HS256')
    print(decoded)
    print(decoded["userid"])
    userid = decoded["userid"]
    query = 'SELECT "USERNUM" FROM "USER" WHERE "USERID" = ' +userid
    cursor.execute(query)
    data = dictfetchall(cursor)
    usernum = str(data[0]['USERNUM'])
    query = 'SELECT * FROM "CART" WHERE "USERNUM" = %s'
    val = usernum,
    cursor.execute(query, val)
    data = dictfetchall(cursor)
    response = JsonResponse(data, safe=False)
    print(response)
    return response

def post_cart(self):
    request = json.loads(self.body)
    for req in request:
        prodnum = req['PRODNUM']
        usernum = req['USERNUM']
        cartcount = req['CARTCOUNT']
        cursor = connection.cursor()
        query = 'insert into "CART" ("PRODNUM", "USERNUM", "CARTCOUNT")' \
                'values  (%s, %s, %s)'
        val = (prodnum, usernum, cartcount)
        cursor.execute(query, val)
        print(req)
    response = HttpResponse("성공")
    return response

def delete_cart(self):
    prodnum = str(self.GET.get('prodnum', None))
    usernum = str(self.GET.get('usernum', None))
    cursor = connection.cursor()
    query = 'DELETE FROM "CART" WHERE "PRODNUM" = %s and "USERNUM" = %s'
    val = (prodnum, usernum)
    cursor.execute(query, val)
    response = HttpResponse("성공")
    return response


@csrf_exempt
def get_product(self):
    category1code = self.GET.get('category1code', None)
    category2code = self.GET.get('category2code', None)
    prodname = self.GET.get('prodname', None)

    cursor = connection.cursor()
    if prodname is None and category1code is None and category2code is None:
        query = 'SELECT * FROM "PRODUCT"'
        cursor.execute(query)

    elif prodname is None and category2code is not None:
        query = 'SELECT * FROM "PRODUCT" WHERE "CATEGORY2CODE"= %s'
        val = category2code,
        cursor.execute(query, val)

    elif prodname is None and category1code is not None and category2code is None:
        query = 'SELECT "PRODNUM", "PRODNAME", "PRODPRICE", "PRODIMG" FROM "PRODUCT" INNER JOIN "CATEGORY2" ' \
                'ON "PRODUCT"."CATEGORY2CODE" = "CATEGORY2"."CATEGORY2CODE" WHERE "CATEGORY1CODE" = %s '
        val = category1code,
        cursor.execute(query, val)

    elif prodname is not None and category1code is None and category2code is None:
        query = 'SELECT * FROM "PRODUCT" WHERE "PRODNAME" LIKE %s'
        val = '%'+prodname+'%',
        cursor.execute(query, val)

    elif prodname is not None and category1code is not None and category2code is None:
        query = 'SELECT "PRODNUM", "PRODNAME", "PRODPRICE", "PRODIMG" FROM "PRODUCT" INNER JOIN "CATEGORY2" ' \
                'ON "PRODUCT"."CATEGORY2CODE" = "CATEGORY2"."CATEGORY2CODE" ' \
                'WHERE "CATEGORY1CODE" = %s and "PRODNAME" LIKE %s'
        val = (category1code, '%'+prodname+'%')
        cursor.execute(query, val)

    elif prodname is not None and category2code is not None:
        query = 'SELECT * FROM "PRODUCT" WHERE "CATEGORY2CODE"= %s and "PRODNAME" like %s'
        val = (category2code, '%'+prodname+'%')
        cursor.execute(query, val)


    data = dictfetchall(cursor)
    response = JsonResponse(data, safe=False)
    return response

@csrf_exempt
def login(self):
    """
    GET
    처음 로그인 화면 띄우기
    login/

    POST
    json 파일을 받아 조회 후
    값이 있으면 토큰 해석
    없으면
    id, password 입력 받아 조회 후
    토큰 받아 전송
    login/

    [
        {
            "userid":"id2",
            "userpwd":"pwd"
            }
    ]

    [
        {
            "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiInaWQnIiwic3RhcnRfYXQiOjE2NzQxOTgwMTAsImV4cCI6MTY3NDIwODAxMH0.P9Gh3dxTHvWiryYajjLdc1XJVNOKCS_SZy_4gGGeSIM"
        }
    ]
    """

    if self.method == "GET":
        response = HttpResponse("로그인 화면")

    elif self.method == "POST":

        data = json.loads(self.body)

        print(data[0])

        try:
            # 토큰 해석
            data = data[0]["token"]
            public_key = 'very_secret'
            decoded = jwt.decode(data, public_key, algorithms='HS256')
            print(decoded)
            print(decoded["userid"])
            response = HttpResponse(decoded)

        except:
            # 토큰 생성
            userid = '\'' + data[0]["userid"] + '\''
            userpwd = '\'' + data[0]["userpwd"] + '\''

            cursor = connection.cursor()

            # 로그인 판단
            query = 'select "USERNUM" from "USER" ' \
                    'where "USERID" =' + userid + 'and "USERPWD" =' + userpwd

            cursor.execute(query)

            judge = cursor.fetchall()

            if judge:
                key = 'very_secret'
                now = int(time.time())
                exp = now + 10000
                jwt_payload = {'userid': userid, 'start_at': now, 'exp': exp}
                encoded = jwt.encode(jwt_payload, key, 'HS256')

                encoded = json.loads('[{"secretcode": "' + encoded + '"}]')
            else:
                encoded = json.loads('[{"secretcode": ""}]')
            response = HttpResponse(encoded)

    return response

def accesstoken(request):
    pw = '1234'
    pw_hash = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())

    pw_hash = pw_hash.decode('utf-8')

def get_request(self):
    termyearmonth = self.GET.get('termyearmonth', None)
    reqstaging = self.GET.get('reqstaging', None)
    reqstate = self.GET.get('reqstate', None)
    usernum = self.GET.get('usernum', None)
    params = {}
    if usernum is not None:
        params['U."USERNUM"'] = usernum
    if termyearmonth is not None:
        params['R."TERMYEARMONTH"'] = termyearmonth
    if reqstaging is not None:
        params['R."REQSTAGING"'] = reqstaging
    if reqstate is not None:
        params['R."REQSTATE"'] = reqstate
    return request_select_query(params)

def post_request(self):
    request = json.loads(self.body)
    for req in request:
        prodnum = req['PRODNUM']
        reqcount = req['REQCOUNT']
        reqprice = req['REQPRICE']
        usernum = req['USERNUM']
        termyearmonth = req['TERMYEARMONTH']
        cursor = connection.cursor()
        query = 'insert into "REQUEST" ("PRODNUM", "REQCOUNT", "REQPRICE", "USERNUM", "TERMYEARMONTH")' \
                'values  (%s, %s, %s, %s, %s)'
        val = (prodnum, reqcount, reqprice, usernum, termyearmonth)
        cursor.execute(query, val)
    response = HttpResponse("성공")
    return response
    
def get_request_pk(self, pk):
    usernum = self.GET.get('usernum', None)
    params = {}
    params['R."REQNUM"'] = pk
    if usernum is not None:
        params['U."USERNUM"'] = usernum
    return request_select_query(params)

def patch_request_pk(self, pk):
    return request_update_query(self, str(pk))

def delete_request(self):
    reqnum = str(self.GET.get('reqnum', None))
    cursor = connection.cursor()
    query = 'DELETE FROM "REQUEST" WHERE "REQNUM" = %s'
    val = reqnum,
    cursor.execute(query, val)
    response = HttpResponse("성공")
    return response
def get_reqterm(self):
    request = self
    usernum = request.GET.get('usernum', None)
    termyearmonth = request.GET.get('termyearmonth', None)
    params = {}
    if usernum is not None:
        params['"USERNUM"'] = usernum
    if termyearmonth is not None:
        params['"TERMYEARMONTH"'] = termyearmonth
    return reqterm_select_query(params)

def post_reqterm(self):
    request = json.loads(self.body)
    termyearmonth = request['TERMYEARMONTH']
    termstartdate = request['TERMSTARTDATE']
    termenddate = request['TERMENDDATE']
    termavailable = request['TERMAVAILABLE']
    usernum = request['USERNUM']
    cursor = connection.cursor()
    query = 'insert into "REQTERM"' \
            'values  (%s, %s, %s, %s, %s)'
    val = (termyearmonth, termstartdate, termenddate, termavailable, usernum)
    cursor.execute(query, val)
    response = HttpResponse("성공")
    return response

def get_reqterm_pk(self, pk):
    usernum = self.GET.get('usernum', None)
    params = {}
    params['"TERMYEARMONTH"'] = pk
    if usernum is not None:
        params['"USERNUM"'] = usernum
    return reqterm_select_query(params)
def patch_reqterm_pk(self, pk):
    return reqterm_update_query(self, str(pk))

# request 테이블 select query 묶음
def request_select_query(columns):
    cursor = connection.cursor()
    query = 'SELECT * FROM "REQUEST" AS R ' \
            'JOIN "USER" AS U on U."USERNUM" = R."USERNUM" ' \
            'JOIN "PRODUCT" AS P on P."PRODNUM" = R."PRODNUM" '
    val=()
    if len(columns) != 0:
        query += 'WHERE '
        i = 0
        for column in columns:
            query += column+'= %s'
            if i < len(columns)-1:
                query += ' and '
            i+=1
            val+=(columns.get(column),)
    query += ' ORDER BY "REQNUM" DESC'
    cursor.execute(query, val)
    data = dictfetchall(cursor)
    response = JsonResponse(data, safe=False)
    return response


# request 테이블 update query
def request_update_query(self, pk):
    request = json.loads(self.body)
    reqstate = request['REQSTATE']
    reqstaging = request['REQSTAGING']
    reqrejectreason = request['REQREJECTREASON']
    usernum = request['USERNUM']
    cursor = connection.cursor()
    query = 'UPDATE "REQUEST" ' \
            'SET "REQSTATE" = %s, "REQAPVDATE" = CURRENT_DATE, "REQSTAGING" = %s, "REQREJECTREASON" = %s  ' \
            'WHERE "REQNUM" = %s and "USERNUM" = %s'
    val= (reqstate, reqstaging, reqrejectreason, pk, usernum)
    cursor.execute(query, val)
    response = HttpResponse("성공")
    return response

# reqterm 테이블 select query 묶음
def reqterm_select_query(columns):
    cursor = connection.cursor()
    query = 'SELECT * FROM "REQTERM"'
    val = ()
    if len(columns) != 0:
        query += ' WHERE '
        i = 0
        for column in columns:
            query += column + '= %s'
            if i < len(columns) - 1:
                query += ' and '
            i += 1
            val += (columns.get(column),)
    query += ' ORDER BY "TERMYEARMONTH" DESC'
    cursor.execute(query, val)
    data = dictfetchall(cursor)
    response = JsonResponse(data, safe=False)
    return response

# reqterm 테이블 update query
def reqterm_update_query(self, pk):
    request = json.loads(self.body)
    termavailable = request['TERMAVAILABLE']
    usernum = request['USERNUM']
    cursor = connection.cursor()
    query = 'UPDATE "REQTERM" SET "TERMAVAILABLE" = %s WHERE "TERMYEARMONTH"=%s AND "USERNUM"=%s'
    val = (termavailable,pk, usernum)
    cursor.execute(query, val)
    response = HttpResponse("성공")
    return response
