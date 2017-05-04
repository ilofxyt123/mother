(function(a){
    $.fn.extend({
        fiHandler:function(e){
            e.stopPropagation();
            this.removeClass("opacity "+this.tp.cls);
            if(this.tp.cb){this.tp.cb();};
            this.off("webkitAnimationEnd");
            this.tp.cb = undefined;
            this.tp.duration = this.tp.cls = "";
        },
        foHandler:function(e){
            e.stopPropagation();
            this.addClass("none").removeClass(this.tp.cls);
            if(this.tp.cb){this.tp.cb();};
            this.off("webkitAnimationEnd");
            this.tp.cb = undefined;
            this.tp.duration = this.tp.cls = "";
        },
        fi:function(cb){
            this.tp = {
                cb:undefined,
                duration:"",
                cls:"",
            };
            this.tp.cls = "ani-fadeIn";
            if(arguments){
                for(var prop in arguments){
                    switch(typeof arguments[prop]){
                        case "function":
                            this.tp.cb = arguments[prop];
                            break;
                        case "number":
                            this.tp.duration = arguments[prop];
                            this.tp.cls += this.tp.duration;
                            break;
                    }
                }
            }
            this.on("webkitAnimationEnd", this.fiHandler.bind(this)).addClass("opacity " + this.tp.cls).removeClass("none");
            return this;
        },
        fo:function(cb){
            this.tp = {
                cb:undefined,
                duration:"",
                cls:"",
            };
            this.tp.cls = "ani-fadeOut";
            if(arguments){
                for(var prop in arguments){
                    switch(typeof arguments[prop]){
                        case "function":
                            this.tp.cb = arguments[prop];
                            break;
                        case "number":
                            this.tp.duration = arguments[prop];
                            this.tp.cls += this.tp.duration;
                    }
                }
            }
            this.on("webkitAnimationEnd",this.foHandler.bind(this)).addClass(this.tp.cls);
            return this;
        }
    });
    var Utils = new function(){
        this.preloadImage = function(ImageURL,callback,realLoading){
            var rd = realLoading||false;
            var i,j,haveLoaded = 0;
            for(i = 0,j = ImageURL.length;i<j;i++){
                (function(img, src) {
                    img.onload = function() {
                        haveLoaded+=1;
                        var num = Math.ceil(haveLoaded / ImageURL.length* 100);
                        if(rd){
                            $(".num").html("- "+num + "% -");
                        }
                        if (haveLoaded == ImageURL.length && callback) {
                            setTimeout(callback, 500);
                        }
                    };
                    img.onerror = function() {};
                    img.onabort = function() {};

                    img.src = src;
                }(new Image(), ImageURL[i]));
            }
        },//图片列表,图片加载完后回调函数，是否需要显示百分比
            this.lazyLoad = function(){
                var a = $(".lazy");
                var len = a.length;
                var imgObj;
                var Load = function(){
                    for(var i=0;i<len;i++){
                        imgObj = a.eq(i);
                        imgObj.attr("src",imgObj.attr("data-src"));
                    }
                };
                Load();
            },//将页面中带有.lazy类的图片进行加载
            this.browser = function(t){
                var u = navigator.userAgent;
                var u2 = navigator.userAgent.toLowerCase();
                var p = navigator.platform;
                var browserInfo = {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
                    weixin: u2.match(/MicroMessenger/i) == "micromessenger",
                    taobao: u.indexOf('AliApp(TB') > -1,
                    win: p.indexOf("Win") == 0,
                    mac: p.indexOf("Mac") == 0,
                    xll: (p == "X11") || (p.indexOf("Linux") == 0),
                    ipad: (navigator.userAgent.match(/iPad/i) != null) ? true : false
                };
                return browserInfo[t];
            },//获取浏览器信息
            this.g=function(id){
                return document.getElementById(id);
            },
            this.E=function(selector,type,handle){
                $(selector).on(type,handle);
            }
        this.limitNum=function(obj){//限制11位手机号
            var value = $(obj).val();
            var length = value.length;
            //假设长度限制为10
            if(length>11){
                //截取前10个字符
                value = value.substring(0,11);
                $(obj).val(value);
            }
        };
    };
    var Media = new function(){
        this.mutedEnd = false;
        this.WxMediaInit=function(){
            var _self = this;
            if(!Utils.browser("weixin")){
                this.mutedEnd = true;
                return;
            }
            if(!Utils.browser("iPhone")){
                _self.mutedEnd = true;
                return;
            }
            document.addEventListener("WeixinJSBridgeReady",function(){
                var $media = $(".iosPreload");
                $.each($media,function(index,value){
                    _self.MutedPlay(value["id"]);
                    if(index+1==$media.length){
                        _self.mutedEnd = true;
                    }
                });
            },false)
        },
            this.MutedPlay=function(string){
                var str = string.split(",");//id数组
                var f = function(id){
                    var media = Utils.g(id);
                    media.volume = 0;
                    media.play();
                    // setTimeout(function(){
                    media.pause();
                    media.volume = 1;
                    media.currentTime = 0;
                    // },100)
                };
                if(!(str.length-1)){
                    f(str[0]);
                    return 0;
                }
                str.forEach(function(value,index){
                    f(value);
                })
            },
            this.playMedia=function(id){
                var _self = this;
                var clock = setInterval(function(){
                    if(_self.mutedEnd){
                        Utils.g(id).play()
                        clearInterval(clock);
                    }
                },20)
            }
    };
    Media.WxMediaInit();

    var main = function(){

        this.isEnd;//活动结束标志
        this.havePay;//付款标记,也是参与活动的标志
        this.isVip;//会员标记
        this.guanzhu;//关注标记
        this.FromTuiSong;//从推送进入页面
        this.prizeType;//奖品类型，0代表未参与过活动，1代表4999旅行，2代表188新品券
        this.isOpen4999;//是否已经开启4999大奖
        this.nowPeople;

        this.clockSwitch = undefined;//定时器句柄
        this.haveFill;//是否填写过中奖信息

        this.router;//管理页面跳转
        this.pages = ["pact","endPay","endNoPay"];

        this.touch ={
            ScrollObj:undefined,
            isScroll:false,
            limitUp:0,
            limitDown:undefined,
            overlimit:false,
            StartY:0,
            NewY:0,
            addY:0,
            scrollY:0,
            touchAllow:true
        };

        this.FindSelect = {
            provinceIndex:"0",
            cityIndex:"0",
            addressIndex:"",
            province:"",
            city:"",
            address:"",
            $provinceObj:$(".selectBox1 .province"),
            $cityObj:$(".selectBox1 .city"),
            $addressObj:$(".selectBox1 .address")
        };
        this.FillSelect = {
            provinceIndex:"0",
            cityIndex:"0",
            addressIndex:"",
            province:"",
            city:"",
            address:"",
            $provinceObj:$(".fill-selectBox .province"),
            $cityObj:$(".fill-selectBox .city"),
            $addressObj:$(".fill-selectBox .address")
        };
        this.alertTxt = ["请输入姓名","请输入正确的手机号","请选择门店"];

        this.bgm ={
            obj:document.getElementById("bgm"),
            id:"bgm",
            isPlay:false,
            button:$(".music-btn")
        };


        this.picUrl = "images/";//图片路径
        this.ImageList = [
            this.picUrl+"1.png",
            this.picUrl+"3.png",
            this.picUrl+"bg1.jpg",
            this.picUrl+"bg2.jpg",
            this.picUrl+"bg3.jpg",
            this.picUrl+"bird.png",
            this.picUrl+"bird_small.png",
            this.picUrl+"bottom1.png",
            this.picUrl+"bottom2.png",
            this.picUrl+"code.jpg",
            this.picUrl+"load-pic.png",
            this.picUrl+"logo.png",
            this.picUrl+"music_btn.png",
            this.picUrl+"over.png",
            this.picUrl+"over-noPay.jpg",
            this.picUrl+"over-pay.jpg",
            this.picUrl+"p1_pic02.png",
            this.picUrl+"p1_pic03.png",
            this.picUrl+"p1_pic04.png",
            this.picUrl+"p1_pic05.png",
            this.picUrl+"p1_pic08.png",
            this.picUrl+"p1_pic09.png",
            this.picUrl+"p1_pic10.png",
            this.picUrl+"p1_pic11.png",
            this.picUrl+"p1_pic12.png",
            this.picUrl+"p1_pic13.png",
            this.picUrl+"p1_pic14.png",
            this.picUrl+"p1_pic15.png",
            this.picUrl+"p1_pic16.png",
            this.picUrl+"p1_pic17.png",
            this.picUrl+"p1_pic18.png",
            this.picUrl+"p1_pic18.png",
            this.picUrl+"p1_pic19.png",
            this.picUrl+"p1_pic20.png",
            this.picUrl+"p1_pic21.png",
            this.picUrl+"p1_pic22.png",
            this.picUrl+"p1_pic23.png",
            this.picUrl+"p1_pic24.png",
            this.picUrl+"p1_pic25.png",
            this.picUrl+"p1_pic26.png",
            this.picUrl+"p1_pic27.png",
            this.picUrl+"p1_pic28.png",
            this.picUrl+"p1_pic29.png",
            this.picUrl+"p1_pic30.png",
            this.picUrl+"p2_pic01.png",
            this.picUrl+"p2_pic02.png",
            this.picUrl+"p2_pic03.png",
            this.picUrl+"p2_pic04.png",
            this.picUrl+"p2_pic05.png",
            this.picUrl+"p2_pic06.png",
            this.picUrl+"p2_pic07.png",
            this.picUrl+"p2_pic08.png",
            this.picUrl+"p2_pic09.png",
            this.picUrl+"p2_pic10.png",
            this.picUrl+"p2_pic11.png",
            this.picUrl+"p2_pic12.png",
            this.picUrl+"p2_pic13.png",
            this.picUrl+"p3.0_png1.png",
            this.picUrl+"p3.0_png2.png",
            this.picUrl+"p3.0_png3.png",
            this.picUrl+"p3.0_png4.png",
            this.picUrl+"p3.0_png5.png",
            this.picUrl+"p3_pic01.png",
            this.picUrl+"p3_pic02.png",
            this.picUrl+"p3_pic03.png",
            this.picUrl+"p3_pic04.png",
            this.picUrl+"p3_pic05.png",
            this.picUrl+"p3_pic06.png",
            this.picUrl+"p3_pic07.png",
            this.picUrl+"p3_pic08.png",
            this.picUrl+"p3_pic09.png",
            this.picUrl+"p3_pic10.png",
            this.picUrl+"p3_pic11.png",
            this.picUrl+"p3_pic12.png",
            this.picUrl+"p3_pic13.png",
            this.picUrl+"p3_pic14.png",
            this.picUrl+"p3_pic15.png",
            this.picUrl+"p3_pic16.png",
            this.picUrl+"p3_pic17.png",
            this.picUrl+"p3_pic18.png",
            this.picUrl+"p3_pic19.png",
            this.picUrl+"p3_pic20.png",
            this.picUrl+"p3_pic21.png",
            this.picUrl+"p3_pic22.png",
            this.picUrl+"p4_pic01.png",
            this.picUrl+"p4_pic02.png",
            this.picUrl+"p4_pic03.png",
            this.picUrl+"p4_pic04.png",
            this.picUrl+"p4_pic05.png",
            this.picUrl+"p4_pic06.png",
            this.picUrl+"p4_pic07.png",
            this.picUrl+"p4_pic08.png",
            this.picUrl+"p4_pic09.png",
            this.picUrl+"p4_pic10.png",
            this.picUrl+"p4_pic11.png",
            this.picUrl+"p4_pic12.png",
            this.picUrl+"p4_pic13.png",
            this.picUrl+"p4_pic14.png",
            this.picUrl+"p4_pic15.png",
            this.picUrl+"p4_pic16.png",
            this.picUrl+"p4_pic17.png",
            this.picUrl+"p4_pic18.png",
            this.picUrl+"p4_pic19.png",
            this.picUrl+"p4_pic20.png",
            this.picUrl+"p4_pic21.png",
            this.picUrl+"p4_pic22.png",
            this.picUrl+"p4_pic23.png",
            this.picUrl+"p4_pic24.png",
            this.picUrl+"p4_pic25.png",
            this.picUrl+"p4_pic26.png",
            this.picUrl+"p4_pic27.png",
            this.picUrl+"p4_pic28.png",
            this.picUrl+"p4_pic29.png",
            this.picUrl+"p4_pic30.png",
            this.picUrl+"p4_pic31.png",
            this.picUrl+"p4_pic32.png",
            this.picUrl+"p4_pic33.png",
            this.picUrl+"p4_pic34.png",
            this.picUrl+"p4_pic35.png",
            this.picUrl+"p4_pic36.png",
            this.picUrl+"p4_pic37.png",
            this.picUrl+"phone.png",
            this.picUrl+"rule_btn.png",
            this.picUrl+"tip.png",
            this.picUrl+"txt-1.png",
            this.picUrl+"txt-2.png",
            this.picUrl+"txt-3.png",
            this.picUrl+"weile.png"
        ];

        this.Swiper = undefined;
    };
    main.init=function(){
        this.Swiper = new Swiper(".P1 .swiper-container",{
            direction : 'vertical',//纵向
        })


    };
    main.start=function(){

    };
    main.scrollInit=function(selector,start){
        this.touch.ScrollObj = $(selector);
        this.touch.StartY = 0;
        this.touch.NewY = 0;
        this.touch.addY = 0;
        this.touch.scrollY = 0;
        this.touch.limitDown = this.touch.ScrollObj.height()<start?0:(start-this.touch.ScrollObj.height());
    };
    main.playbgm=function(){
        Media.playMedia(this.bgm.obj.id)
        this.bgm.button.addClass("ani-bgmRotate");
        this.bgm.isPlay = true;
    };
    main.pausebgm=function(){
        this.bgm.obj.pause();
        this.bgm.button.removeClass("ani-bgmRotate");
        this.bgm.isPlay = false;
    };
    main.addEvent=function(){
        var _self = this;

        $(window).on("orientationchange",function(e){
            if(window.orientation == 0 || window.orientation == 180 )
            {
                $(".hp").delay(100).fadeOut();
            }
            else if(window.orientation == 90 || window.orientation == -90)
            {
                $(".hp").delay(100).fadeIn();
            }
        });
    };
    var M = function(){};
    M.prototype = {
        init:function(){
            this.isEnd = $("#is_end").val();//boolean
            this.havePay = $("#havePay").val();//boolean
            this.isVip = $("#is_vip").val();//boolean
            this.guanzhu = $("#have_guanzhu").val();//boolean
            this.FromTuiSong = $("#FromTuiSong").val();//boolean
            this.prizeType = $("#prizeType").val();//number
            this.isOpen4999 = $("#isOpen4999").val();//boolean
            this.nowPeople = $(".now-people").html();//number
            this.haveFill = $("#haveFill").val();//boolean
            this.goRegist = $("#goRegist").val();//boolean


            ///////////////////套后台后可删除///////////////////
            this.isEnd = !!Number(this.isEnd);
            this.havePay = !!Number(this.havePay);
            this.isVip = !!Number(this.isVip);
            this.guanzhu = !!Number(this.guanzhu);
            this.FromTuiSong = !!Number(this.FromTuiSong);
            this.prizeType = parseInt(this.prizeType);
            this.isOpen4999 = !!Number(this.isOpen4999);
            this.nowPeople = parseInt(this.nowPeople);
            this.haveFill = !!Number(this.haveFill);
            this.goRegist = !!Number(this.goRegist);
            ///////////////////套后台后可删除///////////////////

            ///////////////处理查询页面///////////////
            switch(this.prizeType){
                case 0:
                    break;
                case 1://4999大奖
                    if(this.haveFill){$(".result1-bottom-fill,.chaxun-title-fill").removeClass("none");}
                    else{$(".result1-bottom-nofill,.chaxun-title-nofill").removeClass("none");}
                    $(".prize-result1").removeClass("none");
                    break;
                case 2://188小奖
                    if(this.isOpen4999){
                        $(".isEnd4999").removeClass("none");
                    }
                    else{
                        $(".no4999").removeClass("none");
                    }
                    $(".prize-result2").removeClass("none");
                    break;
            };
            ///////////////处理查询页面///////////////

            ///////////////处理参与活动页面///////////////
            var percent = this.nowPeople/278;
            $(".progress-bar").css("transform","scaleX("+percent+")");
            $(".act-txt1-number").html(278-this.nowPeople);

            if(this.isOpen4999){//当前批次已经抽过
                $(".hasOpen").removeClass("none");
            }
            else{//当前批次还没抽
                $(".haventOpen").removeClass("none");
            }
            if(this.havePay){
                $(".hasPayed").removeClass("none");
            }
            else{
                $(".haventPayed").removeClass("none");
            }

            (function(){//滚动手机号码
                var listLength = $(".numberItem").length,
                    limit = -(listLength-1)*30,
                    now = 0,
                    $scroller = $(".list-number");
                if(listLength!=0){
                    $(".Empty").remove();
                    setInterval(function(){
                        if(now>limit){
                            $scroller.addClass("transition");
                            now-=30;
                        }
                        else{
                            now = 0;
                            $scroller.removeClass("transition")
                        }
                        $scroller.css({"transform":"translateY("+now+"px)"});
                    },2000)
                }
            }());

            (function(){//倒计时
                var date = new Date(),
                    nowDate = date.getDate(),
                    nowHour = date.getHours(),
                    limit = 17,
                    lastHours;
                    lastHours = (limit - nowDate)*24-nowHour-1;
                    lastHours = lastHours<=0?0:lastHours;
                    $(".last-day").html(lastHours)//剩余的小时
            }());

            ///////////////处理参与活动页面///////////////

            ///////////////处理中奖列表页面///////////////
            (function(){
                var listLength = $(".table-item") .length;
                if(listLength!=0){
                    $(".ListEmpty").remove();
                }
            }());
            ///////////////处理参与活动页面///////////////
        },
        scrollInit:function(selector,start){
            this.touch.ScrollObj = $(selector);
            this.touch.StartY = 0;
            this.touch.NewY = 0;
            this.touch.addY = 0;
            this.touch.scrollY = 0;
            this.touch.limitDown = this.touch.ScrollObj.height()<start?0:(start-this.touch.ScrollObj.height());
        },
        playbgm:function(){
            Media.playMedia(this.bgm.obj.id);
            this.bgm.button.addClass("ani-bgmRotate");
            this.bgm.isPlay = true;
        },
        pausebgm:function(){
            this.bgm.obj.pause();
            this.bgm.button.removeClass("ani-bgmRotate");
            this.bgm.isPlay = false;
        },
        start:function(){
            Utils.preloadImage(this.ImageList,[this.lazyLoad.bind(this),this.startCallback.bind(this)],true);
        },
        startCallback:function(){
            ///////////////活动结束///////////////
            if(this.isEnd){
                if(this.havePay){//已经参与过活动
                    this.loadleave();
                    this.pend_pay();
                    return;
                }
                if(!this.havePay){//如果没参与过活动
                    this.loadleave();
                    this.pend_noPay();
                    return;
                }
            }
            ///////////////活动结束///////////////

            ///////////////活动未结束///////////////
            this.top();
            this.loadleave();
            if(!this.guanzhu){//未关注公众号
                this.pcode();
                return;
            }
            if(this.goRegist){//刚才去注册了一下
                // this.pact_mask();
                $(".hd-left-scale").addClass("ani-toBig1");
                $(".hd-right-scale").addClass("ani-toBig2");
                this.pact();
                return;
            }
            if(this.havePay){//已经支付过
                // this.pact_mask();
                $(".hd-left-scale").addClass("ani-toBig1");
                $(".hd-right-scale").addClass("ani-toBig2");
                this.pact();
                return;
            }
            this.p1();
            ///////////////活动未结束///////////////
        },
        top:function(){
            $(".music-btn,.rule-btn").removeClass("none");
        },
        loadleave:function(){
            $(".P_loading").fo();
        },
        p1:function(){
            var nowTime = 0,//当前运动时间
                _self = this,
                deltaX = this.bird.endPosition.x - this.bird.startPosition.x,
                deltaY = this.bird.endPosition.y - this.bird.startPosition.y;
            $(".P1").fi(function(){
                _self.bird.voice.play();
                $(".fadetxt img").addClass("ani-fadeIn");
                var clock = setInterval(function(){
                    nowTime += 20;
                    _self.bird.nowPosition.x = _self.easeOut(nowTime,_self.bird.startPosition.x,deltaX,2500);
                    _self.bird.nowPosition.y = _self.easeOut(nowTime,_self.bird.startPosition.y,deltaY,2500);
                    if(nowTime == 2500){
                        console.log("动画结束");
                        $(".p1-point,.p1-point-clickArea").fadeIn();
                        clearInterval(clock);
                        return;
                    }
                    _self.bird.$obj.css("transform","translate("+_self.bird.nowPosition.x+"px,"+_self.bird.nowPosition.y+"px)");
                },20)
            });

        },
        p1leave:function(){
            $(".P1").fo();
            this.bird.voice.pause();
        },
        pvip1:function(){
            $(".P_Vip1").fi(function(){
                $(".select-ban").addClass("none");
            });
        },
        pvip1leave:function(){
            $(".P_Vip1").fadeOut();
        },
        pvip2:function(){
            $(".P_Vip2").fadeIn();
        },
        pvip2leave:function(){
            $(".P_Vip2").fadeOut();
        },
        pnotvip:function(){
            $(".P_NotVip").fi();
        },
        pnotvipleave:function(){
            $(".P_NotVip").fadeOut();
        },
        pchaxun:function(){
            $(".P_chaxun").fadeIn();
        },
        pchaxunleave:function(){
            $(".P_chaxun").fadeOut();
        },
        pact_mask:function(){
            $(".P_mask").fi();
        },
        pact_maskleave:function(){
            $(".P_mask").fo(function(){
                $(".hd-left-scale").addClass("ani-toBig1");
                $(".hd-right-scale").addClass("ani-toBig2");
            });
        },
        pact:function(){
            this.router = this.pages[0];
            $(".P_active").fadeIn();
        },
        pactleave:function(){
            $(".P_active").fadeOut();
        },
        plist:function(){
            var _self = this;
            $(".P_List").fadeIn(function(){
                _self.scrollInit(".table-ul",300);
            });
        },
        plistleave:function(){
            $(".P_List").fadeOut();
        },
        pfill:function(){
            $(".P_fill").fadeIn();
        },
        pfillleave:function(){
            $(".P_fill").fadeOut();
        },
        paddress:function(){
            $(".P_Address").fadeIn();
        },
        paddressleave:function(){
            $(".P_Address").fadeOut();
        },
        pend_pay:function(){
            this.router = this.pages[1];//endPay
            $(".P_end-Pay").fi();
        },
        pend_payleave:function(){
            $(".P_end-Pay").fo();
        },
        pend_noPay:function(){
            this.router = this.pages[2];
            $(".P_end-noPay").fi();
        },
        pend_noPayleave:function(){
            $(".P_end-noPay").fo();
        },
        pcode:function(){
            $(".P_code").fadeIn();
        },
        pshare:function(){
            $(".P_share").fi();
        },
        addEvent:function(){
            var _self = this;
            /////////p1//////////
            $(".p1-point-clickArea").on("touchend",function(){
                $(".p1-hand").addClass("ani-hand");
            });
            $(".hand").on("webkitAnimationEnd",function(){
                setTimeout(function(){
                    _self.p1leave();
                    if(_self.isVip){
                        _self.pvip1();
                        return;
                    }
                    _self.pnotvip();
                },500);
            });

            /////////p1//////////

            /////////vip1//////////
            $(".vip1-click-area").on("touchend",function(){
                if(_self.FindSelect.addressIndex == 0){
                    $(".P_alert-address").fi();
                    return;
                }
                _self.FindSelect.province = _self.FindSelect.$provinceObj[0].options[_self.FindSelect.provinceIndex].text;
                _self.FindSelect.city = _self.FindSelect.$cityObj[0].options[_self.FindSelect.cityIndex].text;
                _self.FindSelect.address = _self.FindSelect.$addressObj[0].options[_self.FindSelect.addressIndex].text;
                $(".vipHand").addClass("ani-hand2");
            });
            $(".P_alert-address .alert-Box").on("touchend",function(){
                $(".P_alert-address").fo();
            });
            $(".vipHand").on("webkitAnimationEnd",function(){
                setTimeout(function(){
                    _self.pvip1leave();
                    _self.pvip2();
                },500)
            });
            $(".selectBox1 .province").on("change",function(){
                _self.FindSelect.provinceIndex = _self.FindSelect.$provinceObj[0].selectedIndex;
                _self.FindSelect.province = _self.FindSelect.$provinceObj[0].options[_self.FindSelect.provinceIndex].text;
            });
            $(".selectBox1 .city").on("change",function(){
                _self.FindSelect.cityIndex = _self.FindSelect.$cityObj[0].selectedIndex;
                _self.FindSelect.city = _self.FindSelect.$cityObj[0].options[_self.FindSelect.cityIndex].text;
            });
            $(".selectBox1 .address").on("change",function(){
                _self.FindSelect.addressIndex = _self.FindSelect.$addressObj[0].selectedIndex;
                _self.FindSelect.address = _self.FindSelect.$addressObj[0].options[_self.FindSelect.addressIndex].text;
            });
            /////////vip1//////////

            /////////vip2//////////
            $(".P_Vip2").on({
                touchstart:function(e){
                    _self.touch.StartY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                },
                touchmove:function(e){

                },
                touchend:function(e){
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.addY = _self.touch.NewY - _self.touch.StartY;
                    if(_self.touch.addY<-30){
                        _self.pvip2leave();
                        _self.pact_mask();
                        _self.pact();
                        // _self.clockSwitch = setTimeout(function(){
                        //     _self.pact_maskleave();
                        // },3000)
                    }
                }
            });
            /////////vip2//////////

            /////////pnotvip//////////
            $(".P_NotVip").on({
                touchstart:function(e){
                    _self.touch.StartY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                },
                touchmove:function(e){

                },
                touchend:function(e){
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.addY = _self.touch.NewY - _self.touch.StartY;
                    if(_self.touch.addY<-30){
                        _self.pnotvipleave();
                        _self.pact_mask();
                        _self.pact();
                        // _self.clockSwitch = setTimeout(function(){
                        //     _self.pact_maskleave();
                        // },3000)
                    }
                }
            });
            /////////pnotvip//////////

            /////////pmask//////////
            $(".mask-point").on("touchend",function(){
                if(!_self.touch.touchAllow){return;};
                clearTimeout(_self.clockSwitch);
                _self.pact_maskleave();

            });
            /////////pmask//////////

            /////////pact//////////
            $(".go-btn").on("touchend",function(){
                // if(_self.have_go){return;}
               window.location.href = "game.html";
                _self.have_go = true;
            });
            $(".chaxun-btn").on("touchend",function(){
                _self.router = _self.pages[0];
                _self.pactleave();
                if(_self.prizeType == 1&&_self.haveFill==false&&_self.haventFillAlert==false){
                    $(".P_alert-fill").fi();
                    _self.haventFillAlert = true;
                }
                _self.pchaxun();
            });
            $(".travel-list-btn").on("touchend",function(){
                _self.pactleave();
                _self.plist();
            });
            $(".table-visible-area").on({
                touchstart:function(e){
                    _self.touch.StartY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                },
                touchmove:function(e){
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.addY = _self.touch.NewY - _self.touch.StartY;
                    _self.touch.StartY = _self.touch.NewY;
                    if(_self.touch.scrollY+_self.touch.addY<_self.touch.limitUp){
                        if(_self.touch.scrollY+_self.touch.addY>_self.touch.limitDown){
                            _self.touch.scrollY+=_self.touch.addY;
                        }
                        else{
                            _self.touch.scrollY=_self.touch.limitDown;
                        }
                    }
                    else{
                        _self.touch.scrollY=_self.touch.limitUp;
                    }
                    _self.touch.ScrollObj[0].style.webkitTransform="translate3d(0,"+_self.touch.scrollY+"px,0)";
                },
                touchend:function(e){

                }
            });
            /////////pact//////////

            /////////pchaxun//////////
            $(".back").on("touchend",function(){
                _self.pchaxunleave();
                switch(_self.router){
                    case "pact":
                        _self.pact()
                        break;
                    case "endPay":
                        _self.pend_pay();
                }
            });

            $(".P_alert-fill .alert-Box").on("touchend",function(){//中4999提示填写信息提示框，点击关闭
                $(".P_alert-fill,.P_chaxun").fadeOut();
                $(".P_fill").fi();
            });

            $(".chaxun-result1-btn1").on("touchend",function(){

                _self.pfill();
                _self.pchaxunleave();
            });
            $(".chaxun-result1-btn2,.chaxun-result1-btn4").on("touchend",function(){
                _self.paddress();
            });
            $(".chaxun-result1-btn3,.chaxun-result1-btn5").on("touchend",function(){
                _self.pshare();
            });

            $(".chaxun-result2-btn1").on("touchend",function(){
                _self.paddress();
            });
            $(".chaxun-result2-btn2").on("touchend",function(){
                _self.pshare();
            });
            /////////pchaxun//////////

            /////////paddress//////////
            $(".add-xx").on("touchend",function(){
                _self.paddressleave();
            });
            /////////paddress//////////

            /////////plist//////////
            $(".listxx").on("touchend",function(){
                _self.plistleave();
                switch(_self.router){
                    case "pact":
                        _self.pact();
                        break;
                    case "endPay":
                        _self.pend_pay();
                        break;
                    case "endNoPay":
                        _self.pend_noPay();
                        break;
                }
            });
            /////////plist//////////

            /////////pendpay//////////
            $(".pend-chaxun-btn").on("touchend",function(){
                _self.pchaxun();
                _self.pend_payleave();
            });
            $(".pay-nameList-btn").on("touchend",function(){
                _self.pend_payleave();
                _self.plist();
            });
            /////////pendpay//////////

            /////////pendnopay//////////
            $(".noPay-nameList-btn").on("touchend",function(){
                _self.plist();
                _self.pend_noPayleave();
            });
            /////////pendnopay//////////

            /////////P_fill//////////
            $(".fill-submit-btn").on("touchend",function(){
                var phoneNumber= $("#phone").val(),
                    name = $("#name").val(),
                    alert_txtBox = $(".alert-submit-txt"),
                    alertBox = $(".P_alert-submit");
                if(name == ""){
                    alert_txtBox.html( _self.alertTxt[0]);
                    alertBox.fi();
                    return;
                }
                if(!(/^1(3|4|5|7|8)\d{9}$/.test(phoneNumber))){
                    alert_txtBox.html( _self.alertTxt[1]);//手机号错误提示框
                    alertBox.fi();
                    return;
                }
                if(_self.FillSelect.addressIndex==0){
                    alert_txtBox.html( _self.alertTxt[2]);
                    alertBox.fi();
                    return;
                }
                window.location.href = "index.html";
            });//提交信息

            $(".alert-Box-submit").on("touchend",function(){//关闭错误提示框
                $(".P_alert-submit").fo();
            });

            $(".fill-selectBox .province").on("change",function(){
                _self.FillSelect.provinceIndex = _self.FillSelect.$provinceObj[0].selectedIndex;
                _self.FillSelect.province = _self.FillSelect.$provinceObj[0].options[_self.FillSelect.provinceIndex].text;
            });
            $(".fill-selectBox .city").on("change",function(){
                _self.FillSelect.cityIndex = _self.FillSelect.$cityObj[0].selectedIndex;
                _self.FillSelect.city = _self.FillSelect.$cityObj[0].options[_self.FillSelect.cityIndex].text;
            });
            $(".fill-selectBox .address").on("change",function(){
                _self.FillSelect.addressIndex = _self.FillSelect.$addressObj[0].selectedIndex;
                _self.FillSelect.address = _self.FillSelect.$addressObj[0].options[_self.FillSelect.addressIndex].text;
            });


            /////////P_fill//////////
            // $(document).on("webkitAnimationEnd",function(e){//试点技术，暂未启用，用以优化安卓fadeIn和fadeOut
            //     var animationName = e.originalEvent.animationName,
            //         $dom = $(e.target);
            //     switch(animationName){
            //         case "ani-fadeOut":
            //             $dom.addClass("none").removeClass("ani-fadeOut");
            //             break;
            //         case "ani-fadeIn":
            //             $dom.removeClass("none").removeClass("opacity ani-fadeIn");
            //             break;
            //     }
            //     animationName = null;
            //     $dom = null;
            // });
            $(".rule-btn").on("touchend",function(){//打开规则
                $(".P_rule").fi();
            });
            $(".P_share").on("touchend",function(){//打开分享
                $(this).fadeOut();
            });
            $(".rulexx").on("touchend",function(){//关闭规则
                $(".P_rule").fo();
            });

            $("#phone").on("input",function(){
                _self.limitNum($(this)[0]);
            });

            $(".music-btn").on("touchend",function(){
                if(_self.bgm.isPlay){
                    _self.bgm.isPlay = false;
                    _self.pausebgm();
                }
                else{
                    _self.bgm.isPlay = true;
                    _self.playbgm();
                }
            });
            $(window).on("orientationchange",function(e){
                if(window.orientation == 0 || window.orientation == 180 )
                {
                    $(".hp").hide();
                }
                else if(window.orientation == 90 || window.orientation == -90)
                {
                    $(".hp").show();
                }
            });
            document.body.ontouchmove = function(e){e.preventDefault();}
        },
    };

    a.main = main;
    console.log(a)

/*-----------------------------事件绑定--------------------------------*/
}(window));
$(function(){
    main.init()
    main.addEvent();
    // main.start();
    // main.playbgm();
});




