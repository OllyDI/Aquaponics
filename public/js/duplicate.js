$(document).ready(function () {
    document.querySelector('form').addEventListener('submit', function(e){
        if(document.getElementById('email').value == '') {
            e.preventDefault(); // 폼 전송 막는 함수
            $("#lEmail").css("color", "red").text("아이디를 입력하세요.");
        }
        if(document.getElementById('pw').value == '') {
            e.preventDefault();
            $("#lPw").css("color", "red").text("비밀번호를 입력하세요.");
        } else $("#lPw").text("");
        if(document.getElementById('userName').value == '') {
            e.preventDefault();
            $("#lName").css("color", "red").text("닉네임을 입력하세요.");
        } else $("#lName").text("");
    });


    // $("#email").on("focusout", function (e) {
    //     var id = $("#email").val();
    //     if (id == '' || id.length == 0) { return false; }

    //     //Ajax로 전송
    //     $.ajax({
    //         url: '/duplicate',
    //         data: {
    //             email: id
    //         },
    //         type: 'POST',
    //         datatype: 'json',
    //         success: function (result) {
    //             if (result == true) {
    //                 $("#reg").attr("type", "submit");
    //                 $("#lEmail").css("color", "black").text("사용 가능한 ID 입니다.");
    //             } else {
    //                 $("#reg").attr("type", "button");
    //                 $("#lEmail").css("color", "red").text("사용 불가능한 ID 입니다.");
    //             }
    //         }
    //     });
    // });
})
