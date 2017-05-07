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

    var main = new function(){
        this.localID = undefined;//拿到的本地ID

        this.bgm ={
            obj:document.getElementById("bgm"),
            id:"bgm",
            isPlay:false,
            button:$(".music-btn")
        };

    };
    main.init=function(){
        main.initBarrage();
        // this.localId = "";
    };
    main.start=function(){
        main.showBarrage();
        Barrage.updateBarrageContainerSize();
        Barrage.AddAllBarrageToContainer();
    };
    main.playbgm=function(){
        Media.playMedia(this.bgm.id);
        this.bgm.button.addClass("ani-bgmRotate");
        this.bgm.isPlay = true;
    };
    main.pausebgm=function(){
        this.bgm.obj.pause();
        this.bgm.button.removeClass("ani-bgmRotate");
        this.bgm.isPlay = false;
    };
    main.addEvent=function(){
        $(".rec-play").on("touchend",function(){
            main.playRecord(main.localId);
            $(".bostatic").removeClass("none");
            $(".bogif").addClass("none");
        });
        main.onPlayEnd();
        $(".barrage-btn").on("touchend",function(){
            if(Barrage.isOpen){
                main.hideBarrage();
            }
            else{
                main.showBarrage();
            }
        });
        $(".music-btn ").on("touchend",function(){
            if(main.bgm.isPlay){
                main.pausebgm()
            }
            else{
                main.playbgm()
            }
        });
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

    main.playRecord = function(localID){
        wx.playVoice({
            localId: localID // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    };//播放语音
    main.onPlayEnd = function(){
        wx.onVoicePlayEnd({
            success: function (res) {
                // var localId = res.localId; // 返回音频的本地ID
                $(".bostatic").addClass("none");
                $(".bogif").removeClass("none");
            }
        });
    };

    a.main = main;

/*-----------------------------事件绑定--------------------------------*/
}(window));
$(function(){
    main.init();
    main.start();
    main.addEvent();
    main.playbgm();
});




