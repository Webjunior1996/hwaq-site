'use strict';

(function () {
    // 获取当前脚本标签
    var currentScript = document.currentScript || function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    }();

    // 解析参数
    var src = currentScript.src;
    var params = new URLSearchParams(src.split('?')[1] || '');
    var type = params.get('type');

    // 根据参数执行不同逻辑
    switch (type) {
        case '1':
            mobile01();
            break;
        case '2':
            mobile02();
            break;
        case '3':
            mobile03();
            break;
        case '4':
            mobile04();
            break;
        case '5':
            mobile05();
            break;
        default:
            mobile05();
            break;
    }

    // 示例函数
    function mobile01() {
        $(function () {
            var $menuWrap = $('.mobile-menu-wrap01');
            var $menu = $('#mobileMenu');
            var $overlay = $('#overlay');
            var $stack = $('.stack');
            var $firstPanel = $stack.find('.panel:first');

            $stack.find('li a').filter(function () {
                if ($(this).siblings('ul').length) {
                    $(this).after('<span class="chev"><i class="iconfont iconfont-you"></i></span>');
                }
            });

            function openMenu() {
                if ($menu.hasClass('show')) return;
                $menuWrap.attr('aria-hidden', 'false');
                $menu.addClass('show');
                $overlay.addClass('show');
            }

            function closeMenu() {
                if (!$menu.hasClass('show')) return;
                $menu.removeClass('show');
                $overlay.removeClass('show');
                setTimeout(function () {
                    $menuWrap.attr('aria-hidden', 'true');
                    resetStack();
                }, 100);
            }

            $('#openMenu').click(openMenu);
            $('#closeMenu,#overlay').click(closeMenu);

            function resetStack() {
                // $stack.find('.panel').not($firstPanel).remove();
                // $stack.find('.panel').removeAttr('style')
                // $firstPanel.addClass('active show').removeClass('hide');
                $firstPanel.find('ul ul').addClass('hide').removeClass('show');
                // $firstPanel.find('.back-btn').addClass('hide').removeClass('show');
            }

            $stack.on('click', '.chev', function (e) {
                e.stopPropagation();
                var $li = $(this).closest('.menu-item');
                var $subUl = $li.children('ul');

                if ($subUl.length) {
                    var $newPanel = $('\n                    <div class="panel o-auto">\n                        <div class="panel-header flex flex-ac">\n                            <button class="back-btn"><i class="iconfont iconfont-jiantou-zuo"></i> </button>\n                            <span class="panel-title">' + $li.find('> a').text() + '</span>\n                        </div>\n                        <div class="panel-body o-auto"></div>\n                    </div>\n                ');

                    var $clone = $subUl.children().clone(true);
                    $clone.find('ul').hide();
                    $newPanel.find('.panel-body').append($clone);

                    var $current = $stack.find('.panel.active');
                    $current.removeClass('active').css('transform', 'translateX(-100%)');

                    $stack.append($newPanel);
                    setTimeout(function () {
                        $newPanel.addClass('active').css('transform', 'translateX(0)');
                    }, 10);
                }
            });

            $stack.on('click', '.back-btn', function () {
                var $current = $(this).closest('.panel');
                var $prev = $current.prev('.panel');

                $current.css('transform', 'translateX(100%)');
                $prev.addClass('active').css('transform', 'translateX(0)');
                setTimeout(function () {
                    $current.remove();
                }, 300);
            });

            resetStack();
        });
    }

    function mobile02() {
        $(function () {
            var $menuFull = $('#menuFull'),
                $stack = $('.stack'),
                $firstPanel = $stack.find('.panel:first');

            $stack.find('li a').filter(function () {
                if ($(this).siblings('ul').length) {
                    $(this).after('<span class="chev"><i class="iconfont iconfont-you"></i></span>');
                }
            });
            function openMenu() {
                $menuFull.addClass('open');
            }
            function closeMenu() {
                $menuFull.removeClass('open');
                resetStack();
            }

            $('#openMenu').click(openMenu);
            $('#closeMenu').click(closeMenu);

            function resetStack() {
                $stack.find('.panel').not($firstPanel).remove();
                $firstPanel.addClass('active');
            }

            $stack.on('click', '.chev', function (e) {
                e.stopPropagation();
                var $li = $(this).closest('.menu-item');
                var $subUl = $li.children('ul');

                if ($subUl.length) {
                    var $newPanel = $('\n                    <div class="panel o-auto">\n                        <div class="panel-header flex flex-ac">\n                            <button class="back-btn"><i class="iconfont iconfont-jiantou-zuo"></i> </button>\n                            <span class="panel-title">' + $li.find('> a').text() + '</span>\n                        </div>\n                        <div class="panel-body o-auto"></div>\n                    </div>\n                ');

                    var $clone = $subUl.children().clone(true);
                    $clone.find('ul').hide();
                    $newPanel.find('.panel-body').append($clone);

                    var $current = $stack.find('.panel.active');
                    $current.removeClass('active').css('transform', 'translateX(-100%)');

                    $stack.append($newPanel);
                    setTimeout(function () {
                        $newPanel.addClass('active').css('transform', 'translateX(0)');
                    }, 10);
                }
            });

            $stack.on('click', '.menu-item', function (e) {
                e.stopPropagation();
                var link = $(this).data('link');
                var subId = $(this).data('sub');
                if (link) {
                    window.location.href = link;return;
                }
                if (subId) {
                    var $subContent = $('#' + subId).children().clone(true);
                    createPanel($(this).text().replace(' ›', ''), $('<ul class="menu-list"></ul>').append($subContent));
                }
            });

            $stack.on('click', '.back-btn', function () {
                var $current = $(this).closest('.panel');
                var $prev = $current.prev('.panel');

                $current.css('transform', 'translateX(100%)');
                $prev.addClass('active').css('transform', 'translateX(0)');
                setTimeout(function () {
                    $current.remove();
                }, 300);
            });
        });
    }

    function mobile03() {
        $('body').on('click', '.oxy-menu-toggle', function () {
            $(this).parent('.oxy-nav-menu').toggleClass('oxy-nav-menu-open');
            $('body').toggleClass('oxy-nav-menu-prevent-overflow');
            $('html').toggleClass('oxy-nav-menu-prevent-overflow');
        });

        $('.oxy-nav-menu .menu-main-menu-container ul li').each(function () {
            if ($(this).find('ul').length) {
                $(this).append("<i class='iconfont iconfont-previewright'></i>");
            }

            $(this).children('i').click(function () {
                console.log(1);
                $(this).siblings('ul').toggle();
            });
        });

        $('.oxy-menu-langs').click(function () {
            $(this).toggleClass('on');
        });
    }
    function mobile04() {
        $("#menu-on").add($("#mobile3 .m-btn")).add($("#mobile3")).click(function (e) {
            $("#mobile3").toggleClass('active');
        });
        $("#mobile3>div").click(function (e) {
            e.stopPropagation()
        });
        
        $("#mobile3 .m-nav ul li").filter(function () {
            if ($(this).children('ul').length) {
                $(this).addClass('children');
                $(this).append("<i></i>")
            }
        });
        $("#mobile3 .m-nav ul li i").click(function (e) {
            if ($(this).siblings('ul').length) {
                e.preventDefault();
                $(this).siblings('ul').slideToggle(300);
                $(this).parent().toggleClass('active')
            }
        });
    }
    function mobile05() {
        $("#menu-on5").add($("#menu-off5")).add($("#mobile5")).click(function (e) {
            $("#mobile5").toggleClass('active');
            $("html").toggleClass('mobile');
        });
        $("#mobile5>div").click(function (e) {
            e.stopPropagation();
        });
        $('#mobile5 .menu-main-menu-container ul li a').each(function () {
            if ($(this).siblings('ul').length) {
                $(this).append("<i class='iconfont iconfont-previewright'></i>");
            }
        });
        $("#mobile5 .menu-main-menu-container ul li a i").click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).siblings('ul').stop().slideToggle(200);
        });
    }
})();