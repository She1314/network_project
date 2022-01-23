window.onload = function () {
    var storage = localStorage.getItem('username')
    console.log(storage)
    if (storage) {
        $(".checkBox").addClass('active')
        $("#userName").val(storage);
    }
}
//前端验证
let postObj = {
    user: "",
    password: "",
    isSave: null
}

$(function () {
    autoFit();
})
window.onresize = function () {
    autoFit();
}
$('body').on('click', '#login', function () {
    var flag = valid();
    if (flag) { //如果flag为true，则发送信息
        console.log('表单验证通过', postObj);
        // $.post('url',{info:postObj},function(data){//！！！！！这里需要后台添加
        //})
    }
})


function valid() { //格式验证，以及获取输入框信息

    /*   获取输入框信息   */
    let user = trim($('input[name="userName"]').val()) || null;
    let password = trim($('input[name="password"]').val()) || null;
    let isSave = $('.checkBox').hasClass('active');
    let userFlag = true; //表示用户名的前端验证是否通过
    let passFlag = true; //表示密码的前端验证是否通过
    /*   前端  格式验证用户名   */
    if (!user) {
        $('.user').addClass('error');
        $('.user').siblings('.helpBolck').addClass('error');
        $('.user').siblings('.helpBolck').html('输入的用户名不能为空哦！');
        userFlag = false;
    } else {
        $('.user').removeClass('error');
        $('.user').siblings('.helpBolck').removeClass('error');
        userFlag = true;
        postObj.user = user;
    }

    /*   前端验证密码   */
    if (!password) {
        $('.password').addClass('error');
        $('.password').siblings('.helpBolck').addClass('error');
        $('.password').siblings('.helpBolck').html('输入的密码不能为空哦！');
        passFlag = false;
    } else {
        $('.password').removeClass('error');
        $('.password').siblings('.helpBolck').removeClass('error');
        passFlag = true;
        postObj.password = password;
    }
    postObj.isSave = isSave;
    return (userFlag && passFlag);
}

$('body').on('click', '.checkBox', function () {
    $(this).toggleClass('active');
})
$('body').on('focus', 'input', function () {
    $(this).removeClass('error');
    $(this).parent('.inputP').siblings('.helpBolck').removeClass('error');
})

/** 去除首尾的空格 **/
function trim(str) {
    return str.replace(/^[' '||' ']*/i, '').replace(/[' '||'  ']$/i, ''); //去除首尾的空格
}

/** 判断是否为邮箱地址 **/

function isEmail(emailStr) {
    var reg = /^[a-zA-Z0-9]+([._-]*[a-zA-Z0-9]*)*@[a-zA-Z0-9]+.[a-zA-Z0-9]{2,5}$/;
    return reg.test(emailStr);
}

//isEmail('714402934@qq.com')

/** 判断是否为手机 **/

function isPhone(phone) {
    var reg = /^1\d{10}$/;
    return reg.test(phone);
}

//isPhone(18483629341);
var swidth = null;
var W = null;

//header部分里面的所有元素的宽高全自适应方法

function autoFit() {
    swidth = $(window).width();
    if (swidth > 1320 || swidth === 1320) {
        resize();
    }
}

//部分模块等比缩放


function resize() {

    var winratio = $(window).width() / 1920;
    var height = $(window).height();
    if (winratio < 1) {//只有宽度小于1920的，才需要js做自适应
        $('.headerMain').css({
            transform: "scale(" + winratio + ")",
            transformOrigin: "left top"
        });

        $('.login_content').css({
            transform: "scale(" + winratio + ")",
            transformOrigin: "right center"
        });
        $('.themeBox').css({
            transform: "scale(" + winratio + ")",
            transformOrigin: "left center"
        });
    }
    // else{
    // 	$('.html1').css({
    // 		transform: "scale(" + winratio + ")",
    // 		transformOrigin: "left top"
    // 	})
    // }


}


function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

let uuid_code = uuid()
console.log(uuid_code)

let img_url = `/user/ImageVerify/${uuid_code}/`
// img_url = '/user/ImageVerify/253df313-1392-4706-8ab0-4f6102a23500/'
// console.log(img_url)
form_data();

function form_data() {
    // console.log(img_url);
    $("#verify_img").attr('src', img_url);
}

$("#verify_img").click(function () {
    uuid_code = uuid()
    console.log(uuid_code)
    img_url = `/user/ImageVerify/${uuid_code}/`
    // console.log(img_url);
    $("#verify_img").attr('src', img_url);
});
$("#login").click(function () {
    let msg = document.getElementById("msg")
    if($('.checkBox').hasClass('active')){
        localStorage.setItem('username', $("#userName").val())
    }else {
        localStorage.removeItem('username')
    }
    $.ajax({
        type: 'POST',
        url: '/user/LoginView/' + uuid_code + "/",
        data: {
            "email": $("#userName").val(),
            "password": $("#password").val(),
            "image_code": $("#image_code").val()
        },
        success: function (data) {
            if (data.code === 200) {
                location.href = '/static/index.html'
                localStorage.setItem('Authorization', data.data)
            } else if (data.code === 401) {
                msg.style.display = 'block'
                msg.innerText = '密码或者用户名错误'
            } else {
                msg.style.display = 'block'
                msg.innerText = '验证码错误'
            }
        }
    })
});
