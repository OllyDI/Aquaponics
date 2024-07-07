function sign(id, bool, table, idx) {
    let msg = ["회원을 삭제하시겠습니까?", "가입을 승인하시겠습니까?", "가입을 거절하시겠습니끼?"]
    if (confirm(msg[idx])) {
        let link = ['suc', 'del']
        let tables = ['members', 'members_temp']
        $.ajax({
            url: `/${tables[table]}_${link[bool]}`,
            method: 'post',
            data: {
                id: id
            },
            success: function(msg) {
                alert(msg);
                location.reload();
            }
        })
    }
}