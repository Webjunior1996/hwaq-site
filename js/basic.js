"use strict";

$(document).ready(function () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion < 9 && isIE) {
        alert('您的浏览器版本为IE' + fIEVersion + ',为了提高您的浏览体验，请对您的浏览器升级！\nYour browser version is IE' + fIEVersion + '. In order to improve your browsing experience, please upgrade your browser!');
    }

    new WOW().init();

    $('ul.menu>li a').filter(function () {
        if ($(this).attr('href').split('/')[1] == window.location.pathname.split('/')[1]) {
            $(this).parents('li').addClass('active');
        }
    });

    $("#menu-on").add($("#menu-off")).add($("#mobile")).click(function (e) {
        $("#mobile").toggleClass('active');
        $("html").toggleClass('mobile');
    });
    $("#mobile>div").click(function (e) {
        e.stopPropagation();
    });
    if (window.innerWidth <= 700) {
        document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 60 + 'px';
    }
    $(window).resize(function () {
        if (window.innerWidth <= 700) {
            document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 60 + 'px';
        } else {
            document.getElementsByTagName('html')[0].removeAttribute('style');
        }
    });
    var oSerBtn = $('.h-search'),
        oSerBox = $('.search-box'),
        oSerClose = oSerBox.find('.close');oSerBtn.click(function () {
        oSerBox.fadeIn(200);
    });oSerClose.click(function () {
        oSerBox.hide();
    });
    if (document.getElementById('ewm')) {
        new QRCode(document.getElementById("ewm"), {
            text: $("#ewm").attr('data-href') ? $("#ewm").attr('data-href') : window.location.href,
            correctLevel: 3
        });
    }

    $(document).on('click', "a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.mp4']", function (e) {
        e.preventDefault();
        if ($(this).attr('data-fancybox')){return false}
        $.fancybox.open({
            src  : $(this).attr('href'),
            type : $(this).attr('href').match(/\.mp4$/) ? 'video' : 'image'
        });
    });


    $(".svg").filter(function () {
        var that = $(this),
            lang = window.location.hostname.split('.')[0] ? that.attr('data-lang') : '',
            box = that.parent();
        box.load(that.attr('src'), function () {
            box.find('g.' + lang).show().siblings().hide();
            if (lang === 'cn') {
                console.log(box.children('svg').innerHeight());
                box.children('svg').attr('style', 'max-height:' + (box.children('svg').innerHeight() - 10) + 'px');
            }
        });
    });

    $(window).scroll(function () {
        if ($(document).scrollTop() > 150) {
            $("#header").addClass('active');
        } else {
            $("#header").removeClass('active');
        }
    });

    $(".slick").filter(function () {
        var T = $(this);
        var num = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10 };
        var classNames = T[0].className.split(/\s+/);
        var found = classNames.find(function (cls) {
            return num[cls] !== undefined;
        });
        var value = found ? num[found] : 1;

        let slickOptions = {
            num: value,
            arrows: T.siblings('.slickBtn').length===1,
            prevArrow: T.siblings('.slickBtn').find('.prev'),
            nextArrow: T.siblings('.slickBtn').find('.next'),
            dots: T.siblings('.slickDots').length===1,
            appendDots: T.siblings('.slickDots')
        }

        T.slick({
            autoplay: true,
            pauseOnHover: false,
            speed: 1500,
            autoplaySpeed: 5000,
            slidesToShow: slickOptions.num,
            swipeToSlide: true,
            touchThreshold: 100,
            // centerMode:true,
            centerPadding: '0',
            arrows: slickOptions.arrows,
            prevArrow: slickOptions.prevArrow,
            nextArrow: slickOptions.nextArrow,
            dots: slickOptions.dots,
            appendDots: slickOptions.appendDots,
            responsive: [{
                breakpoint: 1250,
                settings: {
                    slidesToShow: Math.ceil(slickOptions.num * .7)
                }
            }, {
                breakpoint: 1000,
                settings: {
                    slidesToShow: Math.ceil(slickOptions.num * .5)*T.hasClass('wap')?2:1
                }
            }, {
                breakpoint: 700,
                settings: {
                    slidesToShow: Math.ceil(slickOptions.num * .3)*T.hasClass('wap')?2:1
                }
            }, {
                breakpoint: 500,
                settings: {
                    slidesToShow: Math.ceil(slickOptions.num * .2)*T.hasClass('wap')?2:1
                }
            }]
        });
    });

    function formSubmit(url, form) {
        var sUrl = window.location.search;
        if (sUrl.indexOf('?gad_source=5') !== -1) {
            return false;
        }
        layer.load(0, { shade: 0.1, shadeClose: false });
        $.ajax({
            type: 'post',
            url: url,
            processData: false,
            contentType: false,
            data: new FormData(form[0]),
            dataType: 'json',
            success: function success(data) {
                layer.closeAll();
                if (data.status == 200) {
                    layer.msg(data.result, { icon: 1, time: 4000 });
                } else {
                    layer.msg(data.result, { icon: 2, time: 4000 });
                }
            }
        });
    }
    $("#cp-Nav .nav div.title,#cp-Nav .nav i.mask").click(function () {
        $("#cp-Nav .nav>ul,#cp-Nav .nav>i.mask").fadeToggle(200);
    });

    $("form[action] *[type='submit']").click(function (e) {
        if ($(this).parents('form').serialize().includes('your-message=')) {
            e.preventDefault();
            e.stopPropagation();
            formSubmit($(this).parents('form').attr('action'), $(this).parents('form'));
        }
    });

    $("a[href^='#']").on("click", function (event) {
        if ($($(this).attr('href')).length) {
            event.preventDefault();
            event.stopPropagation();
            $("body,html").animate({ scrollTop: $($(this).attr('href')).offset().top }, 1000);
        }
    });

    if ($(".backImg-fixed").length) $(".backImg-fixed").filter(function (){$.plugin.BG_parallax($(this));})
    if ($(".number-Plus").length) $(".number-Plus").filter(function (){$.plugin.NUMBER_plus($(this));})

    if ($.cookie('Advertising') != undefined) {
        $("#Advertising").hide()
    }
    $("#Advertising .close").click(function (){
        $("#Advertising").fadeOut(200)
        $.cookie('Advertising', '1', { path: '/' });
    })

    $("#sidebar .top").on('click.sidebar',function (){
        $("body,html").animate({scrollTop:0},1000)
    })

    // window.hwaqCookiePrivacy = {
    //     type: 'banner',
    //     position: 'bottom',
    // };
    //
    // if (window.refreshHwaq !== undefined) {
    //     window.refreshHwaq();
    // }

    if (window.lang === 'sa') {
        function wrapPhoneNumbers(root = document.body) {
            const PHONE_REG = /(?:(?:\+?86|0086)?[-\s]*(?:1(?:[-\s]*\d){10}|(?:(?:\(0\)|0)?\d{2,3})(?:[-\s]*\d){6,8}))|(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                null
            );

            const nodes = [];
            let node;

            while ((node = walker.nextNode())) {
                PHONE_REG.lastIndex = 0;
                if (PHONE_REG.exec(node.nodeValue)) {
                    nodes.push(node);
                }
            }

            nodes.forEach(textNode => {
                const text = textNode.nodeValue;
                PHONE_REG.lastIndex = 0;

                const frag = document.createDocumentFragment();
                let lastIndex = 0;
                let match;


                while ((match = PHONE_REG.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        frag.appendChild(
                            document.createTextNode(text.slice(lastIndex, match.index))
                        );
                    }

                    const bdi = document.createElement('bdi');
                    bdi.textContent = match[0];
                    bdi.setAttribute('dir', 'ltr');
                    bdi.style.fontSize = '1em';
                    frag.appendChild(bdi);

                    lastIndex = match.index + match[0].length;
                }

                if (lastIndex < text.length) {
                    frag.appendChild(
                        document.createTextNode(text.slice(lastIndex))
                    );
                }

                textNode.parentNode.replaceChild(frag, textNode);
            });
        }

        wrapPhoneNumbers();
    }

});