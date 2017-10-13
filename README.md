#StockChat
StockChat Order By J

StockChat API문서
=====
이 문서에서는 StockChat의 웹 프론트엔드를 위해 제공되는 서버에 대한 API를 다룹니다.

서버 구동
===
    레포지토리의 root 디렉토리를 기반으로 설명합니다.

    node www/bin

통신 방법
클라이언트->서버
------
클라이언트와 서버가 기본적으로 통신하는데는 HTTP 프로토콜을 사용하며, html 상의 폼을 이용한 GET/POST 메서드를 이용합니다.

서버->클라이언트
-------
서버가 클라이언트에게 처리된 정보를 보낼때는 JSON을 사용해 직렬화 된 JSON Object를 전송합니다.

클라이언트에서의 처리는 어떻게 할 것인지 직접 연락 바랍니다.

클라이언트는 모든 요청에 있어 session 내부에 아이디값을 포함하고 있어야 합니다.


인증 방법
----
서비스 내에서의 인증 방법에 대해 설명합니다.

###Local Server Login

/auth/register 를 이용하여 회원 가입을 한 뒤, /auth/register/mail을 이용하여 메일 인증 후, /auth를 통하여 로그인 합니다.

로그인 후에 세션 유지는 Session 을 이용하여 이루어집니다.

API인증
----

Cool6 Backend의 모든 API는 로그인을 제외하고 세션에 저장되어있는 아이디값의 유효성을 기준으로 작동합니다.

세션에는 반드시 로그인했을때 id값이 저장되어 있어야 하며, 이것이 유효하지 않을 시에는 HTTP 상태코드를 다르게 (401) 송출하게됩니다.

Database 스키마
=====
여기서는 Cool6에 사용되는 Database 스키마를 다룹니다.

이 Database 스키마는 내부적으로도 사용되며, 외부에 공개된 API에서도 그대로 사용됩니다.

User
----
Means Single User.

### _id : Schema's identity number. String
### id : User's auth id. String
### password : User's auth password. String
### email : User's email. String
### mail_service : User's mail service setting. Boolean
### favorite : Array of Stock Schema. array element type is String
### scrap : Array of Article Schema. array element type is String
### register_day : Creation date of Schema. String
### current_login : Current Login date. String
### point : User's point. Number

Stock
----
Means Single Stock Schema.

### _id : Schema's identity number. String
### code : Stock Code. String
### name : Stock Name. String
### current_val : Stock's current value. String
### yesterday_val : Stock's yesterday value. String
### diff_percentage : Stock's difference of percentage. String
### chat : Chat room id of Stock. String

Article
---
Means Single Article.

### _id : Schema's identity number. String
### title : Article's title. String
### date : Creation date of Article. String
### content : Article's content. String
### user_cnt : User count. Number
### recommend : Recommendation Count. Number
### writer : Article's writer. String

Messenger
----
Means Single Message.

### _id : Schema's identity number. String
### sender : Sender of message. String
### recipient : Receiver of message. String
### date : Creation date of Message. String
### content : Message's content. String

API 레퍼런스
====
오류 처리
---
오류 코드는 401로 통일하였습니다.

Auth
---
### /auth/register : 회원가입
    id : 로그인에 사용할 id입니다.
    password : 로그인에 사용할 비밀번호입니다.
    email : 계정에 귀속되는 이메일 주소입니다.
    mail_service : 메일링 서비스 동의 여부입니다.

성공시 생성된 User Schema를 리턴합니다.

### /auth/register/mail : 회원가입 메일 인증
    token : 메일 인증으로 주어진 토큰을 입력받는 파라미터입니다.

인증 성공시 { result : true }라는 JSON 오브젝트를 반환하고, 실패시 result 값은 false로 반환됩니다.

### /auth : 로그인
    id : 로그인에 사용할 id입니다.
    password : 로그인에 사용할 비밀번호입니다.

성공시 User Schema를 리턴합니다.
유저 정보가 없을 경우 예외적으로 403을 반환합니다.

### /auth/find/id : id 찾기

    email : 회원가입에 사용한 이메일 주소입니다.

정보가 있을 시 입력한 이메일로 id를 담은 메일이 발송됩니다.

### /auth/find/pw : 비밀번호 찾기
    
    email : 회원가입에 사용한 이메일 주소입니다.

정보가 있을 시 입력한 이메일로 비밀번호를 담은 메일이 발송됩니다.

### /auth/delete : 회원 탈퇴

    입력값은 없습니다.

가입된 회원정보를 파기합니다.

Board
----

### /board/add : 글을 작성합니다.

    content : 글의 내용입니다.
    title : 글의 제목입니다.
    writer : 글을 쓴 사람입니다.

작성에 성공할 경우 작성된 글의 정보를 반환합니다.

### /board : 작성된 글들을 열람합니다.

    입력값은 없습니다.

열람에 성공할 경우 시간의 역순으로 된 Article Schema Array를 반환합니다.

### /board/recommend : 글을 추천합니다.

    id : 글의 _id 값 입니다.

파라미터의 해당하는 글의 추천에 성공할 경우 업데이트 된 스키마 정보를 반환합니다.

### /board/:id : id에 해당하는 글을 열람합니다.

    id : url에 포함되는 파라미터입니다. 글의 _id값입니다.

글의 열람에 성공할 경우 글의 Article Schema 를 반환합니다.

### /board/scrap/:id : id에 해당하는 글을 스크랩합니다.

    id : url에 포함되는 파라미터입니다. 글의 _id값입니다.

글의 스크랩에 성공할 경우 업데이트 된 User Schema를 반환합니다.

### /board/delete/:id : id에 해당하는 글을 지웁니다.

    id : url에 포함되는 파라미터입니다. 글의 _id 값입니다.

글의 삭제에 성공할 경우 삭제된 Article Schema를 반환합니다.

Chat
---

### /chat/join/:id : id에 해당하는 주식 채팅방에 참가합니다.

    id : url에 포함되는 파라미터입니다. 주식의 _id 값입니다.

참가에 성공할 경우 클라이언트와 연결된 Socket에 접속합니다.

Stock
---

### /stock/search/:name : name에 해당하는 주식 정보를 가져옵니다.

    name : url에 포함되는 파라미터입니다. 회사의 이름입니다.

요청에 성공할경우 회사의 정보를 가져옵니다.

### /stock/list : 회사의 리스트를 회사의 현재 주식정보와 함께 모두 가져옵니다.

    요구값은 없습니다.

요청에 성공할 경우 회사의 주식 정보가 담긴 리스트를 출력합니다.

### /stock/query : 입력한 쿼리값에 해당하는 검색결과를 가져옵니다.

    query : 검색 쿼리문입니다.

요청에 성공할 경우 해당 쿼리문에 상응하는 검색결과를 리스트로 가져옵니다.

### /admin/board : 모든 게시글을 가져옵니다.

    요청값은 없습니다.

요청에 성공할 경우 모든 게시글을 리스트로 가져옵니다.

### /admin/user : 모든 유저정보를 가져옵니다.

    요청값은 없습니다.

요청에 성공할 경우 모든 게시글을 리스트로 가져옵니다.

### /admin/report : 신고된 모든 게시글을 가져옵니다.

    요청값은 없습니다.

요청에 성공할 경우 모든 신고된 게시글을 가져옵니다.


Message
---
구현중
