$(document).ready(function () {
    document.querySelector('form').addEventListener('submit', function(e){
        if(document.getElementById('level').value == '') {
            e.preventDefault(); // 폼 전송 막는 함수
            $("#lLevel").css("color", "red").text("선택하세요.");
        } else $("#lLevel").text("");

        if(document.getElementById('school').value == '') {
            e.preventDefault();
            $("#lSchool").css("color", "red").text("학교명을 입력하세요..");
        } else $("#lSchool").text("");

        if(document.getElementById('uid').value == '') {
            e.preventDefault();
            $("#lUid").css("color", "red").text("아이디를 입력하세요.");
        } else $("#lUpw").text("");

        if(document.getElementById('upw').value == '') {
            e.preventDefault();
            $("#lUpw").css("color", "red").text("비밀번호를 입력하세요.");
        } else $("#lUpw").text("");

        if(document.getElementById('uname').value == '') {
            e.preventDefault();
            $("#lUname").css("color", "red").text("닉네임을 입력하세요.");
        } else $("#lUname").text("");
    });


    $("#uid").on("focusout", function (e) {
        console.log("focus")
        var id = $("#uid").val();
        if (id == '' || id.length == 0) { return false; }

        //Ajax로 전송
        $.ajax({
            url: '/duplicate',
            method: 'post',
            data: {
                uid: id
            },
            datatype: 'json',
            success: function (res) {
                console.log(res)
                if (res == true) {
                    $("#reg").attr("type", "submit");
                    $("#lUid").css("color", "black").text("사용 가능한 ID 입니다.");
                } else {
                    $("#reg").attr("type", "button");
                    $("#lUid").css("color", "red").text("사용 불가한 ID입니다.");
                }
            }
        });
    });
})
