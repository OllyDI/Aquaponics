const level = ['학생용', '교사용', '관리자']
var id = null;

function logout() {
    var f = document.createElement('form');
    f.setAttribute('method', 'post');
    f.setAttribute('action', '/session_logout');
    document.body.appendChild(f);
    f.submit();
}

$(document).ready(function() {
    $.ajax({
    url: "/session",
    method: "get",
    async: false,
    success:function(data) {
        if (data[0].auth == false) {
            alert("로그인 후 이용해주세요.");
            location.replace('/login');
        }
        else {
            $("#level").text(level[data[0].level]);
            $("#username").text(data[0].name.slice(0, 1));
            if (level[data[0].level] == '학생용') $('#stumanag').hide();
            if (level[data[0].level] == '학생용') $('#settings').hide();
            id = data[0].id;
        }
    }
    })
})   