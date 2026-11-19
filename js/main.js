"use strict";

$(document).ready(function () {
    $("#index-body .init-4 .list ul").slick('slickSetOption', {
        centerMode: true
    }, 1);

    $("#index-body .init-5 .list .slide").filter(function () {
        var T = $(this);
        T.find('ul').slick('slickSetOption', {
            arrows: true,
            prevArrow: T.find('.prev').length ? T.find('.prev') : '',
            nextArrow: T.find('.next').length ? T.find('.next') : '',
            variableWidth: true
        }, 1);
    });
});