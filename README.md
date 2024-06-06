# Aquaponics
## 1. 프로젝트내용
### □ IOT 개발
#### ❍ 아두이노 카메라 모듈을 통한 실시간 관제
#### ❍ 아두이노 모듈 센서의 데이터 수집(5분 단위)
##### - 온도(외부, 수온) 센서, 습도 센서, 조도 센서 데이터 수집
#### ❍ LED 조도 센서, 모터 센서, 기포 장치 제어
    ❍ 아두이노 각 제어 모듈의 측정하여 표준값 추출
	- 전년도 데이터 및 테스트를 통해 표준값 추출
	- 식물 종류에 따른 표준값 추출 -> 드롭다운으로 식물 여러 개
    ❍ 라즈베리파이를 통한 데이터 저장 및 웹 서버에 데이터 전송

□ 웹 시스템 개발
    ❍ 관리자 페이지 생성
	- 관리자 페이지를 통해 사용자에게 권한 부여 가능
	- 교사용 계정은 아쿠아포닉스의 센서 제어 권한 부여 가능
    ❍ 회원가입 기능 제공
	- 가입 시 학생용, 교사용 선택 기능 제공
	- 학교, 학생 교사 선택, 이름, 번호, 아이디, 비밀번호 입력 후 가입
	- 중복 이름은 각 학생의 번호로 구분
	- 교사용으로 가입 시 관리자가 수동 권한 부여
    ❍ 스마트폰을 이용하여 라즈베리파이 서버와 연결
	- 라즈베리파이의 핫스팟? 기능을 통해 연결
	- 연결 후 사용자가 주변 랜 또는 WI-FI의 정보 입력 -> 생각
    ❍ 웹 시스템을 통한 아쿠아포닉스 센서 제어
	 - 권한에 따른 제어 가능 계정 설정(관리자, 교사)
    ❍ 가시화 페이지
	- 아쿠아포닉스의 온도, 습도, 조도, 모터 등 모듈 데이터 가시화
	- 모터 또는 LED 등 클릭 시 바를 통해 퍼센트(%) 조절 가능
    ❍ 수집 데이터 차트로 가시화
	- 뭐를 차트로 가시화 해야될까
