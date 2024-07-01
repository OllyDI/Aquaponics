$(document).ready(function () {
    $("#uid").on("focusout", function (e) {
        var id = $("#uid").val();
        var level = $("#level").val();
        if (id == '' || id.length == 0) { return false; }

        //Ajax로 전송
        $.ajax({
            url: '/duplicate',
            method: 'post',
            data: {
                uid: id,
                level: level
            },
            datatype: 'json',
            success: function (data) {
                if (data == true) {
                    $("#lUid").attr("hidden", true)
                    $("#reg").attr("type", "submit");
                } else {
                    $("#lUid").attr("hidden", false)
                    $("#reg").attr("type", "button");
                }
            }
        });
    });
})
