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

    ;(function () {
        var normalize = function normalize(p) {
            return p.replace(/\/+$/, '') || '/';
        };
        var current = normalize(window.location.pathname);

        var bestMatch = null;
        var bestLen = 0;
        document.querySelectorAll('ul.menu a[href]').forEach(function (a) {
            var href = a.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href === 'javascript:;') return;

            var target = normalize(href);
            if (target === '/') {
                if (current === '/' && bestLen < 1) {
                    bestLen = 1;bestMatch = a;
                }
                return;
            }
            if (current === target || current.startsWith(target + '/')) {
                if (target.length > bestLen) {
                    bestLen = target.length;bestMatch = a;
                }
            }
        });

        if (bestMatch) {
            var li = bestMatch.closest('li');
            while (li) {
                li.classList.add('active');
                li = li.parentElement.closest('li');
            }
        }
    })();

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
        if ($(this).attr('data-fancybox')) {
            return false;
        }
        $.fancybox.open({
            src: $(this).attr('href'),
            type: $(this).attr('href').match(/\.mp4$/) ? 'video' : 'image'
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

    var NUM_MAP = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    var ROW_MAP = { row1: 1, row2: 2, row3: 3, row4: 4, row5: 5, row6: 6, row7: 7, row8: 8, row9: 9, row10: 10 };

    $(".slick").filter(function () {
        var T = $(this);
        var classNames = this.className.split(/\s+/);

        var found = classNames.find(function (cls) {
            return NUM_MAP[cls] !== undefined;
        });
        var rowfound = classNames.find(function (cls) {
            return ROW_MAP[cls] !== undefined;
        });

        var value = found ? NUM_MAP[found] : 1;
        var rowvalue = rowfound ? ROW_MAP[rowfound] : 1;
        var center = classNames.indexOf('center') > -1;
        var isWap = T.hasClass('wap');

        var $btn = T.siblings('.slickBtn');
        var $dots = T.siblings('.slickDots');

        T.slick({
            autoplay: true,
            pauseOnHover: false,
            speed: 1500,
            autoplaySpeed: 5000,
            slidesToShow: value,
            swipeToSlide: true,
            touchThreshold: 100,
            rows: rowvalue,
            centerMode: center,
            centerPadding: '0',
            arrows: $btn.length === 1,
            prevArrow: $btn.find('.prev'),
            nextArrow: $btn.find('.next'),
            dots: $dots.length === 1,
            appendDots: $dots,
            responsive: [{
                breakpoint: 1250,
                settings: { slidesToShow: Math.ceil(value * .7) }
            }, {
                breakpoint: 1000,
                settings: { slidesToShow: Math.ceil(value * .5 * (isWap ? 2 : 1)), rows: Math.ceil(rowvalue * .5) }
            }, {
                breakpoint: 700,
                settings: { slidesToShow: Math.ceil(value * .3 * (isWap ? 1.8 : 1)), rows: Math.ceil(rowvalue * .3) }
            }, {
                breakpoint: 500,
                settings: { slidesToShow: Math.ceil(value * .2 * (isWap ? 1.5 : 1)), rows: Math.ceil(rowvalue * .2) }
            }]
        });
    });

    $("#cp-Nav .nav div.title,#cp-Nav .nav i.mask").click(function () {
        $("#cp-Nav .nav>ul,#cp-Nav .nav>i.mask").fadeToggle(200);
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

    $("form[action] [type='submit']").click(function (e) {
        var $form = $(this).closest('form');

        if ($form.serialize().includes('your-message=')) {
            e.preventDefault();
            e.stopPropagation();
            formSubmit($form.attr('action') ? $form.attr('action') : '/Api/contact/submit/uid/1.html', $form);
        }
    });

    $("a[href^='#']").on("click", function (event) {
        if ($($(this).attr('href')).length) {
            event.preventDefault();
            event.stopPropagation();
            $("body,html").animate({ scrollTop: $($(this).attr('href')).offset().top }, 1000);
        }
    });

    if ($(".backImg-fixed").length) $(".backImg-fixed").filter(function () {
        $.plugin.BG_parallax($(this), $(this).attr('data-sp'));
    });
    if ($(".number-Plus").length) $(".number-Plus").filter(function () {
        $.plugin.NUMBER_plus($(this));
    });

    if ($.cookie('Advertising') != undefined) {
        $("#Advertising").hide();
    }
    $("#Advertising .close").click(function () {
        $("#Advertising").fadeOut(200);
        $.cookie('Advertising', '1', { path: '/' });
    });

    $("#sidebar .top").on('click.sidebar', function () {
        $("body,html").animate({ scrollTop: 0 }, 1000);
    });

    window.hwaqCookiePrivacy = {
        type: 'banner',
        position: 'bottom'
    };

    if (window.refreshHwaq !== undefined) {
        window.refreshHwaq();
    }

    if (window.lang === 'sa') {
        var wrapPhoneNumbers = function wrapPhoneNumbers() {
            var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

            var PHONE_REG = /(?:(?:(?:\(\+?86\))|(?:\+?86)|0086)?[-\s]*(?:1(?:[-\s]?\d){10}|(?:\(?0\d{2,3}\)?)(?:[-\s]?\d){6,8}))|(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

            var nodes = [];
            var node = void 0;

            while (node = walker.nextNode()) {
                PHONE_REG.lastIndex = 0;
                if (PHONE_REG.exec(node.nodeValue)) {
                    nodes.push(node);
                }
            }

            nodes.forEach(function (textNode) {
                var text = textNode.nodeValue;
                PHONE_REG.lastIndex = 0;

                var frag = document.createDocumentFragment();
                var lastIndex = 0;
                var match = void 0;

                while ((match = PHONE_REG.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                    }

                    var bdi = document.createElement('bdi');
                    bdi.textContent = match[0];
                    bdi.setAttribute('dir', 'ltr');
                    bdi.style.fontSize = '1em';
                    frag.appendChild(bdi);

                    lastIndex = match.index + match[0].length;
                }

                if (lastIndex < text.length) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
                }

                textNode.parentNode.replaceChild(frag, textNode);
            });
        };

        wrapPhoneNumbers();
    }
});