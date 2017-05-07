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
    
    var Barrage = new function(){
        this.$container = $("#danmu");//容器
        this.template = $(".barrage");//模板
        this.$container_width = undefined;//容器宽
        this.$container_height = undefined;//容器高
        this.haveOver = 0;//有多少个去了最右边
        this.barrages = [];//所有的弹幕
        this.upload="";//用于上传的新弹幕
        this.download = [];
        this.isOpen = false;
    };
    Barrage.CreateOneBarrage = function(config){
        config = config ? config : {};

        config.color = config.color ? config.color : "white";
        config.text = config.text ? config.text : "这是一条测试弹幕";
        config.id = new Date().getTime()+"_"+this.barrages.length;
        // config.photo = config.photo ? config.photo : "images/mj.gif",
        config.close = config.close ? config.close : false;
        if(config.close){config.closePic = config.closePic ? config.closePic : "images/close.png"};

        var duration = Math.round(Math.random()*10);
        config.duration = config.duration ? config.duration :((duration<8 ? 8:duration)+"s");
        config.type = config.type ? config.type : "linear";
        config.loop = config.loop ? config.loop : false;
        config.delay = config.delay ? config.delay : this.barrages.length+"s";

        this.barrages.push(config);
    };
    Barrage.updateBarrageContainerSize = function(config){
        config = config ? config : {};
        if(config.$container){
            this.$container = config.$container;
        }
        this.$container_width = this.$container.width();
        this.$container_height = this.$container.height();
    };//更新弹幕容器
    Barrage.AddOneBarrageToContainer = function(config,index){
        config = config ? config :{};
        config.color = config.color ? config.color : "yellow";
        config.text = config.text ? config.text : "这是一条测试弹幕";
        // config.photo = config.photo ? config.photo : "images/mj.gif";
        config.close = config.close ? config.close : false;
        if(config.close){config.closePic = config.closePic ? config.closePic : "images/close.png"};

        config.duration = config.duration;
        config.type = config.type ? config.type : "linear";
        config.loop = config.loop ? config.loop : false;
        config.delay = config.delay ? config.delay : "1s";

        var time = new Date().getTime();
        var id = config.id;

        var $cloneBarrage = this.template.clone();
        $cloneBarrage[0].id = id;//设置好id
        $cloneBarrage.find(".content").css({"color":config.color}).html(config.text);//设置好文字
        // $cloneBarrage.find(".photo img").attr("src",config.photo);
        if(config.close){
            $cloneBarrage.find(".close img").attr("src",config.closePic);
        }
        else{
            $cloneBarrage.find(".close").remove();
        }

        var thisClass = "",
            thisCss = {},
            thisWidth = $cloneBarrage.width();
        var top,pretop;
        top = Math.round(Math.random()*400);
        if(top<0){top = 0;}//下边界限制
        if(top>400-50){top = 400-50;}//上边界限制
        if(index!=0){
            pretop = parseInt($(".everyBarrage").eq(index-1).css("top"));//前一个块的位置
            if(Math.abs(top-pretop)<50){//上下两块的位置差小于50
                if(pretop+50<400){
                    top = pretop+50;
                }
                else{
                    top = pretop-50;
                }
            }
        }
        thisCss = {
            "top":top+"px",
            // "transition":"transform "+config.duration+" "+config.type,
            "right":-thisWidth+"px",
            "transform":"translateX(100%)",
            "animation-duration":config.duration,
            "animation-delay":config.delay,
        };
        switch(config.type){
            case"linear":
                thisClass+="ani-linear ";
                break;
        }
        if(config.loop){
            thisClass+="ani-times-infinite ";
        }
        else{
            thisClass+="ani-times1 ";
        }

        thisClass+="everyBarrage";

        var callBack = function(){
            Barrage.haveOver++;
            console.log(Barrage.haveOver)
            if(Barrage.haveOver == Barrage.barrages.length){
                Barrage.RemoveBarrage();
                Barrage.AddAllBarrageToContainer();
            }
            $(this).off("webkitAnimationEnd",callBack);
        }
        $cloneBarrage.addClass(thisClass).css(thisCss).removeClass("none").on("webkitAnimationEnd",callBack);

        this.$container.append($cloneBarrage);

    };//往弹幕容器中增加一条弹幕
    Barrage.AddAllBarrageToContainer = function(){
        for(var i=0;i<this.barrages.length;i++){
            this.AddOneBarrageToContainer(this.barrages[i],i);//往容器中增加一条弹幕
        }
    };
    Barrage.setBarrageLoop = function(){
        var callBack = function(){
            console.log(Barrage.haveOver)
            Barrage.haveOver++;
            if(Barrage.haveOver == Barrage.barrages.length){
                Barrage.RemoveBarrage();
                Barrage.AddAllBarrageToContainer();
                Barrage.setBarrageLoop();
            }
            $(this).off("webkitAnimationEnd",callBack);
        }
        $(".everyBarrage").on("webkitAnimationEnd",callBack);
        // if(this.barrages.length>2){
        //     $("#"+this.barrages[this.barrages.length-2].id).off("webkitAnimationEnd");
        //     $("#"+this.barrages[this.barrages.length-1].id).on("webkitAnimationEnd",function(){
        //         console.log("最后一条弹幕退场");
        //     });
        // }
    };
    Barrage.CloseBarrage = function(){
        this.$container.addClass("none");
        this.isOpen = false;
    };//弹幕关闭
    Barrage.ShowBarrage = function(){
        this.$container.removeClass("none");
        this.isOpen = true;
    };//弹幕开启
    Barrage.RemoveBarrage = function(){
        console.log(this.haveOver)
        $(".everyBarrage").remove();
        this.haveOver = 0;
    };//移除弹幕

    var Timer = new function(){
        this.h;
        this.min;
        this.sec;
        this.ms;

        this.hBox;
        this.minBox;
        this.secBox;
        this.msBox;

        this.speed;
    };
    Timer.init = function(config){
        config = config ? config : {};
        config.h = typeof config.h == "number" ? config.h : undefined;
        config.min = typeof config.min == "number"? config.min : undefined;
        config.sec = typeof config.sec == "number" ? config.sec : undefined;
        config.ms = typeof config.ms == "number"? config.ms : undefined;
        config.speed = config.speed ? config.speed : undefined;

        config.hBox = config.hBox ? config.hBox : undefined;
        config.minBox = config.minBox ? config.minBox : undefined;
        config.secBox = config.secBox ? config.secBox : undefined;
        config.msBox = config.msBox ? config.msBox : undefined;

        this.h = config.h;
        this.min = config.min;
        this.sec = config.sec;
        this.ms = config.ms;

        this.speed = config.speed;

        this.hBox = config.hBox;
        this.minBox = config.minBox;
        this.secBox = config.secBox;
        this.msBox = config.msBox;
    };

    var main = new function(){

        this.isEnd;//活动结束标志
        this.isVip;//会员标记
        this.guanzhu;//关注标记
        this.FromTuiSong;//从推送进入页面
        this.prizeType;//奖品类型，0代表未参与过活动，1代表4999旅行，2代表188新品券
        this.haveFill;//是否填写信息
        this.goRegist;//注册回来

        this.clockSwitch = undefined;//定时器句柄

        this.router;//管理页面跳转
        this.pages = {
            pvideo:"pvideo",
            pend1:"pend1"
        };//需要被记录的页面

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
            $provinceObj:$(".selectBox2 .select1"),
            $cityObj:$(".selectBox2 .select2"),
            $addressObj:$(".selectBox2 .select3"),
            str:"",
            contentBox:$(".pcd-result")
        };
        this.FillSelect = {
            provinceIndex:"0",
            cityIndex:"0",
            addressIndex:"",
            province:"",
            city:"",
            address:"",
            $provinceObj:$(".selectBox1 .select1"),
            $cityObj:$(".selectBox1 .select2"),
            $addressObj:$(".selectBox1 .select2"),
            str:""
        };
        this.alertTxt = {
            name:"请填写领奖人的姓名",
            phoneEmpty:"请填写正确的手机号",
            door:"请选择领取的门店",
            reg:"为了确保领奖者的真实性，系统需要进行实名认证，请填写个人真实信息领取奖品！"
        };

        this.bgm ={
            obj:document.getElementById("bgm"),
            id:"bgm",
            isPlay:false,
            button:$(".music-btn")
        };
        this.V = {//视频
            id:"video",
            currentTime:0,
            isPlay:false,
            obj:document.getElementById("video")
        };


        this.picUrl = "images/";//图片路径
        this.ImageList = [
            this.picUrl+"barrageBtn.png",
            this.picUrl+"bg.jpg",
            this.picUrl+"bo.gif",
            this.picUrl+"button-0.png",
            this.picUrl+"button-1.png",
            this.picUrl+"button-2.png",
            this.picUrl+"button-3.png",
            this.picUrl+"close.png",
            this.picUrl+"esc.png",
            this.picUrl+"esc-1.png",
            this.picUrl+"fenxiang.png",
            this.picUrl+"haha.gif",
            this.picUrl+"jiantou.png",
            this.picUrl+"loadgif.gif",
            this.picUrl+"logo.png",
            this.picUrl+"music_btn.png",
            this.picUrl+"otttl.png",
            this.picUrl+"p0-text-1.png",
            this.picUrl+"p0-text-2.png",
            this.picUrl+"p0-text-3.png",
            this.picUrl+"p0-text-4.png",
            this.picUrl+"p0-text-5.png",
            this.picUrl+"p0-text-6.png",
            this.picUrl+"p0-text-7.png",
            this.picUrl+"p1-1.jpg",
            this.picUrl+"p1-2.jpg",
            this.picUrl+"p1-3.jpg",
            this.picUrl+"p1-4.jpg",
            this.picUrl+"p1-5.jpg",
            this.picUrl+"p1-6.jpg",
            this.picUrl+"p1-7.jpg",
            this.picUrl+"p1-button-2.png",
            this.picUrl+"p1-img-1.png",
            this.picUrl+"p1-text-1.png",
            this.picUrl+"p1-text-2.png",
            this.picUrl+"p2-button-1.png",
            this.picUrl+"p2-button-2.png",
            this.picUrl+"p2-button-3.png",
            this.picUrl+"p2-button-4.png",
            this.picUrl+"p2-button-5.png",
            this.picUrl+"p2-button-6.png",
            this.picUrl+"p2-button-7.png",
            this.picUrl+"p2-img-1.png",
            this.picUrl+"p2-text-1.png",
            this.picUrl+"p2-text-2.png",
            this.picUrl+"p2-text-3.png",
            this.picUrl+"p2_img_4.png",
            this.picUrl+"p2_img_5.png",
            this.picUrl+"p2_img_6.png",
            this.picUrl+"p3-button-1.png",
            this.picUrl+"p3-button-2.png",
            this.picUrl+"p3-img-1.png",
            this.picUrl+"p3-img-2.png",
            this.picUrl+"p3-img-3.png",
            this.picUrl+"p3-img-4.png",
            this.picUrl+"p3-img-5.png",
            this.picUrl+"p3-img-6.png",
            this.picUrl+"p3-img-7.png",
            this.picUrl+"p3-img-8.png",
            this.picUrl+"p3-img-9.png",
            this.picUrl+"p3-text-1.png",
            this.picUrl+"p3-text-2.png",
            this.picUrl+"p3-text-3.png",
            this.picUrl+"p3-text-4.png",
            this.picUrl+"p3-text-5.png",
            this.picUrl+"p4-button-1.png",
            this.picUrl+"p4-img-1.png",
            this.picUrl+"p4-text-1.png",
            this.picUrl+"p5-img-1.png",
            this.picUrl+"p5-img-2.png",
            this.picUrl+"p5-img-3.png",
            this.picUrl+"p5-img-4.png",
            this.picUrl+"p5-img-5.png",
            this.picUrl+"p5-text-1.png",
            this.picUrl+"p6-img-1.png",
            this.picUrl+"p7-img-1.png",
            this.picUrl+"p7-text-1.png",
            this.picUrl+"p7-text-2.png",
            this.picUrl+"p8.jpg",
            this.picUrl+"p9.jpg",
            this.picUrl+"p9-button.png",
            this.picUrl+"p10.jpg",
            this.picUrl+"p11-img-1.png",
            this.picUrl+"p11-text-1.png",
            this.picUrl+"phone.png",
            this.picUrl+"poster.png",
            this.picUrl+"prztitle.png",
            this.picUrl+"tankuang.png",
            this.picUrl+"text.png",
            this.picUrl+"text-1.png",
            this.picUrl+"voiceBtn.png",
            this.picUrl+"vplayBtn.png",
            this.picUrl+"weile.png",
            this.picUrl+"yinbo.gif",
            this.picUrl+"yinbo.png",
            this.picUrl+"yinboxiao.png"
        ];

        this.Swiper = undefined;

        /*录音数据*/
        this.isRecording = false;//正在录音标志
        this.analysisSuccess = false;//语音分析成功标志
        this.localID = undefined;//拿到的本地ID
        this.translateResult = "";//识别结果
        this.RecordSeverID="";//服务端ID
        /*录音数据*/
    };
    main.init = function(){
        this.isEnd = $("#is_end").val();//boolean
        this.isVip = $("#is_vip").val();//boolean
        this.guanzhu = $("#have_guanzhu").val();//boolean
        this.FromTuiSong = $("#FromTuiSong").val();//boolean
        this.prizeType = $("#prizeType").val();//number
        this.haveFill = $("#haveFill").val();//boolean
        this.goRegist = $("#goRegist").val();//boolean


        ///////////////////套后台后可删除///////////////////
        this.isEnd = !!Number(this.isEnd);
        this.isVip = !!Number(this.isVip);
        this.guanzhu = !!Number(this.guanzhu);
        this.FromTuiSong = !!Number(this.FromTuiSong);
        this.prizeType = parseInt(this.prizeType);
        this.haveFill = !!Number(this.haveFill);
        this.goRegist = !!Number(this.goRegist);
        ///////////////////套后台后可删除///////////////////

        ///////////////Swiper初始化///////////////
        this.Swiper = new Swiper(".P1 .swiper-container",{
            direction : 'vertical',//纵向
            resistanceRatio : 0,//边缘抵抗
            allowSwipeToPrev:false,
            onSlideChangeEnd: function(swiper){
                console.log(swiper.activeIndex);
                if(swiper.activeIndex > 6){
                    main.p1leave();
                    main.pvideo();
                    main.showBarrage();
                    Barrage.updateBarrageContainerSize();
                    Barrage.AddAllBarrageToContainer();
                }
            }
        });
        ///////////////Swiper初始化///////////////

        ///////////////弹幕处理///////////////
        main.initBarrage();
        ///////////////弹幕处理///////////////
    };
    main.start=function(){
        Utils.preloadImage(this.ImageList,function(){main.startCallback()},true);
        this.playbgm();
    };
    main.startCallback=function(){
        main.addEvent();
        $(".num").fadeOut();
        $(".infinite").fadeIn();
        setTimeout(function(){
            main.loadleave();
            ///////////////活动结束///////////////
            if(main.isEnd){
                if(main.prizeType){//已经参与过活动
                    main.pend1();
                    return;
                }
                else{//如果没参与过活动
                    main.pend2();
                    return;
                }
            }
            ///////////////活动结束///////////////

            ///////////////活动未结束///////////////
            if(!main.guanzhu){//未关注公众号
                main.pcode();
                return;
            }
            if(main.goRegist){//刚才去注册了一下
                main.top();
                main.showBarrage();
                Barrage.updateBarrageContainerSize();
                Barrage.AddAllBarrageToContainer();

                $(".analysisBox").addClass("none");
                $(".time").addClass("none");
                $(".one").addClass("none");
                $(".op-tip2").addClass("none");
                $(".prec-btnGroup").removeClass("none");
                $(".icon1-end").removeClass("none");
                main.precord();
                return;
            }
            main.top();
            main.p1();
            ///////////////活动未结束///////////////
        },1500)
    };
    main.top = function(){
        $(".top").removeClass("none");
    };
    main.loadleave = function(){
        $(".P_loading").fo();
    };
    main.p1 = function(){
        $(".P1").fi();
        this.Swiper.update();
    };
    main.p1leave = function(){
        $(".P1").fo();
    };
    main.pvideo = function(){
        if(this.prizeType){//中过奖，显示中奖查询按钮
            $(".pv-bottom1").removeClass("none");
        }
        else{
            $(".pv-bottom2").removeClass("none");
        }
        $(".P_Video").fi();
    };
    main.pvideoleave = function(){
        $(".P_Video").fo(function(){
            $(".pv-bottom").addClass("none");
        });
        main.router = main.pages.pvideo;
    };
    main.prule = function(){
        $(".P_rule").fi();
        main.scrollInit(".rule-txt",0)
    };
    main.prulelaeve = function(){
        $(".P_rule").fo(function(){
            $(".rule-txt")[0].style.webkitTransform="translate3d(0,0,0)";
        });
    };
    main.recordReset = function(){
        $(".one").removeClass("none");
        $(".two").addClass("none");
        $(".prec-btnGroup").addClass("none");

        $(".analysisBox").removeClass("none");
        $(".analysisResult").html("");
        $(".submit").addClass("ui-chrome-btn-disable");

        main.analysisSuccess = false;//语音识别标示为false
        main.translateResult = "";
    };
    main.precord = function(){
        $(".P_record").fi();
    };
    main.precordleave = function(){
        $(".P_record").fo(function(){
            main.recordReset();
        });
    };
    main.prize = function(){
        // this.prizeType = 1;//88
        // this.prizeType = 2;//188
        // this.prizeType = 3;//520
        this.prizeType = 4;//矿泉水
        // this.prizeType = 5;//木头
    };//抽奖函数
    main.pprize = function(){
        $(".prizeBox"+this.prizeType).removeClass("none");
        switch(this.prizeType){
            case 4://实物
                $(".prz-btnGroup2").removeClass("none")
                break;
            case 5://实物
                $(".prz-btnGroup2").removeClass("none")
                break;
            default:
                $(".prz-btnGroup1").removeClass("none")
                break;
        }
        $(".P_prize_result").fi();
    };//抽完奖显示视图
    main.pprizeleave = function(){
        $(".P_prize_result").fo();
    };
    main.pfill = function(){
        $(".P_fill ").fi();
    };
    main.pfillleave = function(){
        $(".P_fill ").fo();
    };
    main.paddress =function(){
        $(".P_chaxunDoor").fi();
    };
    main.paddressleave = function(){
        $(".P_chaxunDoor").fo();
    };
    main.pchaxun = function(){
        if(this.prizeType == 4 || this.prizeType == 5){//实物奖
            if(!this.haveFill){

                return;
            }
        }
        $(".chaxunBox"+this.prizeType).removeClass("none");
        switch(this.prizeType){
            case 4:
                $(".chaxun-btnGroup2").removeClass("none");
                break;
            case 5:
                $(".chaxun-btnGroup2").removeClass("none");
                break;
            default:
                $(".chaxun-btnGroup1").removeClass("none");
                break;
        }
        $(".P_chaxun").fi();
    };
    main.pchaxunleave = function(){
        $(".P_chaxun").fo();
    };
    main.pcode = function(){
        $(".P_code").fadeIn();
    };
    main.pshare = function(){
        $(".P_share").fi();
    };
    main.playbgm = function(){
        Media.playMedia(this.bgm.id)
        this.bgm.button.addClass("ani-bgmRotate");
        this.bgm.isPlay = true;
    };
    main.pausebgm = function(){
        this.bgm.obj.pause();
        this.bgm.button.removeClass("ani-bgmRotate");
        this.bgm.isPlay = false;
    };

    /*调用微信语音api*/
    main.startRecord = function(){
        wx.startRecord();
    };//开始录制
    main.stopRecord = function(){
        // 语音录制完毕,执行回调
        wx.stopRecord({
            success: function (res) {
                main.isRecording = false;
                main.localId = res.localId;
                main.translateRecord(main.localId);
                $(".bo1-bopng").removeClass("none");
                $(".bo1-bogif").addClass("none");
                $(".one").fo();
                $(".two").fi();
            },
            fail: function (res) {
                alert("录制是失败");
                console.log(res);
            }
        });//停止录音
    };//停止录制
    main.translateRecord = function(localID){
        wx.translateVoice({
            localId:localID, // 需要识别的音频的本地Id，由录音相关接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                main.analysisSuccess = true;
                main.translateResult = res.translateResult; // 语音识别的结果

                $(".submit").removeClass("ui-chrome-btn-disable");
                $(".analysisResult").html(main.translateResult);
            }
        });
    };//语音识别
    main.playRecord = function(localID){
        wx.playVoice({
            localId: localID // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    };//播放语音
    main.upLoadRecordToWxServer = function(localID){
        wx.uploadVoice({
            localId: localID, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                main.RecordSeverID = res.serverId; // 返回音频的服务器端ID
            }
        });
    };
    main.downLoadRecordFromWxServer = function(serverID){
        wx.downloadVoice({
            serverId: serverID, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var localId = res.localId; // 返回音频的本地ID
            }
        });
    };
    /*调用微信语音api*/
    
    main.pend1 = function(){
        $(".P_end1").fi();
    };
    main.pend1leave = function(){
        this.router = this.pages.pend1;
        $(".P_end1").fo();
    };
    main.pend2 = function(){
        // this.router = this.pages[1];//endPay
        $(".P_end2").fi();
    };
    main.alert = function(config){
        var $box = $(".alertBox"+config.type);//框
        var p = $box.children(".alert-txt");

        p.html(config.text);//文字
        $(config.button).removeClass("none");//按钮

        $box.removeClass("none");
        $(".P_alert").removeClass("none");
    };
    main.alertClose = function () {
        $(".P_alert").addClass("none");
        $(".ui-alertBox").addClass("none");
        $(".ui-alertBox .alert-txt").html("");
        $(".alertbtn").addClass("none");
    };
    main.initBarrage = function(){

        for(var i=0;i<50;i++){
            Barrage.CreateOneBarrage({

            })
        }
    };
    main.showBarrage = function(){
        $(".P_danmu").removeClass("none");
        $(".barrage-open").removeClass("none");
        $(".barrage-close").addClass("none");
        Barrage.isOpen = true;
    };
    main.hideBarrage = function(){
        $(".P_danmu").addClass("none");
        $(".barrage-open").addClass("none");
        $(".barrage-close").removeClass("none");
        Barrage.isOpen = false;
    };
    main.addEvent = function(){
        var _self = this;
        $("").on("",function(){});

        /////////pvideo//////////
        $(".barrage-btn").on("touchend",function(){
            if(Barrage.isOpen){
                main.hideBarrage();
            }
            else{
                main.showBarrage();
            }
        });
        $(".rule-btn").on("touchend",function(){
            main.prule();
            main.pvideoleave();
        });
        $(".pv-bottom1 .p3").on("touchend",function(){
            main.pvideoleave();
            main.pchaxun();
        });
        $(main.V.obj).on({
            play:function(){
                main.V.isPlay = true;
                $(".play-btn").fo();
                main.pausebgm();
            },
            pause:function(){
                main.V.isPlay = false;
                $(".play-btn").fi();
                main.playbgm();
            },
            ended:function(){
                main.V.isPlay = false;
                $(".play-btn").fi();
                main.playbgm();
            }
        });
        $(".videoBox").on("touchend",function(){
                if(main.V.isPlay){
                    main.V.obj.pause();
                }
                else{
                    main.V.obj.play();
                }

        });
        $(".pv-btn").on("touchend",function(){
            main.pvideoleave();
            main.precord();
        });
        /////////pvideo//////////

        /////////prule//////////
        $(".rule_scrollArea").on({
            touchstart:function(e){
                main.touch.StartY = e.originalEvent.changedTouches[0].pageY;
            },
            touchmove:function(e){
                main.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                main.touch.addY = 1.5*(main.touch.NewY-main.touch.StartY);
                main.touch.StartY = main.touch.NewY;
                if(main.touch.scrollY+main.touch.addY<0){
                    if(main.touch.scrollY+main.touch.addY>main.touch.limitDown){
                        main.touch.scrollY+=main.touch.addY;
                    }
                    else{
                        main.touch.scrollY = main.touch.limitDown;
                    }
                }
                else{
                    main.touch.scrollY=0;
                }
                main.touch.ScrollObj[0].style.webkitTransform="translate3d(0,"+main.touch.scrollY+"px,0)";
            },
            touchend:function(e){

            }
        });
        $(".rulexx").on("touchend",function(){
            main.prulelaeve();
            main.back();
        });
        /////////prule//////////

        /////////precord//////////
        $(".icon1-start,.btn-start").on("touchend",function(){
            if(main.isRecording){return;};
            main.isRecording = true;

            Timer.init({
               sec:5,
                ms:0,
                speed:17,
                secBox:$(".time .s"),
                msBox:$(".time .ms")
            });//视图——倒计时
            var clock = setInterval(function(){
                if(Timer.ms<=0){
                    Timer.ms = 1000;
                    Timer.sec--;
                }
                else {
                    Timer.ms-=Timer.speed;
                }
                if(Timer.sec<0){
                    Timer.sec=0;
                    Timer.ms = "00";
                    clearInterval(clock);
                }

                Timer.secBox.html(Timer.sec);
                Timer.msBox.html(Math.round(Timer.ms/10)>9?Math.round(Timer.ms/10):("0"+Math.round(Timer.ms/10)));
            },Timer.speed);

           $(".bo1-bopng").addClass("none");
           $(".bo1-bogif").removeClass("none");

            main.startRecord()//开始录音
            setTimeout(function(){

                // main.stopRecord();

                //前端假回调
                /*语音录制成功回调*/
                main.isRecording = false;
                $(".bo1-bopng").removeClass("none");
                $(".bo1-bogif").addClass("none");
                $(".one").fo();
                $(".two").fi();

                /*语音识别成功回调*/
                $(".submit").removeClass("ui-chrome-btn-disable");
                main.analysisSuccess = true;
                main.translateResult = "语音识别的结果"
                $(".analysisResult").html(main.translateResult);
            },5000);
        });//点击开始录音
        $(".submit").on("touchend",function(){
            if(!main.analysisSuccess||(main.translateResult =="")){return;}//识别结果为空或者语音识别未成功，无法点击按钮
            Barrage.CreateOneBarrage({
                text:main.translateResult,
                delay:1,
                color:"red",
            });
            Barrage.AddOneBarrageToContainer(Barrage.barrages[Barrage.barrages.length-1],Barrage.barrages.length-1)
            console.log("数据上保存一条弹幕内容，上传服务器");

            if(main.prizeType){
                $(".prec-btnGroup .btn1").remove();
            }//抽过奖的移除按钮

            $(".op-tip2").fo();
            $(".analysisBox").fo();
            $(".prec-btnGroup").fi();
        });//提交识别结果，制作弹幕，上传识别文字结果+语音
        $(".btn-listen").on("touchend",function(){
            if(!main.isRecording){
                main.playRecord(main.localID);
            }
        });//试听
        $(".btn-restart").on("touchend",function(){
            main.translateResult = "";
            $(".analysisResult").html("");
            main.analysisSuccess = false;
            $(".submit").addClass("ui-chrome-btn-disable");

            $(".two").fo();
            $(".one").fi();

            $(".time .s").html("5");
            $(".time .ms").html("00");
        });
        $(".prec-btnGroup .btn1").on("touchend",function(){
            if(!main.isVip){
                main.alert({
                    text:main.alertTxt.reg,
                    type:3,
                    button:".alertbtn1"
                });
                return;
            }
            main.prize();//抽奖

            main.precordleave();
            main.pprize();
        });
        $(".prec-btnGroup .btn2").on("touchend",function(){
            main.pshare()
        });
        /////////precord//////////

        /////////prizeResult//////////
        $(".prz-btnGroup2 .btn2,.prz-btnGroup1 .btn2").on("touchend",function(){//分享
           main.pshare();
        });
        $(".prz-btnGroup2 .btn1").on("touchend",function(){
            main.pfill();
            main.pprizeleave();
        });
        $(".prz-btnGroup1 .btn1").on("touchend",function(){//查看券使用门店
            main.paddress();
        });
        /////////prizeResult//////////

        /////////pchaxunDoor//////////
        $(".pcdxx").on("touchend",function(){
            main.paddressleave();
        });
        main.FindSelect.$provinceObj.on("change",function(){
            main.FindSelect.provinceIndex = main.FindSelect.$provinceObj[0].selectedIndex;
            main.FindSelect.province = main.FindSelect.$provinceObj[0].options[main.FindSelect.provinceIndex].text;
            //更新视图
            main.FindSelect.str = main.FindSelect.province + main.FindSelect.city + main.FindSelect.address;
            main.FindSelect.contentBox.html(main.FindSelect.str);
        });
        main.FindSelect.$cityObj.on("change",function(){
            main.FindSelect.cityIndex = main.FindSelect.$cityObj[0].selectedIndex;
            main.FindSelect.city = main.FindSelect.$cityObj[0].options[main.FindSelect.cityIndex].text;
            //更新视图
            main.FindSelect.str = main.FindSelect.province + main.FindSelect.city + main.FindSelect.address;
            main.FindSelect.contentBox.html(main.FindSelect.str);
        });
        main.FindSelect.$addressObj.on("change",function(){
            main.FindSelect.addressIndex = main.FindSelect.$addressObj[0].selectedIndex;
            main.FindSelect.address = main.FindSelect.$addressObj[0].options[main.FindSelect.addressIndex].text;
            //更新视图
            main.FindSelect.str = main.FindSelect.province + main.FindSelect.city + main.FindSelect.address;
            main.FindSelect.contentBox.html(main.FindSelect.str);
        });
        /////////pchaxunDoor//////////

        /////////pfill//////////
        $(".fill-btn").on("touchend",function(){
            var patt_phone = /^1(3|4|5|7|8)\d{9}$/;
            var name = $("#name").val();
            var number = $("#phone").val();
            if(name==""){
                main.alert({
                    text:main.alertTxt.name,
                    type:1,
                    button:".alertbtn1"
                });
                return;
            }
            if(!(patt_phone.test(number))){
                main.alert({
                    text:main.alertTxt.phoneEmpty,
                    type:1,
                    button:".alertbtn1"
                });
                return;
            };

            main.FillSelect.str = main.FillSelect.$provinceObj[0].options[main.FillSelect.$provinceObj[0].selectedIndex].text +
                                  main.FillSelect.$cityObj[0].options[main.FillSelect.$cityObj[0].selectedIndex].text+
                                  main.FillSelect.$addressObj[0].options[main.FillSelect.$addressObj[0].selectedIndex].text;
            main.haveFill = true;
            main.pfillleave();
            main.pchaxun();
        });
        $("#phone").on({
            input:function(){
                Utils.limitNum(this);
            },
            keyup:function(){
                this.value=this.value.replace(/\D/g,'')
            },
            onafterpaste:function(){
                this.value=this.value.replace(/\D/g,'')
            }
        });
        main.FillSelect.$provinceObj.on("change",function(){
            main.FillSelect.provinceIndex = main.FillSelect.$provinceObj[0].selectedIndex;
            main.FillSelect.province = main.FillSelect.$provinceObj[0].options[main.FillSelect.provinceIndex].text;
        });
        main.FillSelect.$cityObj.on("change",function(){
            main.FillSelect.cityIndex = main.FillSelect.$cityObj[0].selectedIndex;
            main.FillSelect.city = main.FillSelect.$cityObj[0].options[main.FillSelect.cityIndex].text;
        });
        main.FillSelect.$addressObj.on("change",function(){
            main.FillSelect.addressIndex = main.FillSelect.$addressObj[0].selectedIndex;
            main.FillSelect.address = main.FillSelect.$addressObj[0].options[main.FillSelect.addressIndex].text;
        });
        /////////pfill//////////

        /////////pchaxun//////////
        $(".chaxun-btnGroup2 .btn2").on("touchend",function(){
           main.pshare();
        });
        $(".chaxun-btnGroup1 .btn1").on("touchend",function(){
            main.paddress();
        });
        $(".chaxun-btnGroup1 .btn2").on("touchend",function(){
            main.pshare()
        });
        $(".pcxxx").on("touchend",function(){
            main.pchaxunleave();
            main.back();
        });
        /////////pchaxun//////////

        /////////pend//////////
        $(".pend-btn").on("touchend",function(){
            main.pend1leave();
            main.pchaxun()
        });
        /////////pend//////////

        /////////palert//////////
        $(".alertxx").on("touchend",function(e){//alert关闭
            e.stopPropagation();
            main.alertClose();
            return false;
        });
        $(".alertBox1 .alertbtn1").on("touchend",function(e){//立即填写
            e.stopPropagation();
            main.alertClose();
            return false;
        });
        $(".alertBox3 .alertbtn1").on("touchend",function(e){//前往注册
            e.stopPropagation();
            main.alertClose();
            window.location.href = "index.html";
            return false;
        });
        /////////palert//////////

        $(".music-btn ").on("touchend",function(){
            if(main.bgm.isPlay){
                main.pausebgm()
            }
            else{
                main.playbgm()
            }
        });
        $(".P_share").on("touchend",function(){
            $(this).fo();
        })
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
    main.scrollInit = function(selector,start){
        this.touch.ScrollObj = $(selector);
        this.touch.container = $(selector).parent();
        this.touch.StartY = 0;
        this.touch.NewY = 0;
        this.touch.addY = 0;
        this.touch.scrollY = 0;
        this.touch.limitDown = this.touch.ScrollObj.height()<this.touch.container.height()?0:(this.touch.container.height()-this.touch.ScrollObj.height());
    };
    main.back = function(){
        console.log(this.router)
      switch(this.router){
          case "pvideo":
              main.pvideo();
              break;
          case "pend1":
              main.pend1();
              break;
          default:
              main.pvideo();
              break;
      }
    };

    a.main = main;

/*-----------------------------事件绑定--------------------------------*/
}(window));
$(function(){
    main.init();
    main.start();
    // main.playbgm();
});




