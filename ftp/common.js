/**
 * Created by Z on 2017/5/11.
 */
function add_voice()
{
    var media_id = $("#media_id").val();
    //var content = $("#content").val();

    $.getJSON(
        "index.php",
        {action : "add_voice" , media_id : media_id , content : main.translateResult},
        function (data)
        {
            //alert(data);
            //提交成功
            if (data.status == 1)
            {
                $("#pid").val(data.pid);
                init_weixin_share();
            }
        }
    );
}

function lottery()
{
    var is_follow = parseInt($("#is_follow").val());
    if (is_follow == 0)
    {
        $(".P_code").fadeIn();
        return;
    }

    var is_vip = parseInt($("#is_vip").val());
    if (is_vip == 0)
    {
        alert("对不起，本次活动采取实名领奖\n您还没有请填写个人信息");
        var back_url = "http://epshow.i-creative.cn/mothersday/index.php?is_reg=1";
        location.href = "http://o2o.elegant-prosper.com/EPWXSite/VIP/CreateVip?sid=cfe404ea-fe5b-4a85-87f0-b2701929462c&redirect_uri=" + encodeURIComponent(back_url);
        return;
    }

    var is_award = parseInt($("#is_award").val());
    if (is_award)
    {
        //已中过奖
        $(".P_end1").fadeIn();
        return;
    }

    $.getJSON(
        "index.php",
        {action : "lottery"},
        function (data)
        {
            if (data.status == -1)
            {
                $(".P_end1").fadeIn();
            }

            //未关注
            if (data.status == 0)
            {
                $(".P_code").fadeIn();
                //alert("未关注");
            }

            //正常抽奖
            if (data.status == 1)
            {
                $("#is_award").val("1");
                $("#lottery_result").val(data.lottery_result);

                $("#name").val(data.truename);
                $("#phone").val(data.mobile);

                main.precordleave();
                main.pprize();

                init_weixin_share();
            }

            if (data.status == -9)
            {
                alert("异常，请联系客服");
            }


        }
    );
}

function show_lottery_result(data)
{
    switch (data.lottery_result)
    {
        case -1:
            //已中过奖
            break;
        case -2:
            alert("异常，请联系客服");
            break;
        default:
            alert("异常，请联系客服");
            break;
    }

    $("#lottery_result").val(data.lottery_result);
    return;
}

function add_info()
{
    var truename = $("#name").val();
    if(truename == "")
    {
        alert("请填写姓名");
        return false;
    }

    var mobile = $("#phone").val();
    if(mobile == "")
    {
        alert("请填写手机号码");
        return false;
    }

    var shop_id = $("#shop_id").val();
    if(shop_id == "0" || shop_id == "" )
    {
        main.alert({
            text:main.alertTxt.door,
            type:1,
            button:".alertbtn2"
        });
        return false;
    }

    var openid = $("#openid").val();
    $.getJSON(
        "index.php",
        {action : "add_info" , openid : openid , shop_id : shop_id , truename : truename , mobile : mobile},
        function (data)
        {
            if (data.status == 1)
            {
                //alert("提交成功");
                //location.href = "index.php";
                main.haveFill = true;
                main.pfillleave();
                main.pchaxun();

                $(".province").html(main.CommonSelect.province);
                $(".city").html(main.CommonSelect.city);
                $(".door").html(main.CommonSelect.address);
            }
            else
            {
                alert(data.msg);
            }
        }
    );
}


function get_province()
{
    var ip_province = $("#ip_province").val();
    $.post(
        "index.php",
        {action : "get_province" , ip_province : ip_province},
        function (data)
        {
            $(".addDataProvince").html(data);
            get_city();
        }
    );
}

function get_city()
{
    //$(".selectShop_city_input,.selectShop_shop_input").val("城市");
    //$(".selectShop_shop_input,.seeShop_shop_input").val("门店");
    var province = main.CommonSelect.province;
    //alert(province);
    var ip_city = $("#ip_city").val();
    $.post(
        "index.php",
        {action : "get_city" , province : province , ip_city : ip_city},
        function (data)
        {
            $(".addDataCity").html(data);
            get_shop();
        }
    );
}

function get_shop()
{
    //$(".selectShop_shop_input,.seeShop_shop_input").val("门店");

    var city = main.CommonSelect.city;
    $.post(
        "index.php",
        {action : "get_shop" , city : city},
        function (data)
        {
            $(".addDataAddress").html(data);
        }
    );
}

/*$(".addDataProvince").on("change",function(){get_city();});
 $(".addDataCity").on("change",function(){get_shop()});
 $(".addDataAddress").on("change",function(){
 $("#shop_id").val($(this).val());
 });*/

get_province();

//get_province();
//$(".submit").click(function(){add_info();});