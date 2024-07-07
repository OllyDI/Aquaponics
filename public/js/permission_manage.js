$(document).ready(function() {
    $.ajax({
        url: "/device_all",
        method: "post",
        async: false, 
        success: function(data) {
            $.each(data, (i, v) => {
                devices.push({
                    text: v.name, 
                    value: (v.id).toString(),
                    selected: false
                })
                if (data.length - 1 == i) {
                    multiplelist = new DualListbox("#modal-select" , {
                        sortable: true,
                        options: devices,
                        availableTitle: "권한 미부여 기기",
                        selectedTitle: "권한 부여 기기",
                        addButtonText: "추가",
                        addAllButtonText: "전체추가",
                        removeButtonText: "삭제",
                        removeAllButtonText: "전체삭제"
                    });
                }
            })
        }
    })
})

function modal_func(id, level) {
    $.ajax({
        url: '/get_link',
        method: 'post',
        data: { id: id },
        async: false,
        success: function(data) {
            test = data;
            $.each(devices, (i, v) => {
                if (data.includes(Number(v.value))) devices[i].selected = true
                else devices[i].selected = false
                if (devices.length - 1 == i) {
                    multiplelist.options = devices;
                    multiplelist.redraw();
                    $("#modal_title").html("ID: " + id + " 권한설정");
                    $("#modal_success_btn").addClass(`userid_${id}`);
                    $("#modal_success_btn").addClass(`userlevel_${level}`);
                    $('#device_modal').on('hidden.bs.modal', function (e) { $("#modal_success_btn").removeClass(`userid_${id}`, `userlevel_${level}`); })
                    $("#device_modal").modal('show');
                }
            })
        }
    })
    
}
function updateDevice(btn) {
    let uid = $(btn).attr('class').split("userid_")[1].split(" ")[0];
    let ulevel = $(btn).attr('class').split("userlevel_")[1].split(" ")[0];
    let selected_item = [];
    let unselected_item = [];
    console.log(ulevel);
    $.each(multiplelist.options, (i, v) => {
        if (v.selected == true) {
            selected_item.push({
                name: v.text,
                user_id: uid,
                device_id: v.value,
            })
        } else {
            unselected_item.push({
                device_id: v.value,
            })
        }
        if (multiplelist.options.length - 1 == i) {
            $.ajax({
                url: '/delete_link',
                method: 'post',
                data: {
                    items: JSON.stringify(unselected_item),
                    uid: uid,
                },
                success: function(data) {
                    console.log('del')
                }
            })
            $.ajax({
                url: '/insert_link',
                method: 'post',
                data: { 
                    items: JSON.stringify(selected_item), 
                    uid: uid,
                    ulevel: ulevel,
                }, 
                success: function(data) {
                    console.log('ins')
                }
            })
        }
    })
    $("#device_modal").modal('hide');
}

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