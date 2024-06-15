$(document).ready(function () {
    document.querySelector('form').addEventListener('submit', function(e){
        if(document.getElementById('level').value == '') {
            e.preventDefault(); // 폼 전송 막는 함수
            $("#lLevel").attr("hidden", false)
        } else $("#lLevel").attr("hidden", true)

        if(document.getElementById('school').value == '') {
            e.preventDefault();
            $("#lSchool").attr("hidden", false)
        } else $("#lSchool").attr("hidden", true)

        if(document.getElementById('uname').value == '') {
            e.preventDefault();
            $("#lUname").attr("hidden", false)
        } else $("#lUname").attr("hidden", true)

        if(document.getElementById('grade').value == '') {
            e.preventDefault();
            $("#lUgrade").attr("hidden", false)
        } else $("#lUgrade").attr("hidden", true)

        if(document.getElementById('class').value == '') {
            e.preventDefault();
            $("#lUclass").attr("hidden", false)
        } else $("#lUclass").attr("hidden", true)

        if(document.getElementById('number').value == '') {
            e.preventDefault();
            $("#lUnumber").attr("hidden", false)
        } else $("#lUnumber").attr("hidden", true)

        if(document.getElementById('uid').value == '') {
            e.preventDefault();
            $("#lUid").attr("hidden", false)
        } else $("#lUpw").attr("hidden", true)

        if(document.getElementById('upw').value == '') {
            e.preventDefault();
            $("#lUpw").attr("hidden", false)
        } else $("#lUpw").attr("hidden", true)

        
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
