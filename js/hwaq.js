'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$(document).ready(function () {
    window.lang = document.documentElement.lang;
    window.href = location.host
    $.plugin = {
        NUMBER_plus: function NUMBER_plus(obj, set_num, speed) {
            if (!speed) speed = 60;
            if (!set_num) set_num = 50;
            var scroll_lock = true;
            $(window).scroll(function () {
                if ($(document).scrollTop() + $(window).height() > obj.offset().top && obj.offset().top + obj.innerHeight() > $(document).scrollTop() && scroll_lock) {
                    scroll_lock = false;
                    var time_lock = 0,
                        This = obj.find('li'),
                        // 获取对象
                        num = []; // 数据容器
                    var set_plus = setInterval(function () {
                        // 数字相加
                        This.each(function (index) {
                            if (!num[index]) num[index] = $(this).find('em').attr('data-num') * 1 / set_num;else num[index] += $(this).find('em').attr('data-num') * 1 / set_num;
                            if ($(this).find('em').hasClass('d'))
                                $(this).find('em').text(parseInt(num[index]).toLocaleString());
                            else
                                $(this).find('em').text(parseInt(num[index]));
                            if (num[index] > $(this).find('em').attr('data-num') * 1) {
                                if ($(this).find('em').hasClass('d'))
                                    $(this).find('em').text(($(this).find('em').attr('data-num') * 1).toLocaleString());
                                else
                                    $(this).find('em').text($(this).find('em').attr('data-num') * 1);
                                time_lock++;
                            }
                        });
                        if (time_lock >= num.length) {
                            // 清理多余执行
                            clearInterval(set_plus);
                        }
                    }, speed);
                }
            });
        },
        BG_parallax: function BG_parallax(obj, speed) {
            if (!speed) speed = .5;
            $(window).scroll(function () {
                obj.css({
                    'background-position-y': (obj.offset().top + obj.innerHeight() / 2 - ($(document).scrollTop() + $(window).height() / 2)) * speed
                });
            });
            obj.css({
                'background-position-y': (obj.offset().top + obj.innerHeight() / 2 - ($(document).scrollTop() + $(window).height() / 2)) * speed
            });
        },
        Interval_Fun: function Interval_Fun(obj, means, cycle, position) {
            if (!position) position = 2;
            if (!cycle) var cycle_num = 0;
            $(window).scroll(function () {
                if (obj.offset().top + obj.innerHeight() / position < $(document).scrollTop() + $(window).height() && obj.offset().top + obj.innerHeight() / position > $(document).scrollTop()) {
                    cycle_num++;
                    if (!cycle && cycle_num <= 1) means();else if (cycle) means();
                }
            });
            if (obj.offset().top + obj.innerHeight() / position < $(document).scrollTop() + $(window).height() && obj.offset().top + obj.innerHeight() / position > $(document).scrollTop()) {
                cycle_num++;
                if (!cycle && cycle_num <= 1) means();else if (cycle) means();
            }
        },
        Video_open: function Video_open(obj) {
            var src,
                btn,
                img,
                tag,
                method = obj.attr('data-mode');
            if (obj.attr('data-src')) src = obj.attr('data-src');else return;
            if (obj.attr('data-img')) img = obj.attr('data-img');
            btn = obj.attr('data-btn') ? obj.attr('data-btn') : '#000';
            if (!method) tag = '<video controls autoplay poster=' + img + ' src=' + src + '></video>';else tag = '<iframe width="1000" height="540" src="' + src + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            var video = "<div class='video_box active'>" + tag + "<i class='video_close fa fa-close'></i></div><i class='video_mask active'></i>",
                css = "<style type='text/css' id='video_css'>.video_box {position: fixed;display: inline-block;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%) scale(1, 1);-moz-transform: translate(-50%, -50%) scale(1, 1);-ms-transform: translate(-50%, -50%) scale(1, 1);-o-transform: translate(-50%, -50%) scale(1, 1);transform: translate(-50%, -50%) scale(1, 1);z-index: 1000;max-width: 90%; max-height: 90%;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;-webkit-transform-origin: center center;-moz-transform-origin: center center;-ms-transform-origin: center center;-o-transform-origin: center center;transform-origin: center center;zoom: 1;}.video_box video,.video_box iframe {background-color:black;max-width: 100%;max-height: 100%;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;}.video_box i.video_close {position: absolute;height: 40px;width: 40px;border-radius: 100%;background: " + btn + ";display: block;right: -20px;top: -20px;cursor: pointer;cursor: hand;text-align: center;line-height: 40px;color: white;font-size: 18px;opacity: 0;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;}.video_box:hover i.video_close {opacity: 1;}.video_box.active {-webkit-transform: translate(-50%, -50%) scale(0.3, 0.3);-moz-transform: translate(-50%, -50%) scale(0.3, 0.3);-ms-transform: translate(-50%, -50%) scale(0.3, 0.3);-o-transform: translate(-50%, -50%) scale(0.3, 0.3);transform: translate(-50%, -50%) scale(0.3, 0.3);zoom: .3;}i.video_mask {position: fixed;top: 0;left: 0;z-index: 900;background: rgba(0, 0, 0, 0.5);height: 100%;width: 100%;-webkit-transition: .5s .2s;-moz-transition: .5s .2s;-ms-transition: .5s .2s;-o-transition: .5s .2s;transition: .5s .2s;opacity: 1;}i.video_mask.active {opacity: 0;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;}.video_box video, .video_box iframe {min-width: 900px;}@media screen and (max-width: 1000px) { .video_box video, .video_box iframe {min-width: 600px;display: block;max-height: 340px !important;}}@media screen and (max-width: 700px) {.video_box video, .video_box iframe { min-width: 400px; display: block;max-height: 240px !important;}}@media screen and (max-width: 500px) {.video_box video, .video_box iframe {min-width: 300px;display: block; max-height: 170px !important;}}</style>";
            obj.click(function () {
                $("body").append(video).append(css).animate(200, function () {
                    $(".video_box").add($(".video_mask")).removeClass('active');
                });
                $("i.video_mask").add($("i.video_close")).one('click', function () {
                    $(".video_box").add($("i.video_mask")).add($("#video_css")).remove();
                });
            });
        },
        Pop_Ups: function Pop_Ups(obj, model, btn_, lang) {
            lang = {
                lang: window.lang,
                title: 'Submit feedback',
                name: 'Name',
                mail: 'Email',
                phone: 'Phone',
                message: 'Message',
                send: 'Send'
            };
            switch (lang.lang) {
                case 'cn':
                    lang['title'] = '留言反馈';lang['name'] = '姓名';lang['mail'] = '邮箱';lang['phone'] = '电话';lang['message'] = '留言内容';lang['send'] = '立即提交';
                    break;
                case 'vi':
                    lang['title'] = 'Phản hồi tin nhắn';lang['name'] = 'Tên';lang['mail'] = 'Hộp thư';lang['phone'] = 'Điện thoại';lang['message'] = 'Nội dung tin nhắn';lang['send'] = 'Gửi ngay';
                    break;
                case 'tr':
                    lang['title'] = 'Mesaj geri verisi';lang['name'] = 'Tam isim';lang['mail'] = 'posta kutusu';lang['phone'] = 'Telefon';lang['message'] = 'Mesaj İçindeki';lang['send'] = 'Şimdi gönderin';
                    break;
                case 'ru':
                    lang['title'] = 'Обратная связь';lang['name'] = 'Имя';lang['mail'] = 'Почта';lang['phone'] = 'телефон';lang['message'] = 'Содержание сообщения';lang['send'] = 'Отправить сейчас';
                    break;
                case 'es':
                    lang['title'] = 'Realimentación';lang['name'] = 'Nombre';lang['mail'] = 'Correo';lang['phone'] = 'Teléfono';lang['message'] = 'Contenido del mensaje';lang['send'] = 'Aplique ahora';
                    break;
                case 'sa':
                    lang['title'] = 'ردود الفعل';lang['name'] = 'اسم';lang['mail'] = 'بريد';lang['phone'] = 'هاتف';lang['message'] = 'محتوى الرسالة';lang['send'] = 'أرسل الآن';
                    break;
                case 'de':
                    lang['title'] = 'Feedback';lang['name'] = 'Name';lang['mail'] = 'Email';lang['phone'] = 'Telefon';lang['message'] = 'Nachrichteninhalt';lang['send'] = 'Jetzt Absenden';
                    break;
                case 'jp':
                    lang['title'] = 'フィードバック';lang['name'] = '名前';lang['mail'] = 'Eメール';lang['phone'] = '電話';lang['message'] = 'メッセージの内容';lang['send'] = 'メッセージを送る';
                    break;
                case 'kr':
                    lang['title'] = '피드백';lang['name'] = '이름';lang['mail'] = '우편';lang['phone'] = '전화';lang['message'] = '메시지 내용';lang['send'] = '지금 제출';
                    break;
                case 'fr':
                    lang['title'] = 'Retour d\'information';lang['name'] = 'Nom';lang['mail'] = 'Courrier';lang['phone'] = 'Téléphone';lang['message'] = 'Contenu du message';lang['send'] = 'Soumettre maintenant';
                    break;
            }
            var css = '<style type=\'text/css\' id=\'Pop_Ups_css\'>#pups_from{position:fixed;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-height:80%;width:500px;max-width:90%;-o-box-shadow:0 0 10px rgba(0,0,0,0.1);-webkit-box-shadow:0 0 10px rgba(0,0,0,0.1);box-shadow:0 0 10px rgba(0,0,0,0.1);z-index:22;background:white;padding:30px;overflow:auto}#pups_from h4{font-size:18px;color:#222;text-transform:capitalize;line-height:1;font-weight:bold;position: absolute;left: 0;width: 100%;top: 0;padding: 15px 20px;background: #f5f5f5;-moz-box-shadow: 0 0 5px rgba(0,0,0,.1);-o-box-shadow: 0 0 5px rgba(0,0,0,.1);box-shadow: 0 0 5px rgba(0,0,0,.1);}#pups_from form {margin-top: 40px;}#pups_from i.close{width:30px;height:30px;position:absolute;top:10px;right:10px;background:#eee;cursor:pointer;cursor:hand;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;}#pups_from i.close:after,#pups_from i.close:before{content:\'\';-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;width:70%;height:2px;margin-top:-1px;background:black;position:absolute;top:50%;left:15%;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}#pups_from i.close:after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg)}#pups_from i.close:hover{background: var(--color);}#pups_from i.close:hover:after,#pups_from i.close:hover:before{background: white;}#pups_from form ul li{margin-bottom:10px;position:relative}#pups_from form ul li label{font-size:14px;margin-bottom: 10px;display: block;}#pups_from form ul li label em{color:red;margin-right:2px}#pups_from form ul li input,#pups_from form ul li textarea{width:100%;line-height:24px;padding:6px 15px;border:1px solid #eee;-webkit-transition:.5s;-moz-transition:.5s;transition:.5s;font-size:16px}#pups_from form ul li input:focus,#pups_from form ul li textarea:focus{border-color:var(--color)}#pups_from form ul li textarea{height:80px}#pups_from form ul li input[type="submit"]{width:auto;padding:6px 40px;display:inline-block;background:var(--color);color:white;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;}#pups_from form ul li input[type="submit"]:hover{opacity: .7}#pups_from form ul li:last-child{margin-bottom:0}#Pop_UpsBtn{width: 60px;height: 60px;line-height: 60px;text-align: center;position: fixed;border-radius: 100%;background: var(--color);color:white;right: 2%;bottom: 5%;font-size: 24px;-moz-box-shadow: 0 2px 7px rgba(0,0,0,.3);-o-box-shadow: 0 2px 7px rgba(0,0,0,.3);box-shadow: 0 2px 7px rgba(0,0,0,.3);cursor: pointer;cursor: hand;-webkit-transition: .5s;-moz-transition: .5s;-ms-transition: .5s;-o-transition: .5s;transition: .5s;z-index: 22;}#Pop_UpsBtn:hover{background: var(--color);}</style>',
                html = '<div id="pups_from" hidden>\n' + '        <h4>' + lang.title + '<i class="close"></i></h4>\n' + '        <form onsubmit="return false;"><input type="hidden" name="your-message" value=""><input type="hidden" name="your-email" value="">\n' + '            <ul>\n' + '                <li>\n' + '                    <label>' + lang.name + ':</label>\n' + '                    <input type="text" autocomplete="off" name="name" placeholder="">\n' + '                </li>\n' + '                <li>\n' + '                    <label><em>*</em>' + lang.mail + ':</label>\n' + '                    <input type="text" autocomplete="off" name="mail" placeholder="">\n' + '                </li>\n' + '                <li>\n' + '                    <label>' + lang.phone + ':</label>\n' + '                    <input type="text" autocomplete="off" name="phone" placeholder="">\n' + '                </li>\n' + '                <li>\n' + '                    <label><em>*</em>' + lang.message + ':</label>\n' + '                    <textarea autocomplete="off" name="content" placeholder=""></textarea>\n' + '                </li>\n' + '                <li>\n' + '                    <input type="submit" value="' + lang.send + '">\n' + '                </li>\n' + '            </ul>\n' + '        </form>\n' + '    </div>',
                btn = '<div id="Pop_UpsBtn"><i class="fa fa-comments-o"></i></div>',
                model_form = false,
                model_url = '';
            $("body").append(css).append(html);
            if (btn_) {
                $("body").append(btn);
            }
            (obj ? obj : $("#Pop_UpsBtn")).on('click', function (e) {
                if (model && !model_form) {
                    e.preventDefault();
                    e.stopPropagation();
                    model_url = $(this).attr('href') ? $(this).attr('href') : $(this).find('a').attr('href');
                }
                if (!model_form) $("#pups_from").stop().fadeToggle(200);
            });
            $("#pups_from i.close").on('click', function () {
                $("#pups_from").stop().fadeToggle(200);
            });
            $("#pups_from form input[type=submit]").on('click', function () {
                layer.load(0, { shade: 0.1, shadeClose: false });
                $.ajax({
                    type: 'post',
                    url: '/Api/contact/submit/uid/1.html',
                    data: $("#pups_from form").serialize(),
                    dataType: 'json',
                    success: function success(data) {
                        layer.closeAll();
                        if (data.status == 200) {
                            layer.msg(data.result, { icon: 1, time: 4000 });
                            if (model && !model_form) {
                                model_form = true;
                                $("#pups_from").stop().fadeToggle(200);
                                var a = document.createElement('a');
                                a.setAttribute('href', model_url);
                                a.setAttribute('download', '');
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                            }
                        } else {
                            layer.msg(data.result, { icon: 2, time: 4000 });
                        }
                    }
                });
            });
        },
        resumeForm: function resumeForm(obj) {
            var html = '<form action="" onsubmit="return false;" method="post" id="resume"><p>应聘岗位<em style="color:red;">*</em>： <input type="text"><span class="fr">填表日期<em style="color:red;">*</em>： <input type="date"></span></p><table><tbody><tr><td colspan="1" class="txt-center"><p>诚</p><p>信</p><p>承</p><p>诺</p></td><td colspan="24"><p>1.我保证以下应聘登记表所填写的每一项内容真实，我同意贵公司可对以下所填写的信息进行诚信调查。如以下填内容有任何伪造和隐瞒，我将失去这次应聘资格，即使被贵公司录用，无论在任何时候，一经查出，本人接受公司规定的包括无条件开除在内的任何处罚。</p><p>2.如果我被贵公司录用，我保证到贵公司报道前，已与原工作单位解除劳动合同等关系，并不将原工作单位的任何商业（军事等）秘密带到贵公司。如出现商业欺诈行为或在、与原工作单位因劳动合同以及商业（军事等）秘密等问题出现法律纠纷，我愿意自己承担一切责任。</p><p>3.如果我被贵公司录用，我愿意接受贵公司的相关培训和试用，如果试用期内达不到贵公司要求，不予录用我为公司正式员工。</p><p>4.如果我被贵公司录用，我保证在上岗前充分理解并认可录用岗位的岗位职责和工作内容。</p></td></tr><tr><td colspan="2"><p>姓 名<em style="color:red;">*</em></p></td><td colspan="3"><input type="text"></td><td colspan="2"><p>性 别<em style="color:red;">*</em></p></td><td colspan="3"><input type="text"></td><td colspan="2"><p>民 族<em style="color:red;">*</em></p></td><td colspan="3"><input type="text"></td><td colspan="2"><p>年龄<em style="color:red;">*</em></p></td><td colspan="4"><input type="text"></td><td colspan="4" rowspan="6" class="txt-center"><label for="img"><span>贴</span><span>照</span><span>片</span><span>处</span></label><input type="file" id="img" accept=".jpg,.jpge,.png,.gif"></td></tr><tr><td colspan="2"><p>出生年月<em style="color:red;">*</em></p></td><td colspan="3"><input type="date"></td><td colspan="2"><p>婚姻状况</p></td><td colspan="3"><input type="text"></td><td colspan="2"><p>文化程度</p></td><td colspan="3"><input type="text"></td><td colspan="2"><p>政治面貌<em style="color:red;">*</em></p></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="2"><p>户口所在地<em style="color:red;">*</em></p></td><td colspan="8"><input type="text"></td><td colspan="2"><p>户口性质</p></td><td colspan="9"><label for="nc">农村<input type="radio" name="hk" id="nc" value="农村" checked="checked"></label><label for="jm">居民<input type="radio" name="hk" id="jm" value="居民"></label></td></tr><tr><td colspan="2"><p>现在住址</p></td><td colspan="8"><input type="text"></td><td colspan="2"><p>联系电话<em style="color:red;">*</em></p></td><td colspan="9"><input type="text"></td></tr><tr><td colspan="2"><p>身份证号<em style="color:red;">*</em></p></td><td colspan="8"><input type="text"></td><td colspan="2"><p>期望薪资（税前）</p></td><td colspan="9"><input type="text"></td></tr><tr><td colspan="2"><p>外语水平</p></td><td colspan="3"><input type="text"></td><td colspan="2"><p>计算机能力</p></td><td colspan="5"><input type="text"></td><td colspan="2"><p>所获证书</p></td><td colspan="7"><input type="text"></td></tr><tr><td rowspan="3" class="txt-center"><p>教</p><p>育</p><p>经</p><p>历</p></td><td colspan="4"><p>何时至何时</p></td><td colspan="7"><p>学校（培训机构）名称</p></td><td colspan="9"><p>专业或培训内容</p></td><td colspan="4"><p>是否毕业</p></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="7"><input type="text"></td><td colspan="9"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="7"><input type="text"></td><td colspan="9"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td rowspan="5" class="txt-center"><p>工</p><p>作</p><p>经</p><p>历</p></td><td colspan="4"><p>何时至何时</p></td><td colspan="7"><p>在何单位工作</p></td><td colspan="4"><p>任 何 职 务</p></td><td colspan="5"><p>离职（调动）原因</p></td><td colspan="4"><p>证明人及联系方式</p></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="7"><input type="text"></td><td colspan="4"><input type="text"></td><td colspan="5"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="7"><input type="text"></td><td colspan="4"><input type="text"></td><td colspan="5"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="7"><input type="text"></td><td colspan="4"><input type="text"></td><td colspan="5"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="7"><input type="text"></td><td colspan="4"><input type="text"></td><td colspan="5"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="25"><p>家庭成员(紧急联系人)及主要社会关系</p></td></tr><tr><td colspan="4"><p>姓 名</p></td><td colspan="5"><p>与本人关系</p></td><td colspan="12"><p>工作单位</p></td><td colspan="4"><p>联系电话</p></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="5"><input type="text"></td><td colspan="12"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="4"><input type="text"></td><td colspan="5"><input type="text"></td><td colspan="12"><input type="text"></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="5"><p>在本公司内部亲属朋友状况</p></td><td colspan="4"><label for="wu">无<input type="radio" name="py" id="wu" value="无" checked="checked"></label><label for="you">有<input type="radio" name="py" id="you" value="有"></label></td><td colspan="1"><p>姓名</p></td><td colspan="4"><input type="text"></td><td colspan="1"><p>关系</p></td><td colspan="4"><input type="text"></td><td colspan="2"><p>联系电话</p></td><td colspan="4"><input type="text"></td></tr><tr><td colspan="25"><p><label for="ctx">自我评价：</label></p><textarea id="ctx"></textarea></td></tr></tbody></table><input type="submit" value="立即发送"><input type="button" class="close" value="关闭窗口"><input type="button" id="day" value="打印表格">' + '<span class="close"></span><style>#resume {;text-align:right;max-width: 100%;display: block;margin: 0 auto;font-size: 12px;width: 1000px;}#resume table{width:100%;table-layout:fixed;margin:10px 0;display: table;text-align: left;}#resume table tbody{display: table-row-group;width: auto !important;}#resume table td{width:auto !important;padding:5px !important;background: white;}.txt-center{text-align:center}#resume>p{text-align: left;}#resume p input{border:1px solid #eee;padding:5px;}#resume table input,#resume table textarea{width:100%;border:none}#resume table textarea{height:80px;margin-top:5px}#resume table label{display:inline-block;margin:0 10px}#resume table label input{display:inline-block;vertical-align:middle;width:auto;position:relative;top:-1px;margin-left:5px}#resume table label[for="img"]{width:100%;margin:0}#resume table label[for="ctx"]{width:100%;margin:0;cursor:text}#resume table input#img{display:none}#resume table label span{display:block}#resume input[type="submit"],#resume input[type="button"]{display:none;padding:7px 25px;background:#0d95e8;color:white;font-size:14px;border:none;vertical-align:top;margin-left:15px;width:120px;text-align:center}#day{display: inline-block!important;}</style></form><style>#resume{display:none;max-width:100%;margin:0 auto;font-size:12px;-webkit-transform: translateX(-50%);-moz-transform: translateX(-50%);-ms-transform: translateX(-50%);-o-transform: translateX(-50%);transform: translateX(-50%);position: fixed;max-height: 90vh;overflow: auto;z-index: 20;background: white;width: 1000px;left: 50%;top: 5vh;padding: 15px;-moz-box-shadow: 0 0 10px rgba(0,0,0,.1); -o-box-shadow: 0 0 10px rgba(0,0,0,.1);box-shadow: 0 0 10px rgba(0,0,0,.1);}#resume input[type="submit"],#resume input[type="button"]{display: inline-block;}#day{display: none!important;}</style>';
            $("body").append(html);
            $(document).on('click', '#resume input[type="button"].close', function () {
                $("#resume").fadeOut(200);
            });
            obj.click(function () {
                $("#resume").fadeIn(200);
            });

            var file = document.body.querySelector("#resume input[type='file']");
            file.onchange = function () {
                if (window.FileReader) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file.files[0]);
                    //监听文件读取结束后事件
                    reader.onloadend = function (e) {
                        var base64String = e.target.result;
                        $("#resume label[for='img']").html('<img src="' + base64String + '" />');
                    };
                }
            };

            $(document).on('click', '#resume input[type="submit"]', function () {
                var lock = false;
                layer.load(0, { shade: 0.1, shadeClose: false });
                $("#resume p em").filter(function () {
                    if ($(this).parents('td').next().find('input').val() === '') {
                        lock = true;
                    }
                });
                if (lock) {
                    layer.closeAll();
                    layer.msg('请检查必填项！', { icon: 2, time: 4000 });
                    return false;
                }
                var ctx = $("#resume").clone();
                ctx.find('input').filter(function () {
                    $(this).attr('value', $(this).val());
                });
                $.ajax({
                    type: 'post',
                    url: '/Api/contact/submit/uid/1.html',
                    data: 'your-message=&your-email=&mail=admin@admin.com&content=<form id="resume">' + ctx.html() + '</form><script>document.getElementById(\'day\').onclick = function (){var ctx = $("#resume").clone();var html = document.head.innerHTML;html+= \'<body><form id="resume" style="width: 100%;max-width: 100%;">\'+ctx.html()+\'</form></body>\';var w = window.open();w.document.write(html);w.document.title = \'简历文件\';setTimeout(function(){w.print();w.close();},50)}</script>',
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
            });
        },
        Line_curve: function Line_curve(obj, origin, coordinate, color, img, speed) {
            if (!speed) speed = 0.01;
            if (!color) color = '#000';
            var con = document.getElementById(obj).appendChild(document.createElement('canvas'));
            var ctx = con.getContext('2d');
            con.width = document.getElementById(obj).offsetWidth ? document.getElementById(obj).offsetWidth : window.innerWidth;
            con.height = document.getElementById(obj).offsetHeight ? document.getElementById(obj).offsetHeight : window.innerHeight;
            var percent = 0;
            ctx.lineWidth = 2;
            origin = [origin[0] * (con.width / 100), origin[1] * (con.height / 100)];

            function animate() {
                ctx.clearRect(0, 0, con.width, con.height);
                ctx.drawImage(img, 0, 0, con.width, con.height);
                for (var i = 0; i < coordinate.length; i++) {
                    var x0 = coordinate[i][0][0] * (con.width / 100);
                    var y0 = coordinate[i][0][1] * (con.height / 100);
                    var x1 = coordinate[i][1][0] * (con.width / 100);
                    var y1 = coordinate[i][1][1] * (con.height / 100);
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    formula(ctx, origin, [x0, y0], [x1, y1], percent);
                    ctx.stroke();
                }
                if (percent < 1) percent += speed;else {
                    return;
                }
                requestAnimationFrame(animate);
            }

            function formula(ctx, start, end, control, percent) {
                //            二次贝塞尔曲线坐标计算公式
                var v01 = [control[0] - start[0], control[1] - start[1]]; // 向量<p0, p1>
                var v12 = [end[0] - control[0], end[1] - control[1]]; // 向量<p1, p2>
                var q0 = [start[0] + v01[0] * percent, start[1] + v01[1] * percent];
                var q1 = [control[0] + v12[0] * percent, control[1] + v12[1] * percent];
                var v = [q1[0] - q0[0], q1[1] - q0[1]]; // 向量<q0, q1>
                var b = [q0[0] + v[0] * percent, q0[1] + v[1] * percent];
                ctx.moveTo(start[0], start[1]);
                ctx.quadraticCurveTo(q0[0], q0[1], b[0], b[1]);
            }

            animate();
        },
        shopping_cart: function shopping_cart(cart_page, element, text_, product) {
            // 对象数据汇总
            if (!cart_page) cart_page = false;
            if (!element) {
                element = {
                    shopping_cart: '.shopping_cart',
                    shopping_form: '.shopping_form',
                    shopping_list: '.shopping_list',
                    product_box: '.product_box', //多增加一个data-id 属性
                    product_name: '.product_name',
                    product_link: '.product_link',
                    product_det: '.product_det',
                    product_img: '.product_img',
                    product_tag: '.product_tag',
                    product_add: '.product_add'
                };
            }
            switch (window.lang) {
                case 'cn':
                    text_ = { close: '关闭窗口', title: '留言反馈', submit: '立即发送', number: '产品数量:', cart: '没有产品，你需添加它们！', required: '不能为空！', msgNumber: '产品数量', msg: '留言内容', msgUrl: '产品链接' };
                    break;
                case 'tr':
                    text_ = { close: 'Pencereyi kapat', title: 'Mesaj geri verisi', submit: 'Şimdi gönder', number: 'Üretim miktarı:', cart: 'Ürüntü yok, eklemelisin!', required: 'Boş olamaz!', msgNumber: 'Üretim miktarı', msg: 'Mesaj İçindeki', msgUrl: 'Üretim Bağlantısı' };
                    break;
                case 'ru':
                    text_ = { close: 'Закрыть все', title: 'Обратная связь', submit: 'Отправлять', number: 'Количество:', cart: 'Товаров нет, просто добавьте их!', required: 'Не может быть пустым!', msgNumber: 'Кол-во', msg: 'Сообщение', msgUrl: 'Связь' };
                    break;
                case 'es':
                    text_ = { close: 'Cierra todo', title: 'Comentario', submit: 'Enviar', number: 'Número:', cart: 'No hay productos, solo agrégalos!', required: 'No puede estar vacío!', msgNumber: 'Cantidad', msg: 'Mensaje', msgUrl: 'Enlace' };
                    break;
                case 'sa':
                    text_ = { close: 'أغلق الكل', title: 'ردود الفعل', submit: 'يرسل', number: 'رقم:', cart: 'لا توجد منتجات ، فقط قم بإضافتها!', required: 'لايمكن ان يكون فارغا!', msgNumber: 'الكمية', msg: 'رسالة', msgUrl: 'وصلة' };
                    break;
                case 'de':
                    text_ = { close: 'Alle schließen', title: 'Rückmeldung', submit: 'Schicken', number: 'Anzahl:', cart: 'Es gibt keine Produkte, fügen Sie sie einfach hinzu!', required: 'Kann nicht leer sein!', msgNumber: 'Menge', msg: 'Nachricht', msgUrl: 'Verknüpfung' };
                    break;
                case 'jp':
                    text_ = { close: 'すべて閉じる', title: 'フィードバック', submit: '送信', number: '番号:', cart: '製品はありません。追加するだけです。', required: '空にすることはできません！', msgNumber: '数量', msg: 'メッセージ', msgUrl: 'リンク' };
                    break;
                case 'kr':
                    text_ = { close: '모두 닫기', title: '피드백', submit: '보내다', number: '숫자:', cart: '제품이 없습니다. 추가하세요!', required: '비워둘 수 없습니다!', msgNumber: '수량', msg: '메시지', msgUrl: '링크' };
                    break;
                case 'fr':
                    text_ = { close: 'Ferme tout', title: 'Retour', submit: 'Envoyer', number: 'Numéro:', cart: 'Il n\'y a pas de produits, il suffit d\'en ajouter !', required: 'Ne peux pas être vide!', msgNumber: 'Qté', msg: 'Message', msgUrl: 'URL' };
                    break;
                default:
                    text_ = { close: 'Close All', title: 'Feedback', submit: 'Send', number: 'Number:', cart: 'There are no products, just add them!', required: 'Can not be empty!', msgNumber: 'Qty', msg: 'Message', msgUrl: 'Url' };
            }
            var css = '<style type=\'text/css\' id=\'\'>#cart{position:fixed;max-width:100%;width:1000px;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-height:80%;overflow:auto;padding: 15px;z-index:100;background:white;-moz-box-shadow:0 0 10px rgba(0,0,0,.2);-o-box-shadow:0 0 10px rgba(0,0,0,.2);box-shadow:0 0 10px rgba(0,0,0,.2);}#cart.active{position:static;width:auto;top:0;left:0;-webkit-transform:translate(0);-moz-transform:translate(0);-ms-transform:translate(0);-o-transform:translate(0);transform:translate(0);max-height:none;overflow:unset}#cart .left{padding-right:15px;color:black}#cart .left ul{max-height:560px;overflow:auto}#cart .left ul li{margin-bottom:15px;padding:15px;background:#f9f9f9}#cart .left ul li .box2{position:relative}#cart .left ul li .img{width:25%;overflow:hidden;vertical-align:middle;max-height:140px}#cart .left ul li .img img{min-height:140px;width:auto;min-width:100%}#cart .left ul li .text{width:75%;padding-left:3%;vertical-align:middle}#cart .left ul li .text h4{font-size:18px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}#cart .left ul li .text p{display:inline-block;max-width:50%;padding-right:15px}#cart .left ul li .text input{width:50%;max-width:80px;color:black;padding:5px;display:inline-block;border:1px solid #eee}#cart .left ul li .text textarea{width:100%;padding:10px;color:black;margin-top:10px;border:1px solid #eee}#cart .left ul li i.del{position:absolute;top:-8px;right:-5px;font-size:16px;cursor:pointer;cursor:hand}#cart .left span.close_all{display:inline-block;line-height:40px;height:40px;padding:0 25px;background:#111;color:white;font-size:15px;cursor:pointer;cursor:hand;margin-top:10px}#cart .right{padding-left:15px}#cart .right .shopping_form{background:#f9f9f9;color:black;padding:15px}#cart .right h4{font-size:24px}#cart .right ul li label{display:block;font-size:14px;margin:10px 0 5px}#cart .right ul li input,#cart .right ul li textarea{width:100%;padding:5px 15px;border:1px solid #eee;font-size:14px}#cart .right ul li textarea{height:160px}#cart .right ul li input[type="submit"]{max-width:200px;background:#111;border:0;font-size:18px;margin-top:20px;padding:10px;color:white}#cart i.fa-close{position:absolute;right:15px;top:15px;font-size:16px;width:30px;height:30px;line-height:30px;text-align:center;background:#000;color:white;cursor:pointer;cursor:hand}@media screen and (max-width:1000px){#cart .left{width:100%;padding-right:0}#cart .right{width:100%;padding-left:0;padding-top:20px}#cart .left ul{overflow:unset;max-height:none}}</style>',
                html = '<div id="cart" hidden><div class="box grid-box two"><div class="left column"><ul class="shopping_list"></ul><span class="close_all">' + text_.close + '</span></div><div class="right column"><div class="shopping_form"><h4>' + text_.title + '</h4><form onsubmit="return false;"><ul><li><label for="company">The company:</label><input type="text" id="company" name="name" placeholder=""></li><li><label for="phone">Phone:</label><input type="text" id="phone" name="phone" placeholder=""></li><li><label for="mail">E-mail:</label><input type="text" id="mail" name="mail" placeholder=""></li><li><label for="content">Detailed message:</label><textarea id="content" name="content" placeholder=""></textarea></li><li><input type="submit" value="' + text_.submit + '"></li></ul></form></div></div></div><i class="close fa fa-close"></i></div>';

            // 初始化
            var data = [],
                lock = true;
            if ($.cookie !== undefined) {
                if ($.cookie('the_product_info') !== undefined && $.cookie('the_product_info') !== '') {
                    data = $.cookie('the_product_info').split('?^');
                }
            } else {
                alert('需要cookie插件支持！');
                return;
            }
            $(element.shopping_cart).find('em').html(data.length);

            // 列表
            function click_car(T) {
                lock = true;
                var name = T.parents(element.product_box).find(element.product_name).length ? T.parents(element.product_box).find(element.product_name).text() : '',
                    url = T.parents(element.product_box).find(element.product_link).length ? T.parents(element.product_box).find(element.product_link).attr('href') : '',
                    det = T.parents(element.product_box).find(element.product_det).length ? T.parents(element.product_box).find(element.product_det).text() : '',
                    img = T.parents(element.product_box).find(element.product_img).length ? T.parents(element.product_box).find(element.product_img).attr('src') : '',
                    tag = T.parents(element.product_box).find(element.product_tag).length ? T.parents(element.product_box).find(element.product_tag).children('*') : '';
                if ($.isArray(data)) {
                    data.map(function (value, index) {
                        var key = Object.keys(JSON.parse(value))[0];
                        if (key === T.parents(element.product_box).attr('data-id')) {
                            lock = false;
                            data.splice(index, 1);
                        }
                    });
                }

                var tag_arr = [];
                if (tag !== '') {
                    tag.filter(function () {
                        tag_arr.push($(this).text());
                    });
                }

                var text = '{"' + T.parents(element.product_box).attr('data-id') + '":{"name":"' + name.replace(/\s/g, " ") + '","url":"' + url + '","det":"' + det + '","img":"' + img + '","tag":"' + tag_arr.join('/') + '"}}';
                if (lock) {
                    data.push(text);
                }
                $(element.shopping_cart).find('em').html(data.length);
                $.cookie('the_product_info', data.join('?^'), { path: '/' });
            }

            $(document).on('click', element.product_add, function (e) {
                click_car($(this));
                $(this).toggleClass('active');
            });

            function cart_detect() {
                data.map(function (value, index) {
                    var detect = JSON.parse(value);
                    $(element.product_box).filter(function () {
                        if (Object.keys(detect)[0] === $(this).attr('data-id')) {
                            $(this).find(element.product_add).addClass('active');
                        }
                    });
                });
            }

            //购物车
            function Structure_injection() {
                if (cart_page) {
                    return data;
                } else {
                    var data_ = [];
                    $(element.shopping_list).html('');
                    data.map(function (value, index) {
                        data_ = JSON.parse(value);
                        $(element.shopping_list).append('<li>\n' + '               <div class="box2 grid-box">\n' + '                   <div class="img column"><a href="' + data_[Object.keys(data_)[0]].url + '"><img src="' + data_[Object.keys(data_)[0]].img + '?imageView2/2/w/400/h/400/format/jpg/q/80" alt=""></a></div>\n' + '                   <div class="text column">\n' + '                       <h4><a href="' + data_[Object.keys(data_)[0]].url + '">' + data_[Object.keys(data_)[0]].name + '</a></h4><p>' + text_.number + '</p>\n' + '                       <input class="num" type="number" value="1"/><div class="Item" hidden>' + data_[Object.keys(data_)[0]].tag + '</div>\n' + '                       <textarea class="msg" placeholder=""></textarea>\n' + '                       <i class="del fa fa-trash"></i>\n' + '                   </div>\n' + '               </div>\n' + '           </li>');
                    });
                }
            }
            function cart() {
                if (!cart_page) {
                    $('body').append(html, css);
                    $.getScript('/static/js/layer/layer.js');
                    Structure_injection();
                    $(document).on('click', '#cart i.del', function (e) {
                        var info_ = $(this).parents('li');
                        if (data.length) {
                            data.splice(info_.index(), 1);
                            $(element.shopping_cart).find('em').html(data.length);
                            $.cookie('the_product_info', data.join('?^'), { path: '/' });
                            info_.remove();
                            if (!data.length) {
                                $(element.shopping_list).html(text_.cart);
                            }
                        }
                    });
                    $(document).on('blur', '#cart input', function (e) {
                        if ($(this).val() === '') {
                            layer.msg(text_.required, { icon: 2, time: 4000 });
                        }
                    });
                    $(document).on('click', '#cart input[type=\'submit\']', function (e) {
                        e.preventDefault();
                        var content = '';
                        $(element.shopping_list).find('li').filter(function () {
                            content += '\n' + $(this).find('h4').text() + '\n' + text_.msgNumber + ':' + $(this).find('input').val() + '\n' + text_.msg + ':' + $(this).find('textarea').val() + '\n' + text_.msgUrl + ':' + $(this).find('a').attr('href') + '\n' + '-------------------------------------------\n';
                        });
                        var textarea = $(element.shopping_form).find("textarea").val();
                        $(element.shopping_form).find("textarea").val(textarea + content);
                        layer.load(0, { shade: 0.1, shadeClose: false });
                        $.ajax({
                            type: 'post',
                            url: '/Api/contact/submit/uid/1.html',
                            data: $(element.shopping_form).find('form').serialize(),
                            dataType: 'json',
                            success: function success(ret) {
                                layer.closeAll();
                                $(element.shopping_form).find("textarea").val(textarea);
                                if (ret.status == 200) {
                                    layer.msg(ret.result, { icon: 1, time: 4000 });
                                    $(element.shopping_cart).find('em').html(0);
                                    $.cookie('the_product_info', '', { path: '/' });
                                } else {
                                    layer.msg(ret.result, { icon: 2, time: 4000 });
                                }
                            }
                        });
                    });
                    $(document).on('click', '#cart span.close_all', function (e) {
                        $(element.shopping_list).find('li').remove();
                        $(element.shopping_cart).find('em').html(0);
                        $.cookie('the_product_info', '', { path: '/' });
                    });
                    $(document).on('click', element.shopping_cart, function (e) {
                        $("#cart").fadeIn(300);
                        Structure_injection();
                    });
                    $(document).on('click', '#cart i.fa-close', function (e) {
                        $("#cart").fadeOut(300);
                    });
                } else {
                    product(Structure_injection());
                }
            }

            cart_detect();
            cart();
        },
        form_files_Picture: function form_files_Picture(obj, btn, name, list, required) {
            if (typeof html2canvas == 'undefined') {
                if (confirm('主要插件方法不存在，点击确定下载安装')) {
                    window.open('http://html2canvas.hertzen.com/dist/html2canvas.min.js');
                }
                return false;
            }
            function savePic() {
                var _this = this;
                var width = $(obj)[0].offsetWidth; //dom宽
                var height = $(obj)[0].offsetHeight; //dom高
                var scale = 2; //放大倍数
                var canvas = document.createElement('canvas');
                canvas.width = width * 2;
                canvas.height = height * 2;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                var context = canvas.getContext('2d');
                context.scale(scale, scale);
                //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
                var rect = $(obj).get(0).getBoundingClientRect(); //获取元素相对于视察的偏移量
                context.translate(-rect.left, -rect.top);
                var opts = {
                    imageTimeout: 15000,
                    useCORS: true, //防止图片跨域
                    x: 0,
                    y: 0,
                    scrollY: 0,
                    scrollX: 0,
                    logging: true
                };
                html2canvas(document.querySelector(".form_information table"), opts).then(function (canvas) {
                    var file = new File(['<img src="' + canvas.toDataURL('image/png') + '"/>'], name + '.png');
                    var data_ = new FormData();
                    data_.append('your-message', '');
                    data_.append('your-email', '');
                    data_.append('mail', 'admin@admin.com');
                    data_.append('file', file);
                    $.ajax({
                        type: 'post',
                        url: '/Api/contact/submit/uid/1.html',
                        data: data_,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        success: function success(data) {
                            layer.closeAll();
                            if (data.status == 200) {
                                layer.msg(data.result, { icon: 1, time: 4000 });
                            } else {
                                layer.msg(data.result, { icon: 2, time: 4000 });
                            }
                        }
                    });
                });
            }
            $(document).on('click', btn, function () {
                var lock = false;
                layer.load(0, { shade: 0.1, shadeClose: false });
                $(obj + list + required).filter(function () {
                    if ($(this).parents(list).next().find('input').val() === '') {
                        lock = true;
                    }
                });
                if (lock) {
                    layer.closeAll();
                    layer.msg('请检查必填项！', { icon: 2, time: 4000 });
                    return false;
                }
                savePic();
            });
        },
        SmoothScroll: function SmoothScroll() {
            (function () {
                var ac = { frameRate: 350, animationTime: 1000, stepSize: 45, pulseAlgorithm: true, pulseScale: 4, pulseNormalize: 1, accelerationDelta: 50, accelerationMax: 3, keyboardSupport: false, arrowScroll: 50, fixedBackground: true, excluded: "" };var I = ac;var G = false;var C = false;var m = { x: 0, y: 0 };var b = false;var K = document.documentElement;var h;var R;var t;var ai = [];var i;var ad = /^Mac/.test(navigator.platform);var B = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36 };var T = { 37: 1, 38: 1, 39: 1, 40: 1 };function am() {
                    if (I.keyboardSupport) {
                        k("keydown", H);
                    }
                }function af() {
                    if (b || !document.body) {
                        return;
                    }b = true;var e = document.body;var ar = document.documentElement;var au = window.innerHeight;var at = e.scrollHeight;K = document.compatMode.indexOf("CSS") >= 0 ? ar : e;h = e;am();if (top != self) {
                        C = true;
                    } else {
                        if (X && at > au && (e.offsetHeight <= au || ar.offsetHeight <= au)) {
                            var ap = document.createElement("div");ap.style.cssText = "position:absolute; z-index:-10000; top:0; left:0; right:0; height:" + K.scrollHeight + "px";document.body.appendChild(ap);var an;t = function t() {
                                if (an) {
                                    return;
                                }an = setTimeout(function () {
                                    if (G) {
                                        return;
                                    }ap.style.height = "0";ap.style.height = K.scrollHeight + "px";an = null;
                                }, 500);
                            };setTimeout(t, 10);k("resize", t);var aq = { attributes: true, childList: true, characterData: false };R = new L(t);R.observe(e, aq);if (K.offsetHeight <= au) {
                                var ao = document.createElement("div");ao.style.clear = "both";e.appendChild(ao);
                            }
                        }
                    }if (!I.fixedBackground && !G) {
                        e.style.backgroundAttachment = "scroll";ar.style.backgroundAttachment = "scroll";
                    }
                }function d() {
                    R && R.disconnect();a(S, u);a("mousedown", w);a("keydown", H);a("resize", t);a("load", af);
                }var V = [];var l = false;var v = Date.now();function ag(ap, ao, at) {
                    M(ao, at);if (I.accelerationMax != 1) {
                        var e = Date.now();var av = e - v;if (av < I.accelerationDelta) {
                            var ar = (1 + 50 / av) / 2;if (ar > 1) {
                                ar = Math.min(ar, I.accelerationMax);ao *= ar;at *= ar;
                            }
                        }v = Date.now();
                    }V.push({ x: ao, y: at, lastX: ao < 0 ? 0.99 : -0.99, lastY: at < 0 ? 0.99 : -0.99, start: Date.now() });if (l) {
                        return;
                    }var au = D();var aq = ap === au || ap === document.body;if (ap.$scrollBehavior == null && O(ap)) {
                        ap.$scrollBehavior = ap.style.scrollBehavior;ap.style.scrollBehavior = "auto";
                    }var an = function an(ax) {
                        var aw = Date.now();var aE = 0;var aD = 0;for (var az = 0; az < V.length; az++) {
                            var aG = V[az];var aF = aw - aG.start;var ay = aF >= I.animationTime;var aA = ay ? 1 : aF / I.animationTime;if (I.pulseAlgorithm) {
                                aA = p(aA);
                            }var aC = aG.x * aA - aG.lastX >> 0;var aB = aG.y * aA - aG.lastY >> 0;aE += aC;aD += aB;aG.lastX += aC;aG.lastY += aB;if (ay) {
                                V.splice(az, 1);az--;
                            }
                        }if (aq) {
                            window.scrollBy(aE, aD);
                        } else {
                            if (aE) {
                                ap.scrollLeft += aE;
                            }if (aD) {
                                ap.scrollTop += aD;
                            }
                        }if (!ao && !at) {
                            V = [];
                        }if (V.length) {
                            U(an, ap, 1000 / I.frameRate + 1);
                        } else {
                            l = false;if (ap.$scrollBehavior != null) {
                                ap.style.scrollBehavior = ap.$scrollBehavior;ap.$scrollBehavior = null;
                            }
                        }
                    };U(an, ap, 0);l = true;
                }function u(ap) {
                    if (!b) {
                        af();
                    }var aq = ap.target;if (ap.defaultPrevented || ap.ctrlKey) {
                        return true;
                    }if (s(h, "embed") || s(aq, "embed") && /\.pdf/i.test(aq.src) || s(h, "object") || aq.shadowRoot) {
                        return true;
                    }var an = -ap.wheelDeltaX || ap.deltaX || 0;var e = -ap.wheelDeltaY || ap.deltaY || 0;if (ad) {
                        if (ap.wheelDeltaX && A(ap.wheelDeltaX, 120)) {
                            an = -120 * (ap.wheelDeltaX / Math.abs(ap.wheelDeltaX));
                        }if (ap.wheelDeltaY && A(ap.wheelDeltaY, 120)) {
                            e = -120 * (ap.wheelDeltaY / Math.abs(ap.wheelDeltaY));
                        }
                    }if (!an && !e) {
                        e = -ap.wheelDelta || 0;
                    }if (ap.deltaMode === 1) {
                        an *= 40;e *= 40;
                    }var ao = Y(aq);if (!ao) {
                        if (C && ah) {
                            Object.defineProperty(ap, "target", { value: window.frameElement });return parent.wheel(ap);
                        }return true;
                    }if (ak(e)) {
                        return true;
                    }if (Math.abs(an) > 1.2) {
                        an *= I.stepSize / 120;
                    }if (Math.abs(e) > 1.2) {
                        e *= I.stepSize / 120;
                    }ag(ao, an, e);ap.preventDefault();r();
                }function H(e) {
                    var au = e.target;var aq = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== B.spacebar;if (!document.body.contains(h)) {
                        h = document.activeElement;
                    }var an = /^(textarea|select|embed|object)$/i;var ao = /^(button|submit|radio|checkbox|file|color|image)$/i;if (e.defaultPrevented || an.test(au.nodeName) || s(au, "input") && !ao.test(au.type) || s(h, "video") || z(e) || au.isContentEditable || aq) {
                        return true;
                    }if ((s(au, "button") || s(au, "input") && ao.test(au.type)) && e.keyCode === B.spacebar) {
                        return true;
                    }if (s(au, "input") && au.type == "radio" && T[e.keyCode]) {
                        return true;
                    }var ap,
                        ay = 0,
                        aw = 0;var at = Y(h);if (!at) {
                        return C && ah ? parent.keydown(e) : true;
                    }var ar = at.clientHeight;if (at == document.body) {
                        ar = window.innerHeight;
                    }switch (e.keyCode) {case B.up:
                        aw = -I.arrowScroll;break;case B.down:
                        aw = I.arrowScroll;break;case B.spacebar:
                        ap = e.shiftKey ? 1 : -1;aw = -ap * ar * 0.9;break;case B.pageup:
                        aw = -ar * 0.9;break;case B.pagedown:
                        aw = ar * 0.9;break;case B.home:
                        if (at == document.body && document.scrollingElement) {
                            at = document.scrollingElement;
                        }aw = -at.scrollTop;break;case B.end:
                        var ax = at.scrollHeight - at.scrollTop;var av = ax - ar;aw = av > 0 ? av + 10 : 0;break;case B.left:
                        ay = -I.arrowScroll;break;case B.right:
                        ay = I.arrowScroll;break;default:
                        return true;}ag(at, ay, aw);e.preventDefault();r();
                }function w(e) {
                    h = e.target;
                }var J = function () {
                    var e = 0;return function (an) {
                        return an.uniqueID || (an.uniqueID = e++);
                    };
                }();var o = {};var n = {};var ae;var al = {};function r() {
                    clearTimeout(ae);ae = setInterval(function () {
                        o = n = al = {};
                    }, 1 * 1000);
                }function g(ap, ao, e) {
                    var an = e ? o : n;for (var aq = ap.length; aq--;) {
                        an[J(ap[aq])] = ao;
                    }return ao;
                }function j(an, e) {
                    return (e ? o : n)[J(an)];
                }function Y(ar) {
                    var ao = [];var e = document.body;var an = K.scrollHeight;do {
                        var aq = j(ar, false);if (aq) {
                            return g(ao, aq);
                        }ao.push(ar);if (an === ar.scrollHeight) {
                            var at = W(K) && W(e);var ap = at || N(K);if (C && Z(K) || !C && ap) {
                                return g(ao, D());
                            }
                        } else {
                            if (Z(ar) && N(ar)) {
                                return g(ao, ar);
                            }
                        }
                    } while (ar = ar.parentElement);
                }function Z(e) {
                    return e.clientHeight + 10 < e.scrollHeight;
                }function W(e) {
                    var an = getComputedStyle(e, "").getPropertyValue("overflow-y");return an !== "hidden";
                }function N(e) {
                    var an = getComputedStyle(e, "").getPropertyValue("overflow-y");return an === "scroll" || an === "auto";
                }function O(e) {
                    var ao = J(e);if (al[ao] == null) {
                        var an = getComputedStyle(e, "")["scroll-behavior"];al[ao] = "smooth" == an;
                    }return al[ao];
                }function k(ao, an, e) {
                    window.addEventListener(ao, an, e || false);
                }function a(ao, an, e) {
                    window.removeEventListener(ao, an, e || false);
                }function s(an, e) {
                    return an && (an.nodeName || "").toLowerCase() === e.toLowerCase();
                }function M(e, an) {
                    e = e > 0 ? 1 : -1;an = an > 0 ? 1 : -1;if (m.x !== e || m.y !== an) {
                        m.x = e;m.y = an;V = [];v = 0;
                    }
                }if (window.localStorage && localStorage.SS_deltaBuffer) {
                    try {
                        ai = localStorage.SS_deltaBuffer.split(",");
                    } catch (aj) {}
                }function ak(e) {
                    if (!e) {
                        return;
                    }if (!ai.length) {
                        ai = [e, e, e];
                    }e = Math.abs(e);ai.push(e);ai.shift();clearTimeout(i);i = setTimeout(function () {
                        try {
                            localStorage.SS_deltaBuffer = ai.join(",");
                        } catch (ap) {}
                    }, 1000);var an = e > 120 && F(e);var ao = !F(120) && !F(100) && !an;if (e < 50) {
                        return true;
                    }return ao;
                }function A(an, e) {
                    return Math.floor(an / e) == an / e;
                }function F(e) {
                    return A(ai[0], e) && A(ai[1], e) && A(ai[2], e);
                }function z(ao) {
                    var an = ao.target;var e = false;if (document.URL.indexOf("www.youtube.com/watch") != -1) {
                        do {
                            e = an.classList && an.classList.contains("html5-video-controls");if (e) {
                                break;
                            }
                        } while (an = an.parentNode);
                    }return e;
                }var U = function () {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (ao, an, e) {
                        window.setTimeout(ao, e || 1000 / 60);
                    };
                }();var L = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;var D = function () {
                    var e = document.scrollingElement;return function () {
                        if (!e) {
                            var ap = document.createElement("div");ap.style.cssText = "height:10000px;width:1px;";document.body.appendChild(ap);var ao = document.body.scrollTop;var an = document.documentElement.scrollTop;window.scrollBy(0, 3);if (document.body.scrollTop != ao) {
                                e = document.body;
                            } else {
                                e = document.documentElement;
                            }window.scrollBy(0, -3);document.body.removeChild(ap);
                        }return e;
                    };
                }();function ab(e) {
                    var ao, ap, an;e = e * I.pulseScale;if (e < 1) {
                        ao = e - (1 - Math.exp(-e));
                    } else {
                        ap = Math.exp(-1);e -= 1;an = 1 - Math.exp(-e);ao = ap + an * (1 - ap);
                    }return ao * I.pulseNormalize;
                }function p(e) {
                    if (e >= 1) {
                        return 1;
                    }if (e <= 0) {
                        return 0;
                    }if (I.pulseNormalize == 1) {
                        I.pulseNormalize /= ab(1);
                    }return ab(e);
                }var Q = window.navigator.userAgent;var aa = /Edge/.test(Q);var ah = /chrome/i.test(Q) && !aa;var f = /safari/i.test(Q) && !aa;var c = /firefox/i.test(Q);var P = /mobile/i.test(Q);var y = /Windows NT 6.1/i.test(Q) && /rv:11/i.test(Q);var X = f && (/Version\/8/i.test(Q) || /Version\/9/i.test(Q));var x = false;try {
                    window.addEventListener("test", null, Object.defineProperty({}, "passive", { get: function get() {
                            x = true;
                        } }));
                } catch (aj) {}var E = x ? { passive: false } : false;var S = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";if (S) {
                    k(S, u, E);k("mousedown", w);k("load", af);
                }function q(an) {
                    for (var e in an) {
                        if (ac.hasOwnProperty(e)) {
                            I[e] = an[e];
                        }
                    }
                }q.destroy = d;if (window.SmoothScrollOptions) {
                    q(window.SmoothScrollOptions);
                }if (typeof define === "function" && define.amd) {
                    define(function () {
                        return q;
                    });
                } else {
                    if ("object" == (typeof exports === 'undefined' ? 'undefined' : _typeof(exports))) {
                        module.exports = q;
                    } else {
                        window.SmoothScroll = q;
                    }
                }
            })();
        },
        ajaxAbort:function ajaxAbort() {
            let lang = '';
            switch (window.lang) {
                case 'en':
                    lang = 'The message content must not be less than 15 characters!';
                    break;
                case 'cn':
                    lang = '留言内容字符不得小于15个！';
                    break;
                case 'vi':
                    lang = 'Nội dung tin nhắn không được nhỏ hơn 15 ký tự!';
                    break;
                case 'tr':
                    lang = 'Mesaj içeriği 15 karakterden az olmamalı!';
                    break;
                case 'ru':
                    lang = 'Содержание сообщения должно быть не менее 15 символов!';
                    break;
                case 'es':
                    lang = '¡¡ los caracteres del contenido del mensaje no deben ser inferiores a 15!';
                    break;
                case 'sa':
                    lang = 'محتوى الرسالة لا تقل عن 15 حرفا !';
                    break;
                case 'de':
                    lang = 'Der Nachrichteninhalt darf nicht kleiner als 15-Zeichen sein!';
                    break;
                case 'jp':
                    lang = 'メッセージの内容文字は15文字未満ではありません！';
                    break;
                case 'kr':
                    lang = '메시지 내용 문자는 15개 이하여야 합니다!';
                    break;
                case 'fr':
                    lang = 'Le contenu du message ne doit pas être inférieur à 15 caractères!';
                    break;
            }

            $(document).ajaxSend(function(event, jqXHR, settings) {
                const params = new URLSearchParams(settings.data);
                const content = params.get('content');
                console.log(content)

                if (content && content.length < 15) {
                    layer.closeAll();
                    layer.msg(lang, { icon: 2, time: 4000 });
                    jqXHR.abort();
                }
            });
        },
        sideBar:function sideBar($el,$qr,$top){
            if (typeof $el !== 'object') alert('请至少填写一个对象 {icon:html}');
            let li = '';
            Object.keys($el).map(function (value,index){
                li += '<li><i class="iconfont '+value+'"></i><div class="child">'+$el[value]+'</div></li>';
            })
            let qr = '';
            if ($qr) {
                qr = '<li><i class="iconfont iconfont-erweima1"></i><div class="child"><div id="ewm2"></div></div></li>';
            }
            let top = '';
            if ($top) {
                top = '<li><i class="iconfont iconfont-erweima1"></i><div class="child"><div id="ewm2"></div></div></li>';
            }
            const html = '<div id="sidebar"><ul>' +li+qr+top+'</ul></div>';

            $("body").append(html)

            if ($qr) {
                new QRCode(document.getElementById("ewm2"), {
                    text: window.href,
                    correctLevel : 3
                });
            }

            if ($top) {
                $("#sidebar .top").click(function (){
                    $("body,html").animate({scrollTop:0},1000)
                })
            }
        }
    };
    $.plugin.Pop_Ups($(".msg"), false, false);
    $.plugin.SmoothScroll();
    $.plugin.ajaxAbort();

    /**
     * 全局效果说明
     * ---------------------Dividing line--------------------
     * @num_plus 数字相加
     * 参数 (obj,set_num,speed = 60)
     * 详解 obj
     *      获取容器对象
     *     set_num
     *      设置相加比例 公式: 数字 / set_num = 每次相加数字(整数)
     *     speed
     *      动画速度 默认 60ms
     * html 结构
     *      <ul>
     *          <li>*<em data-num="Number">0</em>*</li>
     *      </ul>
     *
     * ---------------------Dividing line--------------------
     * @BG_parallax 背景视差
     * 参数 (obj,speed = 0.5)
     * 详解 obj
     *      获取容器对象
     *     speed
     *      动画速度 默认 0.5
     *
     * ---------------------Dividing line--------------------
     * @Interval_Fun 区间判断
     * 参数 (obj,means,cycle,position)
     * 详解 obj
     *      获取容器对象
     *     means
     *      执行方法
     *     cycle
     *      是否多次执行  boolean值
     *     position
     *      当容器自身多少出现在屏幕中时执行 公式：容器高度 / position
     *
     * ---------------------Dividing line--------------------
     * @Video_open 视频弹窗
     * 参数 (obj,url,btn,img)
     * 详解 obj
     *       获取点击对象 ( html标签 data-src="视频地址" data-img="video第一帧" data-btn="关闭按钮颜色")
     *      method
     *       切换模式 (video / iframe) false / true
     *
     * ---------------------Dividing line--------------------
     * @Line_curve 画曲线
     * 参数 (obj,origin,coordinate,color,speed)
     * 详解 obj
     *       获取ID属性
     *     origin
     *       中心点 （数组） 百分比
     *     coordinate
     *       其它点 （控制点+终点）
     *       [
     *          [[终点],[控制点]] 百分比
     *       ]
     *     color
     *       线条颜色
     *     img
     *       图片
     *     speed
     *       速度
     * @shopping_cart 伪购物车
     * 参数 (text_, element, cart_page = false)
     * 详解 text_ = {
                    close: 'Close All',
                    title: 'Feedback',
                    submit: 'Send',
                    number: 'Number:',
                    cart: 'There are no products, just add them!',
                    required: 'Can not be empty!'
                }
     cart_page 是否启用自定义购物弹窗
     product 不启用时 返回数据
     注意 若提交失败 检查是否存在对应字段
     *
     */
});