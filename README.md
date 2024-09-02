# Aquaponics

# 1. 프로젝트 내용

□ 아쿠아포닉스 IOT 개발

 - 7인치 터치스크린을 통한 웹 서버 연결 및 제어
   
 - 아두이노 카메라 모듈을 통한 식물의 실시간 관제
    
 - 아두이노 모듈 센서의 데이터 수집 (5분 단위)
    
 	- 온도(외부, 수온), 습도, 조도, 모터 속도, 기포장치 데이터 수집
 
 - LED 조도 센서, 모터 센서, 기포 장치 제어
    
 - 아두이노 각 제어 모듈의 측정하여 표준값 추출
    
 	- 전년도 데이터 및 테스트를 통해 각 제어 모듈의 표준값 추출
 
 	- 식물 종류에 따른 각 제어 모듈의 프리셋 기능 제공
 
 - 라즈베리파이를 통한 데이터 저장 및 웹 서버에 데이터 전송

<br>

□ 아쿠아포닉스 웹 시스템 개발

 - 관리자 페이지 생성
    
 	- 관리자 페이지를 통해 회원가입 수락 및 거절 기능 제공
 
 	- 교사용 계정으로 아쿠아포닉스의 센서 제어 권한 부여 가능
 
 	- 관리자는 모든 회원가입 된 사용자 권한 및 회원 탈퇴 기능 제공
 
 - 회원가입 기능 제공
    
 	- 가입 시 학생용, 교사용 선택 기능 제공
 
 	- 학교, 직급, 이름, 학년, 반, 번호, 아이디, 비밀번호 입력 후 가입
 
 	- 교사용으로 가입 시 관리자가 수락을 통해 회원가입 진행
 
 - 웹 시스템을 통한 아쿠아포닉스 센서 제어
    
 	- 권한에 따른 제어 가능 계정 설정(관리자, 교사)
  
 - 웹 시스템 수집 데이터 가시화 페이지
    
 	- 아쿠아포닉스의 온도, 습도, 조도, 모터, 기포 장치 데이터 가시화
 
 	- 수집한 데이터를 차트 형태로 가시화
 
 	- 모터, 조도, 기포장치는 바를 통해 퍼센트(%) 조절 가능

## 2. 프로젝트 설계

□ 데이터베이스 설계

 - 멤버 - 아이디(PK), 비밀번호, 레벨, 학교명, 이름, 학년, 반, 번호, 가입일
    
 - 디바이스 - 기기명(PK), 기기이름, 와이파이이름, 와이파이 비밀번호, 시간, 서비스
    
 - 제어 - 키(PK), 조도, 모터, 기포, 기기(FK), 날짜
    
 - 프리셋 - 키(PK), 프리셋 이름, 각각 따로 설정(조도, 모터, 기포), 시간-전, 시간-후, 기기, 유저(FK)
    
 - 환경정보 - 키(PK), 외부온도, 수온, 습도, 조도, 모터, 기포, LED, EC, pH, DO, 기기(FK), 날짜
    
 - 연결정보 - 키(PK), 이름, 사용자 아이디(FK), 기기명(FK), 연결시간, 레벨

 - 임시저장멤버 - 아이디(PK), 비밀번호, 레벨, 학교명, 이름, 학년, 반, 번호, 가입일

 - 센서 - 키(PK), 기기명, 모터, 기포, LED, 시간

□ 논리DB모델
![논리db모델](https://github.com/OllyDI/Aquaponics/assets/71002104/a1ab1ec4-1fac-4821-8c3b-c1df9af22a7c)

□ 물리DB모델
![물리db모델](https://github.com/OllyDI/Aquaponics/assets/71002104/d576723d-bba2-4d80-b187-14ca76278fa5)
