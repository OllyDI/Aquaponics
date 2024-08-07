$(document).ready(function() {
    $.ajax({
        url: "/get_device",
        method: "post",
        data: { id: id },
        success:function(data) {
            let deviceHtml = '';
            $.each(data, (i, val) => {
                deviceHtml += `<a href="/dashboard${val.service==1?'_premium':''}?name=${val.name}&device=${val.device_id}&service=${val.service}&level=${val.link_level}" class="nav_link"
                                data-bs-toggle="tooltip" data-bs-placement="right" title="${val.name}">
                                <i class='bx bx-devices nav_icon'></i> <span class="nav_name">${val.name}</span>
                            </a>`
                if (data.length - 1 == i) $("#pages").append(deviceHtml);
            })
        }
    })
})