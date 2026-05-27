'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$(document).ready(function () {
    window.lang = window.lang || document.documentElement.lang || 'en';
    window.href = location.protocol + '//' + location.host;

    var pluginUid = 0;
    function pluginId(prefix) {
        pluginUid++;
        return prefix + pluginUid;
    }
    function toJq(obj) {
        return obj && obj.jquery ? obj : $(obj);
    }
    function hasElement(obj) {
        return obj && obj.length;
    }
    function getScrollTop() {
        return $(document).scrollTop();
    }
    function inViewport(obj, position) {
        if (!hasElement(obj)) return false;
        var top = obj.offset().top;
        var point = top + obj.innerHeight() / (position || 1);
        var scrollTop = getScrollTop();
        return point < scrollTop + $(window).height() && point > scrollTop;
    }
    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (key) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[key];
        });
    }
    function escapeAttr(value) {
        return escapeHtml(value);
    }
    var layerLoading = false;
    var layerCallbacks = [];
    function flushLayerCallbacks() {
        var callbacks = layerCallbacks.slice(0);
        layerCallbacks.length = 0;
        layerLoading = false;
        $.each(callbacks||[], function (index, callback) {
            callback && callback();
        });
    }
    function ensureLayer(callback) {
        if (window.layer) {
            callback && callback();
            return;
        }
        if (callback) layerCallbacks.push(callback);
        if (layerLoading) return;
        layerLoading = true;
        flushLayerCallbacks();
    }
    function closeLayerAll() {
        if (window.layer && layer.closeAll) layer.closeAll();
    }
    function layerMsg(message, option) {
        if (window.layer && layer.msg) {
            layer.msg(message, option || {});
        } else if (window.console && console.warn) {
            console.warn(message);
        }
    }
    function safeCall(name, handler) {
        try {
            return handler && handler();
        } catch (error) {
            window.hwaqLastError = { name: name, error: error };
            if (window.console && console.error) {
                console.error('[hwaq:' + name + ']', error);
            }
            return false;
        }
    }
    function getAjaxField(data, name) {
        if (!data) return '';
        if (window.FormData && data instanceof FormData) return data.get(name) || '';
        if (typeof data === 'string') {
            if (window.URLSearchParams) {
                return new URLSearchParams(data).get(name) || '';
            }
            var pairs = data.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                if (decodeURIComponent(pair[0] || '') === name) {
                    return decodeURIComponent((pair[1] || '').replace(/\+/g, ' '));
                }
            }
            return '';
        }
        if (typeof data === 'object') return data[name] || '';
        return '';
    }
    function parseJson(value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }
    function storageAvailable() {
        try {
            var testKey = '__hwaq_storage_test__';
            window.localStorage.setItem(testKey, '1');
            window.localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    var hasLocalStorage = storageAvailable();
    function setSimpleStorage(name, value, days) {
        if (!hasLocalStorage) return false;
        var payload = { value: value == null ? '' : String(value) };
        if (days) {
            payload.expiresAt = Date.now() + parseInt(days, 10) * 24 * 60 * 60 * 1000;
        }
        window.localStorage.setItem(name, JSON.stringify(payload));
        return true;
    }
    function getSimpleStorage(name) {
        if (hasLocalStorage) {
            var raw = window.localStorage.getItem(name);
            if (raw) {
                var parsed = parseJson(raw);
                if (parsed && typeof parsed === 'object' && parsed.hasOwnProperty('value')) {
                    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
                        window.localStorage.removeItem(name);
                        return '';
                    }
                    return parsed.value == null ? '' : String(parsed.value);
                }
                return raw;
            }
        }
        return '';
    }
    function normalizeBasePath(path) {
        path = String(path == null ? '' : path).replace(/\\/g, '/');
        return !path || /\/$/.test(path) ? path : path + '/';
    }
    function getHwaqScriptBasePath() {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].getAttribute('src') || '';
            var matched = src.match(/^(.*)js\/hwaq(?:\.min)?\.js(?:[?#].*)?$/i);
            if (matched) return normalizeBasePath(matched[1] || '');
        }
        return null;
    }
    function getConfiguredLangBasePath(fallback) {
        var path = window.hwaqLangBasePath;
        if (path == null) path = window.hwaqBasePath;
        if (path == null) path = fallback;
        return normalizeBasePath(path);
    }
    var supportedLangCodes = {
        en: 1,
        cn: 1,
        es: 1,
        vi: 1,
        tr: 1,
        ru: 1,
        sa: 1,
        de: 1,
        jp: 1,
        kr: 1,
        fr: 1,
        pt: 1
    };
    var hwaqScriptBasePath = getHwaqScriptBasePath();
    var hwaqDefaultBasePath = hwaqScriptBasePath == null ? '//hqcdn.hqsmartcloud.com/' : hwaqScriptBasePath;
    var hwaqBasePath = getConfiguredLangBasePath(hwaqDefaultBasePath);
    var loadedLangFiles = window.hwaqLoadedLangFiles || {};
    window.hwaqLoadedLangFiles = loadedLangFiles;
    window.hwaqLangFiles = window.hwaqLangFiles || {};
    window.hwaqLangPacks = window.hwaqLangPacks || {};
    window.hwaqLangLoading = false;
    window.hwaqLangReady = false;
    function mergeLangFile(code) {
        if (window.hwaqLangFiles[code]) {
            window.hwaqLangPacks[code] = $.extend(true, {}, window.hwaqLangPacks[code] || {}, window.hwaqLangFiles[code]);
            return true;
        }
        return !!window.hwaqLangPacks[code];
    }
    function normalizeLangUrl(url) {
        return url.replace(/([^:]\/)\/+/g, '$1');
    }
    function resolveLangUrl(url) {
        var link = document.createElement('a');
        link.href = url;
        return link.href;
    }
    function appendQuery(url, key, value) {
        return url + (url.indexOf('?') > -1 ? '&' : '?') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    function getLangVersionValue() {
        var version = window.hwaqLangVersion;
        if (version == null) version = window.hwaqVersion;
        return version == null ? '' : version;
    }
    function buildLangFileUrl(code) {
        var url = normalizeLangUrl(hwaqBasePath + 'js/lang/' + code + '.js');
        var version = getLangVersionValue();
        if (version != null && version !== '') url = appendQuery(url, 'v', version);
        return url;
    }
    function withLangTimestamp(url) {
        return appendQuery(url, '_t', new Date().getTime());
    }
    function loadLangFile(code, options, callback) {
        options = options || {};
        code = String(code || '').toLowerCase();
        if (!code) {
            if (callback) callback(false);
            return false;
        }
        if (!options.force && mergeLangFile(code)) {
            if (callback) callback(true);
            return true;
        }
        var plainUrl = buildLangFileUrl(code);
        var cacheKey = code + '|' + resolveLangUrl(plainUrl);
        var entry = loadedLangFiles[cacheKey];
        if (options.force && entry && entry.status !== 'pending') {
            entry = null;
            delete loadedLangFiles[cacheKey];
        }
        if (entry && entry.status === 'pending') {
            if (callback) entry.callbacks.push(callback);
            return false;
        }
        if (entry && !options.force) {
            var cachedSuccess = entry.status === 'loaded' && (mergeLangFile(code) || !!window.hwaqLangPacks[code]);
            if (callback) callback(cachedSuccess);
            return cachedSuccess;
        }
        entry = loadedLangFiles[cacheKey] = {
            status: 'pending',
            callbacks: callback ? [callback] : []
        };
        $.ajax({
            url: withLangTimestamp(plainUrl),
            dataType: 'script',
            cache: true,
            async: true,
            global: false,
            success: function () {
                entry.success = mergeLangFile(code);
            },
            error: function () {
                entry.success = false;
            },
            complete: function () {
                var success = !!entry.success;
                entry.status = success ? 'loaded' : 'failed';
                var callbacks = entry.callbacks.slice(0);
                entry.callbacks.length = 0;
                $.each(callbacks||[], function (index, done) {
                    done && done(success || !!window.hwaqLangPacks[code]);
                });
            }
        });
        return false;
    }
    function getLangCode(lang) {
        var code = String(lang || window.lang).toLowerCase();
        var alias = { zh: 'cn', ja: 'jp', ko: 'kr', ar: 'sa' };
        if (code.indexOf('-') > -1) code = code.split('-')[0];
        code = alias[code] || code;
        return supportedLangCodes[code] ? code : 'en';
    }
    function hasFailedLangFile(code) {
        var url = buildLangFileUrl(code);
        var entry = loadedLangFiles[code + '|' + resolveLangUrl(url)];
        return !!(entry && entry.status === 'failed');
    }
    function canUseLangPack(lang) {
        var code = getLangCode(lang);
        mergeLangFile('en');
        if (code !== 'en') mergeLangFile(code);
        if (!window.hwaqLangPacks.en) return false;
        return code === 'en' || !!window.hwaqLangPacks[code] || hasFailedLangFile(code);
    }
    function loadRequiredLangPacks(lang, options, callback) {
        options = options || {};
        var code = getLangCode(lang);
        var codes = code === 'en' ? ['en'] : ['en', code];
        var remaining = codes.length;
        var success = true;
        window.hwaqLangLoading = true;
        $.each(codes||[], function (index, itemCode) {
            loadLangFile(itemCode, options, function (loaded) {
                if (!loaded && itemCode === 'en') success = false;
                remaining--;
                if (remaining > 0) return;
                window.hwaqLangLoading = false;
                window.hwaqLangReady = canUseLangPack(code);
                if (callback) callback(success && window.hwaqLangReady, code);
            });
        });
        return code;
    }
    function ensureLangPack(lang, callback, options) {
        var code = getLangCode(lang);
        if (callback) {
            if (!options || !options.force) {
                if (canUseLangPack(code)) {
                    callback(true, code);
                    return code;
                }
            }
            loadRequiredLangPacks(code, options, callback);
        } else if (!canUseLangPack(code)) {
            loadRequiredLangPacks(code, options);
        }
        return code;
    }

    ensureLangPack(window.lang);
    function getMergedLangPack(lang) {
        var code = getLangCode(lang);
        if (!canUseLangPack(code)) ensureLangPack(code);
        mergeLangFile('en');
        if (code !== 'en') mergeLangFile(code);
        var pack = $.extend(true, {}, window.hwaqLangPacks.en || {}, window.hwaqLangPacks[code] || {});
        window.hwaqLangPack = pack;
        window.langPack = pack;
        return pack;
    }
    function getLangSection(section, overrides, lang) {
        var pack = getMergedLangPack(lang);
        return $.extend(true, {}, pack[section] || {}, overrides || {});
    }
    window.hwaqGetLangPack = function (section, lang) {
        var pack = getMergedLangPack(lang);
        return section ? $.extend(true, {}, pack[section] || {}) : pack;
    };
    window.langPacks = window.hwaqLangPacks;
    window.getLangPack = window.hwaqGetLangPack;
    window.hwaqLangPack = getMergedLangPack();
    var refreshRegistry = {
        popUps: null,
        shoppingCart: null,
        cookiePrivacy: null
    };
    var globalStateCache = null;
    function setRefreshEntry(name, entry) {
        refreshRegistry[name] = entry;
        return entry;
    }
    function hasOwnWindow(name) {
        return Object.prototype.hasOwnProperty.call(window, name);
    }
    function hasOwnHwaqOption(name) {
        return window.hwaqOptions && typeof window.hwaqOptions === 'object' && Object.prototype.hasOwnProperty.call(window.hwaqOptions, name);
    }
    function serializeGlobalValue(value) {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return String(value);
        }
    }
    function getGlobalOptionValue(name, aliasName) {
        var optionValue = hasOwnHwaqOption(name) ? window.hwaqOptions[name] : undefined;
        var aliasValue = aliasName && hasOwnWindow(aliasName) ? window[aliasName] : undefined;
        if (typeof aliasValue === 'undefined') return optionValue;
        if (optionValue && aliasValue && typeof optionValue === 'object' && typeof aliasValue === 'object' && !$.isArray(optionValue) && !$.isArray(aliasValue)) {
            return $.extend(true, {}, optionValue, aliasValue);
        }
        return aliasValue;
    }
    function hasGlobalPopUpsConfig() {
        return hasOwnHwaqOption('popUps') || hasOwnWindow('hwaqPopUps') || getPopUpsConfig();
    }
    function hasGlobalCookiePrivacyConfig() {
        return hasOwnHwaqOption('cookiePrivacy') || hasOwnWindow('hwaqCookiePrivacy');
    }
    function getPopUpsConfig() {
        var raw = getGlobalOptionValue('popUps', 'hwaqPopUps');

        var config = {
            enabled: true,
            selector: '.msg',
            model: false,
            button: false,
            option: {}
        };
        if (raw === false) {
            config.enabled = false;
            return config;
        }
        if (raw == null || raw === true) return config;
        if (typeof raw === 'string' || raw && raw.jquery) {
            config.selector = raw;
            return config;
        }
        if (typeof raw === 'object') {
            var hasWrapper = raw.hasOwnProperty('enabled') || raw.hasOwnProperty('selector') || raw.hasOwnProperty('model') || raw.hasOwnProperty('button') || raw.hasOwnProperty('option');
            if (hasWrapper) {
                config.enabled = raw.enabled !== false;
                if (raw.selector != null) config.selector = raw.selector;
                if (raw.model != null) config.model = raw.model;
                if (raw.button != null) config.button = raw.button;
                if (raw.option && typeof raw.option === 'object') config.option = $.extend(true, {}, raw.option);
                $.each(raw, function (key, value) {
                    if ($.inArray(key, ['enabled', 'selector', 'model', 'button', 'option']) === -1) {
                        config.option[key] = value;
                    }
                });
            } else {
                config.option = $.extend(true, {}, raw);
            }
        }
        return config;
    }
    function getCookiePrivacyConfig() {
        var raw = getGlobalOptionValue('cookiePrivacy', 'hwaqCookiePrivacy');
        if (raw === false) return { enabled: false, options: null };
        if (!raw) return { enabled: false, options: null };
        if (typeof raw === 'object' && (raw.hasOwnProperty('enabled') || raw.hasOwnProperty('options'))) {
            return {
                enabled: raw.enabled !== false,
                options: raw.options && typeof raw.options === 'object' ? $.extend(true, {}, raw.options) : $.extend(true, {}, raw)
            };
        }
        if (typeof raw === 'object') {
            return { enabled: true, options: $.extend(true, {}, raw) };
        }
        return { enabled: !!raw, options: null };
    }
    function getSmoothScrollConfig() {
        var raw = getGlobalOptionValue('smoothScroll', 'hwaqSmoothScroll');
        var config = {
            enabled: !window.disableSmoothScroll,
            options: {}
        };
        if (raw === false) {
            config.enabled = false;
            return config;
        }
        if (raw == null || raw === true) return config;
        if (typeof raw === 'object') {
            if (raw.hasOwnProperty('enabled') || raw.hasOwnProperty('options')) {
                config.enabled = raw.enabled !== false;
                config.options = raw.options && typeof raw.options === 'object' ? $.extend(true, {}, raw.options) : {};
            } else {
                config.options = $.extend(true, {}, raw);
            }
        }
        return config;
    }
    function getAjaxAbortConfig() {
        var raw = getGlobalOptionValue('ajaxAbort', 'hwaqAjaxAbort');
        var config = { enabled: !window.disableAjaxAbort };
        if (raw === false) {
            config.enabled = false;
            return config;
        }
        if (raw == null || raw === true) return config;
        if (typeof raw === 'object' && raw.hasOwnProperty('enabled')) {
            config.enabled = raw.enabled !== false;
        }
        return config;
    }
    function getVideoOpenConfig() {
        var raw = getGlobalOptionValue('videoOpen', 'hwaqVideoOpen');
        var config = { enabled: true };
        if (raw === false) {
            config.enabled = false;
            return config;
        }
        if (raw == null || raw === true) return config;
        if (typeof raw === 'object' && raw.hasOwnProperty('enabled')) {
            config.enabled = raw.enabled !== false;
        }
        return config;
    }
    function getGlobalSnapshot() {
        return {
            lang: getLangCode(window.lang),
            langBasePath: getConfiguredLangBasePath(hwaqBasePath),
            cookiePrivacyValue: serializeGlobalValue(getGlobalOptionValue('cookiePrivacy', 'hwaqCookiePrivacy')),
            popUpsValue: serializeGlobalValue(getGlobalOptionValue('popUps', 'hwaqPopUps')),
            smoothScrollDefined: hasOwnWindow('SmoothScrollOptions') || hasOwnHwaqOption('smoothScroll') || hasOwnWindow('hwaqSmoothScroll'),
            smoothScrollValue: serializeGlobalValue(getGlobalOptionValue('smoothScroll', 'hwaqSmoothScroll')),
            ajaxAbortValue: serializeGlobalValue(getGlobalOptionValue('ajaxAbort', 'hwaqAjaxAbort')),
            videoOpenValue: serializeGlobalValue(getGlobalOptionValue('videoOpen', 'hwaqVideoOpen')),
            langVersionValue: serializeGlobalValue(getLangVersionValue()),
            disableAjaxAbort: !!window.disableAjaxAbort,
            disableSmoothScroll: !!window.disableSmoothScroll,
            optionsValue: serializeGlobalValue(window.hwaqOptions)
        };
    }
    function applyWindowGlobals(overrides) {
        if (!overrides || typeof overrides !== 'object') return;
        $.each(overrides||[], function (key, value) {
            window[key] = value;
        });
    }
    function getLangText(section, key, fallback, lang) {
        var pack = getMergedLangPack(lang);
        var text = pack && pack[section] && pack[section][key];
        return text == null || text === '' ? fallback : text;
    }
    function getComponentPreparingText() {
        return getLangText('common', 'componentPreparing', 'Component is getting ready.');
    }
    function showComponentPreparing() {
        layerMsg(getComponentPreparingText(), { icon: 0, time: 2000 });
    }
    function getPopUpsTriggerSelector(obj, config, btn_) {
        if (config && config.trigger) return config.trigger;
        if (typeof obj === 'string') return obj;
        if (obj && obj.selector) return obj.selector;
        return btn_ ? '#Pop_UpsBtn' : '';
    }
    function bindPreparingClick(namespace, selector, obj) {
        $(document).off('click.' + namespace);
        if (selector) {
            $(document).on('click.' + namespace, selector, function (event) {
                event.preventDefault();
                event.stopPropagation();
                showComponentPreparing();
            });
        } else if (obj) {
            toJq(obj).off('click.' + namespace).on('click.' + namespace, function (event) {
                event.preventDefault();
                event.stopPropagation();
                showComponentPreparing();
            });
        }
    }
    function preparePendingGlobalFeatures() {
        if (hasGlobalPopUpsConfig()) {
            var popConfig = getPopUpsConfig();
            if (popConfig.enabled) {
                var selector = popConfig.selector && popConfig.selector.jquery ? popConfig.selector : $(popConfig.selector || '.msg');
                bindPreparingClick('hwaqPopUpsPreparing', getPopUpsTriggerSelector(selector, popConfig.option || {}, popConfig.button), selector);
            }
        }
    }
    var pendingGlobalRefresh = false;
    function scheduleGlobalRefreshAfterLang(forceLangReload) {
        preparePendingGlobalFeatures();
        pendingGlobalRefresh = true;
        ensureLangPack(window.lang, function (ready) {
            if (!pendingGlobalRefresh) return;
            pendingGlobalRefresh = false;
            if (ready) runGlobalRefresh(null, 'ready');
        }, { force: !!forceLangReload });
    }
    function clearPopUpsUi() {
        $("#Pop_Ups_css,#pups_from,#pups_from_mask,#Pop_UpsBtn").remove();
        $(document).off('.hwaqPopUps');
        $(document).off('click.hwaqPopUpsPreparing');
        refreshRegistry.popUps = null;
        return false;
    }
    function applyPopUpsFromGlobals() {
        var config = getPopUpsConfig();
        if (!config.enabled) return clearPopUpsUi();
        var selector = config.selector && config.selector.jquery ? config.selector : $(config.selector || '.msg');
        return safeCall('Pop_Ups', function () {
            return $.plugin.Pop_Ups(selector, config.model, config.button, $.extend(true, {}, config.option || {}));
        });
    }
    function applySmoothScrollFromGlobals() {
        var config = getSmoothScrollConfig();
        if (!config.enabled) return $.plugin.disableSmoothScroll();
        return safeCall('SmoothScroll', function () {
            return $.plugin.SmoothScroll($.extend(true, {}, config.options || {}));
        });
    }
    function applyAjaxAbortFromGlobals() {
        var config = getAjaxAbortConfig();
        window.disableAjaxAbort = config.enabled === false;
        return safeCall('ajaxAbort', function () {
            return $.plugin.ajaxAbort();
        });
    }
    function applyVideoOpenFromGlobals() {
        var config = getVideoOpenConfig();
        if (!config.enabled) {
            $(document).off('click.hwaqVideo').off('keyup.hwaqVideoClose');
            $('.video_box').add($('i.video_mask')).add($('#video_css')).remove();
            return false;
        }
        return safeCall('Video_open', function () {
            return $.plugin.Video_open();
        });
    }
    function rebuildCookiePrivacy(preferGlobal) {
        var cookieConfig = getCookiePrivacyConfig();
        var options = null;
        $("#hwaq_cookie_privacy").remove();
        if (preferGlobal && hasGlobalCookiePrivacyConfig()) {
            if (!cookieConfig.enabled || !cookieConfig.options) {
                refreshRegistry.cookiePrivacy = null;
                return false;
            }
            options = $.extend(true, {}, cookieConfig.options);
        } else if (refreshRegistry.cookiePrivacy) {
            options = $.extend(true, {}, refreshRegistry.cookiePrivacy.options || {});
        } else if (cookieConfig.enabled && cookieConfig.options) {
            options = $.extend(true, {}, cookieConfig.options);
        }
        if (!options) return false;
        return safeCall('Cookie_Privacy', function () {
            return $.plugin.Cookie_Privacy(options);
        });
    }
    function rebuildLangComponents(preferGlobalCookie) {
        var pack = getMergedLangPack(window.lang);
        if (hasGlobalPopUpsConfig()) {
            var globalPopVisible = $('#pups_from:visible').length > 0;
            var globalPopApi = applyPopUpsFromGlobals();
            if (globalPopVisible && globalPopApi && globalPopApi.open) globalPopApi.open();
        } else if (refreshRegistry.popUps) {
            var popEntry = refreshRegistry.popUps;
            var popVisible = $('#pups_from:visible').length > 0;
            var popApi = safeCall('Pop_Ups', function () {
                return $.plugin.Pop_Ups(popEntry.obj, popEntry.model, popEntry.btn_, $.extend(true, {}, popEntry.option || {}));
            });
            if (popVisible && popApi && popApi.open) popApi.open();
        }
        if (refreshRegistry.shoppingCart) {
            var cartEntry = refreshRegistry.shoppingCart;
            var cartVisible = $('#cart:visible').length > 0;
            var cartState = cartEntry.api && cartEntry.api.getState ? cartEntry.api.getState() : null;
            var cartApi = safeCall('shopping_cart', function () {
                return $.plugin.shopping_cart(cartEntry.cart_page, $.extend({}, cartEntry.element || {}), $.extend(true, {}, cartEntry.text_ || {}), cartEntry.product);
            });
            if (cartState && cartApi && cartApi.setState) cartApi.setState(cartState, true);
            if (cartVisible && cartApi && cartApi.open) cartApi.open();
        }
        rebuildCookiePrivacy(preferGlobalCookie);
        return pack;
    }
    function runGlobalRefresh(overrides, mode) {
        applyWindowGlobals(overrides);
        var previous = globalStateCache || getGlobalSnapshot();
        var current = getGlobalSnapshot();
        var previousBasePath = hwaqBasePath;
        var pathChanged = previous.langBasePath !== current.langBasePath || hwaqBasePath !== current.langBasePath;
        if (pathChanged) {
            hwaqBasePath = current.langBasePath;
        }
        window.lang = current.lang;
        var langVersionChanged = previous.langVersionValue !== current.langVersionValue;
        var langUrlChanged = pathChanged && resolveLangUrl(normalizeLangUrl(previousBasePath + 'js/lang/' + current.lang + '.js')) !== resolveLangUrl(normalizeLangUrl(current.langBasePath + 'js/lang/' + current.lang + '.js'));
        var forceLangReload = mode === 'lang' || langUrlChanged || langVersionChanged;
        if (mode !== 'ready' && (forceLangReload || !canUseLangPack(current.lang))) {
            scheduleGlobalRefreshAfterLang(forceLangReload);
            return getMergedLangPack(window.lang);
        }
        var shouldRefreshLang = mode === 'ready' || mode === 'lang' || !globalStateCache || previous.lang !== current.lang || pathChanged || langVersionChanged;
        var popUpsChanged = !globalStateCache || previous.popUpsValue !== current.popUpsValue || previous.optionsValue !== current.optionsValue;
        var cookieChanged = !globalStateCache || previous.cookiePrivacyValue !== current.cookiePrivacyValue || previous.optionsValue !== current.optionsValue;
        var smoothChanged = !globalStateCache || previous.smoothScrollDefined !== current.smoothScrollDefined || previous.smoothScrollValue !== current.smoothScrollValue || previous.disableSmoothScroll !== current.disableSmoothScroll || previous.optionsValue !== current.optionsValue;
        var ajaxChanged = !globalStateCache || previous.ajaxAbortValue !== current.ajaxAbortValue || previous.disableAjaxAbort !== current.disableAjaxAbort || previous.optionsValue !== current.optionsValue;
        var videoChanged = !globalStateCache || previous.videoOpenValue !== current.videoOpenValue || previous.optionsValue !== current.optionsValue;
        var pack = shouldRefreshLang ? rebuildLangComponents(hasGlobalCookiePrivacyConfig()) : getMergedLangPack(window.lang);
        if (!shouldRefreshLang && popUpsChanged && hasGlobalPopUpsConfig()) applyPopUpsFromGlobals();
        if (!shouldRefreshLang && cookieChanged) rebuildCookiePrivacy(hasGlobalCookiePrivacyConfig());
        if (smoothChanged) applySmoothScrollFromGlobals();
        if (ajaxChanged) applyAjaxAbortFromGlobals();
        if (videoChanged) applyVideoOpenFromGlobals();
        globalStateCache = getGlobalSnapshot();
        return pack;
    }
    $.plugin = $.extend($.plugin || {}, {
        getLangPack: function getLangPack(section, lang) {
            return window.hwaqGetLangPack(section, lang);
        },
        getHwaqOptions: function getHwaqOptions() {
            return {
                popUps: getPopUpsConfig(),
                smoothScroll: getSmoothScrollConfig(),
                ajaxAbort: getAjaxAbortConfig(),
                videoOpen: getVideoOpenConfig(),
                cookiePrivacy: getCookiePrivacyConfig()
            };
        },
        refreshLang: function refreshLang(nextLang) {
            var targetLang = nextLang;
            if (targetLang && typeof targetLang === 'object') targetLang = targetLang.lang;
            return runGlobalRefresh({ lang: targetLang || window.lang }, 'lang');
        },
        refreshGlobals: function refreshGlobals(overrides) {
            return runGlobalRefresh(overrides, 'globals');
        },
        disableSmoothScroll: function disableSmoothScroll() {
            window.disableSmoothScroll = true;
            if (window.SmoothScroll && window.SmoothScroll.destroy) {
                try {
                    window.SmoothScroll.destroy();
                } catch (error) {
                    window.hwaqLastError = { name: 'SmoothScroll.destroy', error: error };
                }
            }
            return true;
        },
        enableSmoothScroll: function enableSmoothScroll(options) {
            window.disableSmoothScroll = false;
            if (options && typeof options === 'object') {
                window.SmoothScrollOptions = $.extend(true, {}, window.SmoothScrollOptions || {}, options);
            }
            return $.plugin.SmoothScroll();
        },
        NUMBER_plus: function NUMBER_plus(obj, set_num, speed) {
            obj = toJq(obj);
            if (!hasElement(obj)) return false;
            set_num = parseInt(set_num, 10) || 50;
            speed = parseInt(speed, 10) || 60;
            var duration = Math.max(900, set_num * speed);
            var scrollLock = true;
            var nsNumber = obj.data('hwaqNumberNs') || ('.hwaqNumber' + pluginId(''));
            obj.data('hwaqNumberNs', nsNumber);

            if (!$('#hwaq_number_roll_css').length) {
                $('head').append('<style id="hwaq_number_roll_css">.hwaq-num-roll{display:inline-flex;align-items:baseline;white-space:nowrap}.hwaq-num-cell{display:inline-block;height:1em;line-height:1em;overflow:hidden;vertical-align:baseline}.hwaq-num-strip{display:block;will-change:transform}.hwaq-num-strip span{display:block;height:1em;line-height:1em;text-align:center}.hwaq-num-static{display:inline-block;line-height:1em}</style>');
            }

            function getFinalText(em) {
                var raw = em.attr('data-num');
                if (raw == null || raw === '') raw = em.text();
                var number = parseFloat(String(raw).replace(/,/g, ''));
                if (em.hasClass('d') && isFinite(number)) return parseInt(number, 10).toLocaleString();
                return String(raw);
            }

            function buildDigit(finalDigit, rounds) {
                var html = '<data class="hwaq-num-cell" data-final="' + finalDigit + '"><data class="hwaq-num-strip">';
                var total = rounds * 10 + parseInt(finalDigit, 10);
                for (var i = 0; i <= total; i++) {
                    html += '<data class="block">' + (i % 10) + '</data>';
                }
                return html + '</data></data>';
            }

            function requestFrame(callback) {
                return (window.requestAnimationFrame || function (fn) {
                    return setTimeout(function () { fn(new Date().getTime()); }, 16);
                })(callback);
            }

            function animateDigit(cell, index) {
                var $cell = $(cell);
                var strip = $cell.find('.hwaq-num-strip');
                var rowHeight = $cell.height() || parseFloat($cell.css('font-size')) || 16;
                var rows = strip.children().length - 1;
                var digitDuration = duration + index * 90;
                var start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    var progress = Math.min((timestamp - start) / digitDuration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var y = -rows * rowHeight * eased;
                    strip.css('transform', 'translate3d(0,' + y + 'px,0)');
                    if (progress < 1) requestFrame(step);else strip.css('transform', 'translate3d(0,' + (-rows * rowHeight) + 'px,0)');
                }

                requestFrame(step);
            }

            function run() {
                if (!scrollLock || !(getScrollTop() + $(window).height() > obj.offset().top && obj.offset().top + obj.innerHeight() > getScrollTop())) return;
                scrollLock = false;
                obj.find('em').each(function (emIndex) {
                    var em = $(this);
                    var text = getFinalText(em);
                    var html = '<data class="hwaq-num-roll" aria-label="'+text+'">';
                    for (var i = 0; i < text.length; i++) {
                        var char = text.charAt(i);
                        if (/\d/.test(char)) {
                            html += buildDigit(char, 3 + ((i + emIndex) % 4));
                        } else {
                            html += '<span class="hwaq-num-static">' + escapeHtml(char) + '</span>';
                        }
                    }
                    html += '</data>'
                    // roll.addClass('hwaq-num-roll').attr('aria-label', text).html(html);
                    em.html(html);
                    em.find('.hwaq-num-cell').each(function (index) {
                        animateDigit(this, index);
                    });
                });
            }

            $(window).off('scroll' + nsNumber + ' resize' + nsNumber).on('scroll' + nsNumber + ' resize' + nsNumber, run);
            run();
            return true;
        },
        BG_parallax: function BG_parallax(obj, speed) {
            obj = toJq(obj);
            if (!hasElement(obj)) return false;
            if (!speed && speed !== 0) speed = .5;
            var ticking = false;
            var nsBg = obj.data('hwaqBgNs') || ('.hwaqBg' + pluginId(''));
            obj.data('hwaqBgNs', nsBg);

            function render() {
                ticking = false;
                obj.css({
                    'background-position-y': (obj.offset().top + obj.innerHeight() / 2 - (getScrollTop() + $(window).height() / 2)) * speed
                });
            }

            function schedule() {
                if (ticking) return;
                ticking = true;
                (window.requestAnimationFrame || function (callback) { return setTimeout(callback, 16); })(render);
            }

            $(window).off('scroll' + nsBg + ' resize' + nsBg).on('scroll' + nsBg + ' resize' + nsBg, schedule);
            render();
            return true;
        },
        Interval_Fun: function Interval_Fun(obj, means, cycle, position) {
            obj = toJq(obj);
            if (!hasElement(obj) || typeof means !== 'function') return false;
            if (!position) position = 2;
            var cycleCount = 0;
            var nsInterval = obj.data('hwaqIntervalNs') || ('.hwaqInterval' + pluginId(''));
            obj.data('hwaqIntervalNs', nsInterval);

            function run() {
                if (inViewport(obj, position)) {
                    cycleCount++;
                    if (!cycle && cycleCount <= 1) means();else if (cycle) means();
                }
            }

            $(window).off('scroll' + nsInterval + ' resize' + nsInterval).on('scroll' + nsInterval + ' resize' + nsInterval, run);
            run();
            return true;
        },
        Video_open: function Video_open() {
            $(document).off('click.hwaqVideo').on('click.hwaqVideo', '.play', function () {
                var obj = $(this);
                var src = obj.attr('data-src');
                if (!src) return false;
                var img = obj.attr('data-img');
                var btn = obj.attr('data-btn') || '#000';
                var method = obj.attr('data-mode');
                src = encodeURI(src);
                img = img ? encodeURI(img) : '';
                var tag = !method ? '<video controls autoplay controlsList="nodownload" oncontextmenu="return false;" style="max-height:80vh;"' + (img ? ' poster="' + escapeAttr(img) + '"' : '') + ' src="' + escapeAttr(src) + '"></video>' : '<iframe width="1000" height="540" src="' + escapeAttr(src) + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                var video = "<div class='video_box active'>" + tag + "<i class='video_close iconfont iconfont-close'></i></div><i class='video_mask active'></i>";
                var css = "<style type='text/css' id='video_css'>.video_box{position:fixed;display:inline-block;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);z-index:1000;max-width:90%;max-height:90%;transition:.5s;transform-origin:center center;zoom:1}.video_box video,.video_box iframe{background-color:#000;max-width:100%;max-height:100%;transition:.5s}.video_box i.video_close{position:absolute;height:40px;width:40px;border-radius:100%;background:" + escapeAttr(btn) + ";display:block;right:-20px;top:-20px;cursor:pointer;text-align:center;line-height:40px;color:#fff;font-size:18px;opacity:0;transition:.5s}.video_box:hover i.video_close{opacity:1}.video_box.active{transform:translate(-50%,-50%) scale(.3);zoom:.3}i.video_mask{position:fixed;top:0;left:0;z-index:900;background:rgba(0,0,0,.5);height:100%;width:100%;transition:.5s .2s;opacity:1}i.video_mask.active{opacity:0;transition:.5s}.video_box video,.video_box iframe{min-width:900px}@media screen and (max-width:1000px){.video_box video,.video_box iframe{min-width:600px;display:block;max-height:340px!important}}@media screen and (max-width:700px){.video_box video,.video_box iframe{min-width:400px;display:block;max-height:240px!important}}@media screen and (max-width:500px){.video_box video,.video_box iframe{min-width:300px;display:block;max-height:170px!important}}</style>";
                $('.video_box').add($('i.video_mask')).add($('#video_css')).remove();
                $('body').append(video);
                if (!$('#video_css').length) $('body').append(css);
                $('body').animate(200, function () {
                    $('.video_box').add($('.video_mask')).removeClass('active');
                });
                function close() {
                    $('.video_box').add($('i.video_mask')).add($('#video_css')).remove();
                    $(document).off('keyup.hwaqVideoClose');
                }
                $('i.video_mask').add($('i.video_close')).one('click', close);
                $(document).off('keyup.hwaqVideoClose').on('keyup.hwaqVideoClose', function (event) {
                    if (event.keyCode === 27) close();
                });
            });
            return true;
        },
        Pop_Ups: function Pop_Ups(obj, model, btn_, option) {
            var config = $.extend(true, {}, option || {});
            setRefreshEntry('popUps', {
                obj: obj,
                model: model,
                btn_: btn_,
                option: $.extend(true, {}, config)
            });
            if (!canUseLangPack(config.lang || window.lang)) {
                bindPreparingClick('hwaqPopUpsPreparing', getPopUpsTriggerSelector(obj, config, btn_), obj);
                ensureLangPack(config.lang || window.lang, function (ready) {
                    if (ready) $.plugin.Pop_Ups(obj, model, btn_, $.extend(true, {}, config));
                });
                return {
                    ready: false,
                    root: function () { return $(); },
                    form: function () { return $(); },
                    open: function () { showComponentPreparing(); return this; },
                    close: function () { return this; },
                    getData: function () { return {}; },
                    getFields: function () { return []; }
                };
            }
            $(document).off('click.hwaqPopUpsPreparing');
            var lang = getLangSection('popUps', config, config.lang);
            var popupTheme = String(config.theme || config.styleMode || config.popupTheme || 'compact').toLowerCase();
            var popupThemes = { compact: 1, grand: 1 };
            if (!popupThemes[popupTheme]) popupTheme = 'compact';
            var defaultFields = [
                { name: 'name', label: lang.name, required: true, type: 'text', attrs: { autocomplete: 'off' } },
                { name: 'mail', label: lang.mail, required: true, type: 'text', attrs: { autocomplete: 'off' } },
                { name: 'phone', label: lang.phone, type: 'text', attrs: { autocomplete: 'off' } },
                { name: 'company', label: lang.company, type: 'text', attrs: { autocomplete: 'off' } },
                { name: 'content', label: lang.message, required: true, type: 'textarea', attrs: { autocomplete: 'off' } }
            ];
            var hiddenFields = $.isArray(config.hiddenFields) ? config.hiddenFields : [
                { name: 'your-message', value: '' },
                { name: 'your-email', value: '' }
            ];

            function buildAttrs(attrs=[]) {
                var html = [];
                $.each(attrs || {}, function (key, value) {
                    if (value == null || value === false) return;
                    if (value === true) html.push(key);else html.push(key + '="' + escapeAttr(value) + '"');
                });
                return html.join(' ');
            }

            function cloneFields(fields) {
                return $.map(fields || [], function (field) {
                    return $.extend(true, {}, field);
                });
            }

            function resolveFields() {
                var fields = $.isArray(config.fields) ? cloneFields(config.fields) : cloneFields(defaultFields);
                if (!$.isArray(config.fields)) {
                    if ($.isArray(config.removeFields) && config.removeFields.length) {
                        fields = $.grep(fields, function (field) {
                            return $.inArray(field.name, config.removeFields) === -1;
                        });
                    }
                    if ($.isArray(config.prependFields)) fields = cloneFields(config.prependFields).concat(fields);
                    if ($.isArray(config.appendFields)) fields = fields.concat(cloneFields(config.appendFields));
                }
                return fields;
            }

            function renderField(field) {
                if (!field || field.disabled) return '';
                var itemAttrs = $.extend({}, field.itemAttrs || {});
                var itemClasses = [];
                if (field.type === 'html' || field.html) {
                    if (field.fullWidth !== false) itemClasses.push('hwaq-popup-span-2');
                    if (field.itemClass) itemClasses.push(field.itemClass);
                    if (itemClasses.length) itemAttrs['class'] = $.trim((itemAttrs['class'] || '') + ' ' + itemClasses.join(' '));
                    var itemAttrHtml = buildAttrs(itemAttrs);
                    return '<li' + (itemAttrHtml ? ' ' + itemAttrHtml : '') + '>' + (field.html || '') + '</li>';
                }
                var tag = field.tag || (field.type === 'textarea' ? 'textarea' : 'input');
                var inputAttrs = $.extend({}, field.attrs || {});
                if (!inputAttrs.name && field.name) inputAttrs.name = field.name;
                if (tag !== 'textarea') inputAttrs.type = field.inputType || field.type || 'text';
                if (field.placeholder != null) inputAttrs.placeholder = field.placeholder;
                if (field.readonly) inputAttrs.readonly = 'readonly';
                if (field.maxlength) inputAttrs.maxlength = field.maxlength;
                var attrHtml = buildAttrs(inputAttrs);
                if (field.fullWidth || tag === 'textarea') itemClasses.push('hwaq-popup-span-2');
                if (field.itemClass) itemClasses.push(field.itemClass);
                if (itemClasses.length) itemAttrs['class'] = $.trim((itemAttrs['class'] || '') + ' ' + itemClasses.join(' '));
                var itemAttrHtml = buildAttrs(itemAttrs);
                var labelHtml = field.label ? '<label>' + (field.required ? '<em>*</em>' : '') + escapeHtml(field.label) + ':</label>' : '';
                var value = field.value == null ? '' : field.value;
                var controlHtml = tag === 'textarea' ? '<textarea' + (attrHtml ? ' ' + attrHtml : '') + '>' + escapeHtml(value) + '</textarea>' : '<input' + (attrHtml ? ' ' + attrHtml : '') + ' value="' + escapeAttr(value) + '">';
                return '<li' + (itemAttrHtml ? ' ' + itemAttrHtml : '') + '>' + labelHtml + controlHtml + '</li>';
            }

            function getFields() {
                return resolveFields();
            }

            var fields = getFields();
            var hiddenHtml = $.map(hiddenFields, function (field) {
                if (!field || !field.name) return '';
                return '<input type="hidden" name="' + escapeAttr(field.name) + '" value="' + escapeAttr(field.value == null ? '' : field.value) + '">';
            }).join('');
            var listHtml = $.map(fields, renderField).join('');
            var submitHtml = config.submitHtml || '<li class="hwaq-popup-submit hwaq-popup-span-2"><input type="submit" value="' + escapeAttr(lang.send) + '"></li>';
            var eyebrowText = Object.prototype.hasOwnProperty.call(config, 'eyebrow') ? config.eyebrow : lang.eyebrow;
            var descText = Object.prototype.hasOwnProperty.call(config, 'description') ? config.description : lang.description || '';
            var eyebrowHtml = eyebrowText ? '<span class="hwaq-popup-eyebrow">' + escapeHtml(eyebrowText) + '</span>' : '';
            var descHtml = descText ? '<p class="hwaq-popup-desc">' + escapeHtml(descText) + '</p>' : '';
            var css = '<style type="text/css" id="Pop_Ups_css">#pups_from_mask{position:fixed;inset:0;background:rgba(15,23,42,.42);backdrop-filter:blur(6px);z-index:21;display:none}#pups_from{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);max-height:calc(100vh - 36px);overflow:auto;z-index:22;background:#fff;border:1px solid rgba(148,163,184,.22);box-shadow:0 32px 90px rgba(15,23,42,.24);border-radius:18px}#pups_from::-webkit-scrollbar{width:8px}#pups_from::-webkit-scrollbar-thumb{background:rgba(100,116,139,.35);border-radius:999px}#pups_from .hwaq-popup-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:24px;padding-right:42px}#pups_from .hwaq-popup-copy{min-width:0}#pups_from .hwaq-popup-eyebrow{display:inline-flex;align-items:center;padding:7px 14px;border-radius:999px;background:rgba(15,23,42,.06);color:#0f172a;font-size:13px;font-weight:700;line-height:1;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}#pups_from h4{margin:0;font-size:32px;line-height:1.1;font-weight:700;color:#0f172a}#pups_from .hwaq-popup-desc{margin:12px 0 0;font-size:15px;line-height:1.75;color:#475569;max-width:560px}#pups_from form{margin:0}#pups_from form ul{list-style:none;margin:0;padding:0;display:grid;gap:14px 18px}#pups_from form ul li{margin:0;position:relative}#pups_from form ul li label{display:block;margin-bottom:9px;font-size:13px;font-weight:600;color:#334155;line-height:1.4}#pups_from form ul li label em{color:#ef4444;margin-right:3px}#pups_from form ul li input,#pups_from form ul li textarea,#pups_from form ul li select{width:100%;border:1px solid #dbe2ea;background:#fff;color:#0f172a;border-radius:12px;transition:border-color .2s,box-shadow .2s,background .2s;font-size:15px;line-height:1.5;outline:none}#pups_from form ul li input,#pups_from form ul li select{min-height:52px;padding:13px 16px}#pups_from form ul li textarea{min-height:136px;padding:14px 16px;resize:vertical}#pups_from form ul li input:focus,#pups_from form ul li textarea:focus,#pups_from form ul li select:focus{border-color:var(--color);box-shadow:0 0 0 4px rgba(15,23,42,.06)}#pups_from .hwaq-popup-span-2{grid-column:1/-1}#pups_from .hwaq-popup-submit{padding-top:6px}#pups_from .hwaq-popup-submit input[type="submit"],#pups_from .hwaq-popup-submit button{width:auto;min-width:180px;min-height:54px;padding:0 32px;border:0;border-radius:999px;background:var(--color);color:#fff;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 16px 32px rgba(15,23,42,.18);transition:transform .2s,opacity .2s,box-shadow .2s}#pups_from .hwaq-popup-submit input[type="submit"]:hover,#pups_from .hwaq-popup-submit button:hover{opacity:.96;transform:translateY(-1px);box-shadow:0 20px 36px rgba(15,23,42,.22)}#pups_from i.close{position:absolute;top:18px;right:18px;width:38px;height:38px;border-radius:999px;background:rgba(15,23,42,.06);cursor:pointer;transition:background .2s,transform .2s}#pups_from i.close:after,#pups_from i.close:before{content:\"\";position:absolute;top:50%;left:50%;width:16px;height:2px;margin:-1px 0 0 -8px;background:#0f172a;transition:background .2s,transform .2s}#pups_from i.close:before{transform:rotate(45deg)}#pups_from i.close:after{transform:rotate(-45deg)}#pups_from i.close:hover{background:var(--color);transform:rotate(90deg)}#pups_from i.close:hover:after,#pups_from i.close:hover:before{background:#fff}#pups_from.hwaq-popup--compact{width:560px;max-width:calc(100vw - 28px);padding:28px 26px 24px}#pups_from.hwaq-popup--compact form ul{grid-template-columns:1fr}#pups_from.hwaq-popup--compact h4{font-size:28px}#pups_from.hwaq-popup--compact .hwaq-popup-eyebrow{font-size:12px}#pups_from.hwaq-popup--compact .hwaq-popup-desc{font-size:14px;line-height:1.65}#pups_from.hwaq-popup--compact form ul li input,#pups_from.hwaq-popup--compact form ul li select{min-height:48px;padding:12px 14px}#pups_from.hwaq-popup--compact form ul li textarea{min-height:110px;padding:12px 14px}#pups_from.hwaq-popup--grand{width:860px;max-width:calc(100vw - 48px);padding:42px 44px 38px;background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)}#pups_from.hwaq-popup--grand .hwaq-popup-head{margin-bottom:32px;gap:24px}#pups_from.hwaq-popup--grand form ul{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 20px}#pups_from.hwaq-popup--grand form ul li label{font-size:14px;margin-bottom:10px}#pups_from.hwaq-popup--grand form ul li input,#pups_from.hwaq-popup--grand form ul li select{min-height:60px;padding:16px 18px;font-size:16px}#pups_from.hwaq-popup--grand form ul li textarea{min-height:170px;padding:16px 18px;font-size:16px}#pups_from.hwaq-popup--grand .hwaq-popup-submit input[type=\"submit\"],#pups_from.hwaq-popup--grand .hwaq-popup-submit button{min-width:220px;min-height:58px;font-size:16px}#Pop_UpsBtn{width:60px;height:60px;line-height:60px;text-align:center;position:fixed;border-radius:999px;background:var(--color);color:#fff;right:2%;bottom:5%;font-size:24px;box-shadow:0 18px 34px rgba(15,23,42,.25);cursor:pointer;transition:transform .2s,box-shadow .2s;z-index:22}#Pop_UpsBtn:hover{transform:translateY(-2px);box-shadow:0 24px 40px rgba(15,23,42,.3)}@media screen and (max-width:760px){#pups_from,#pups_from.hwaq-popup--grand,#pups_from.hwaq-popup--compact{width:auto;max-width:calc(100vw - 20px);padding:20px 18px 18px;border-radius:16px}#pups_from .hwaq-popup-head{margin-bottom:18px;padding-right:34px}#pups_from .hwaq-popup-eyebrow,#pups_from.hwaq-popup--grand .hwaq-popup-eyebrow,#pups_from.hwaq-popup--compact .hwaq-popup-eyebrow{font-size:12px;padding:6px 12px;margin-bottom:12px}#pups_from h4,#pups_from.hwaq-popup--grand h4,#pups_from.hwaq-popup--compact h4{font-size:24px;line-height:1.15}#pups_from .hwaq-popup-desc,#pups_from.hwaq-popup--grand .hwaq-popup-desc,#pups_from.hwaq-popup--compact .hwaq-popup-desc{font-size:14px;line-height:1.6}#pups_from form ul,#pups_from.hwaq-popup--grand form ul,#pups_from.hwaq-popup--compact form ul{grid-template-columns:1fr;gap:12px}#pups_from .hwaq-popup-submit input[type=\"submit\"],#pups_from .hwaq-popup-submit button{width:100%;min-width:0}#pups_from i.close{top:14px;right:14px;width:34px;height:34px}}</style>';
            var html = '<div id="pups_from_mask" hidden></div><div id="pups_from" class="hwaq-popup--' + escapeAttr(popupTheme) + '" hidden><div class="hwaq-popup-head"><div class="hwaq-popup-copy">' + eyebrowHtml + '<h4>' + escapeHtml(lang.title) + '</h4>' + descHtml + '</div><i class="close" aria-label="' + escapeAttr(lang.close || getLangText('common', 'close', '')) + '"></i></div><form onsubmit="return false;">' + hiddenHtml + '<ul>' + listHtml + submitHtml + '</ul></form></div>';
            var btn = config.buttonHtml || '<div id="Pop_UpsBtn"><i class="iconfont iconfont-xinxi"></i></div>';
            var modelForm = false;
            var modelUrl = '';
            $("#Pop_Ups_css,#pups_from,#pups_from_mask,#Pop_UpsBtn").remove();
            $(document).off('.hwaqPopUps');
            $('body').append(css).append(html);
            if (btn_) $('body').append(btn);
            ensureLayer();

            function root() {
                return $('#pups_from');
            }
            function mask() {
                return $('#pups_from_mask');
            }

            function form() {
                return root().find('form');
            }

            function readFormData() {
                var data = {};
                $.each(form().serializeArray()||[], function (index, item) {
                    data[item.name] = item.value;
                });
                return data;
            }

            function close() {
                root().add(mask()).stop().fadeOut(180);
                return api;
            }

            function open() {
                mask().stop().fadeIn(160);
                root().stop().fadeIn(220);
                return api;
            }

            function rebuild(nextConfig) {
                return $.plugin.Pop_Ups(obj, model, btn_, $.extend(true, {}, config, nextConfig || {}));
            }

            var api = {
                root: root,
                form: form,
                open: open,
                close: close,
                getData: readFormData,
                getFields: function () {
                    return cloneFields(getFields());
                },
                setFields: function (nextFields) {
                    return rebuild({ fields: nextFields, prependFields: [], appendFields: [], removeFields: [] });
                },
                addField: function (field, index) {
                    var nextFields = cloneFields(getFields());
                    if (index == null || index < 0 || index > nextFields.length) nextFields.push(field);else nextFields.splice(index, 0, field);
                    return rebuild({ fields: nextFields, prependFields: [], appendFields: [], removeFields: [] });
                },
                setTheme: function (theme) {
                    return rebuild({ theme: theme });
                },
                removeField: function (name) {
                    var nextFields = $.grep(getFields(), function (field) {
                        return field.name !== name;
                    });
                    return rebuild({ fields: nextFields, prependFields: [], appendFields: [], removeFields: [] });
                }
            };

            var popSelector = config.trigger || (obj && obj.selector ? obj.selector : '#Pop_UpsBtn');
            $(document).on('click.hwaqPopUps', popSelector, function (e) {
                if (model && !modelForm) {
                    e.preventDefault();
                    e.stopPropagation();
                    modelUrl = $(this).attr('href') || $(this).find('a').attr('href') || '';
                }
                if (!modelForm) open();
            });
            root().find('i.close').on('click.hwaqPopUps', function () {
                close();
            });
            mask().on('click.hwaqPopUps', function () {
                close();
            });
            form().find('input[type=submit]').on('click.hwaqPopUps', function () {
                if (window.layer && layer.load) layer.load(0, { shade: 0.1, shadeClose: false });
                var submitData = form().serialize();
                if (typeof config.beforeSubmit === 'function') {
                    var beforeResult = config.beforeSubmit(readFormData(), api);
                    if (beforeResult === false) {
                        closeLayerAll();
                        return false;
                    }
                    if (beforeResult != null) submitData = beforeResult;
                }
                $.ajax({
                    type: config.method || 'post',
                    url: config.url || '/Api/contact/submit/uid/1.html',
                    data: submitData,
                    dataType: config.dataType || 'json',
                    success: function success(data) {
                        closeLayerAll();
                        if (data.status == 200) {
                            layerMsg(data.result, { icon: 1, time: 4000 });
                            if (typeof config.onSuccess === 'function') config.onSuccess(data, api);
                            if (model && !modelForm && modelUrl) {
                                modelForm = true;
                                close();
                                var a = document.createElement('a');
                                a.setAttribute('href', modelUrl);
                                a.setAttribute('download', '');
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                            }
                        } else {
                            layerMsg(data.result, { icon: 2, time: 4000 });
                            if (typeof config.onError === 'function') config.onError(data, api);
                        }
                    }
                });
                return false;
            });
            return api;
        },
        Line_curve: function Line_curve(obj, origin, coordinate, color, img, speed) {
            var box = document.getElementById(obj);
            if (!box || !origin || !coordinate || !coordinate.length || !img) return false;
            if (!speed) speed = 0.01;
            if (!color) color = '#000';
            var con = box.appendChild(document.createElement('canvas'));
            var ctx = con.getContext('2d');
            con.width = box.offsetWidth ? box.offsetWidth : window.innerWidth;
            con.height = box.offsetHeight ? box.offsetHeight : window.innerHeight;
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
                (window.requestAnimationFrame || function (callback) { return setTimeout(callback, 16); })(animate);
            }

            function formula(ctx, start, end, control, percent) {
                //            浜屾璐濆灏旀洸绾垮潗鏍囪绠楀叕寮?
                var v01 = [control[0] - start[0], control[1] - start[1]]; // 鍚戦噺<p0, p1>
                var v12 = [end[0] - control[0], end[1] - control[1]]; // 鍚戦噺<p1, p2>
                var q0 = [start[0] + v01[0] * percent, start[1] + v01[1] * percent];
                var q1 = [control[0] + v12[0] * percent, control[1] + v12[1] * percent];
                var v = [q1[0] - q0[0], q1[1] - q0[1]]; // 鍚戦噺<q0, q1>
                var b = [q0[0] + v[0] * percent, q0[1] + v[1] * percent];
                ctx.moveTo(start[0], start[1]);
                ctx.quadraticCurveTo(q0[0], q0[1], b[0], b[1]);
            }

            animate();
        },
        shopping_cart: function shopping_cart(cart_page, element, text_, product) {
            var callback = typeof product === 'function' ? product : null;
            var option = text_ || {};
            var refreshElement = $.extend({}, element || {});
            var refreshText = $.extend(true, {}, option);
            var formFieldNames = $.extend({
                name: 'name',
                phone: 'phone',
                mail: 'mail',
                content: 'content'
            }, option.formFields || {});
            var storageKey = option.storageKey || 'the_product_info';
            var submitUrl = option.url || '/Api/contact/submit/uid/1.html';
            cart_page = !!cart_page;
            element = $.extend({
                shopping_cart: '.shopping_cart',
                shopping_form: '.shopping_form',
                shopping_list: '.shopping_list',
                product_box: '.product_box',
                product_name: '.product_name',
                product_link: '.product_link',
                product_det: '.product_det',
                product_img: '.product_img',
                product_tag: '.product_tag',
                product_add: '.product_add'
            }, element || {});
            if (!canUseLangPack(option.lang || window.lang)) {
                bindPreparingClick('hwaqCartPreparing', element.shopping_cart);
                ensureLangPack(option.lang || window.lang, function (ready) {
                    $(document).off('click.hwaqCartPreparing');
                    if (ready) $.plugin.shopping_cart(cart_page, $.extend({}, refreshElement || {}), $.extend(true, {}, refreshText || {}), product);
                });
                return {
                    ready: false,
                    getState: function () { return { items: [], form: {} }; },
                    getItems: function () { return []; },
                    open: function () { showComponentPreparing(); return this; },
                    close: function () { return this; },
                    render: function () { return this; }
                };
            }
            $(document).off('click.hwaqCartPreparing');
            text_ = getLangSection('shoppingCart', option, option.lang);
            var css = '<style type="text/css" id="">#cart_mask{position:fixed;inset:0;background:rgba(15,23,42,.42);backdrop-filter:blur(6px);z-index:21;display:none}#cart{position:fixed;top:0;right:0;width:760px;max-width:calc(100vw - 18px);height:100vh;max-height:none;overflow:auto;padding:30px 28px;z-index:22;background:#fff;border-left:1px solid rgba(148,163,184,.22);box-shadow:-28px 0 70px rgba(15,23,42,.22);transform:translateX(104%);transition:transform .24s ease;color:#0f172a}#cart.hwaq-cart-open{transform:translateX(0)}#cart.active{position:static;width:auto;max-width:none;height:auto;transform:none;box-shadow:none;border:0;overflow:visible}#cart::-webkit-scrollbar,#cart .left ul::-webkit-scrollbar{width:8px}#cart::-webkit-scrollbar-thumb,#cart .left ul::-webkit-scrollbar-thumb{background:rgba(100,116,139,.35);border-radius:999px}#cart .box.two{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:24px;align-items:start}#cart .left,#cart .right{min-width:0;color:#0f172a}#cart .left ul{list-style:none;margin:0;padding:0;max-height:calc(100vh - 128px);overflow:auto;padding-right:6px}#cart .left ul li{margin:0 0 14px;padding:14px;background:#f8fafc;border:1px solid #e5edf5;border-radius:14px}#cart .left ul li.empty{color:#64748b;text-align:center;padding:28px 16px}#cart .left ul li .box2{position:relative;display:grid;grid-template-columns:92px minmax(0,1fr);gap:14px;align-items:start}#cart .left ul li .img{width:auto;overflow:hidden;border-radius:12px;background:#fff;aspect-ratio:1/1}#cart .left ul li .img img{width:100%;height:100%;object-fit:cover;display:block}#cart .left ul li .text{width:auto;padding-left:0}#cart .left ul li .text h4{margin:0 30px 10px 0;font-size:16px;line-height:1.35;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;color:#0f172a}#cart .left ul li .text h4 a{color:inherit}#cart .left ul li .text p{display:inline-block;margin:0 10px 0 0;font-size:13px;color:#475569}#cart .left ul li .text input{width:72px;color:#0f172a;padding:7px 9px;display:inline-block;border:1px solid #dbe2ea;border-radius:10px;background:#fff}#cart .left ul li .text textarea{width:100%;min-height:74px;padding:10px 12px;color:#0f172a;margin-top:10px;border:1px solid #dbe2ea;border-radius:12px;background:#fff;resize:vertical}#cart .left ul li i.del{position:absolute;top:0;right:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(15,23,42,.06);font-size:15px;cursor:pointer;color:#0f172a}#cart .left span.close_all{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 20px;border-radius:999px;background:#0f172a;color:#fff;font-size:14px;font-weight:700;cursor:pointer;margin-top:4px}#cart .right .shopping_form{background:#f8fafc;color:#0f172a;padding:20px;border:1px solid #e5edf5;border-radius:16px}#cart .right h4{font-size:24px;line-height:1.15;margin:0 42px 18px 0;color:#0f172a}#cart .right ul{list-style:none;margin:0;padding:0}#cart .right ul li{margin:0 0 12px}#cart .right ul li label{display:block;font-size:13px;font-weight:600;margin:0 0 8px;color:#334155}#cart .right ul li input,#cart .right ul li textarea{width:100%;padding:12px 14px;border:1px solid #dbe2ea;border-radius:12px;font-size:14px;color:#0f172a;background:#fff;outline:none}#cart .right ul li textarea{height:132px;resize:vertical}#cart .right ul li input:focus,#cart .right ul li textarea:focus{border-color:var(--color);box-shadow:0 0 0 4px rgba(15,23,42,.06)}#cart .right ul li input[type="submit"]{width:auto;min-width:150px;background:var(--color);border:0;font-size:15px;font-weight:700;margin-top:4px;padding:0 28px;min-height:48px;color:#fff;border-radius:999px;cursor:pointer;box-shadow:0 14px 28px rgba(15,23,42,.16)}#cart i.close{position:absolute;right:18px;top:18px;width:38px;height:38px;border-radius:999px;background:rgba(15,23,42,.06);cursor:pointer;transition:background .2s,transform .2s}#cart i.close:after,#cart i.close:before{content:"";position:absolute;top:50%;left:50%;width:16px;height:2px;margin:-1px 0 0 -8px;background:#0f172a}#cart i.close:before{transform:rotate(45deg)}#cart i.close:after{transform:rotate(-45deg)}#cart i.close:hover{background:var(--color);transform:rotate(90deg)}#cart i.close:hover:after,#cart i.close:hover:before{background:#fff}@media screen and (max-width:860px){#cart{width:calc(100vw - 12px);padding:24px 18px}#cart .box.two{grid-template-columns:1fr;gap:18px}#cart .left ul{max-height:none;overflow:visible;padding-right:0}#cart .right .shopping_form{padding:18px}#cart .left ul li .box2{grid-template-columns:76px minmax(0,1fr)}}</style>';
            var html = '<div id="cart_mask"></div><div id="cart" style="display:none"><div class="box grid-box two"><div class="left column"><ul class="shopping_list"></ul><span class="close_all">' + escapeHtml(text_.close) + '</span></div><div class="right column"><div class="shopping_form"><h4>' + escapeHtml(text_.title) + '</h4><form onsubmit="return false;"><ul><li><label for="company">' + escapeHtml(text_.company) + ':</label><input type="text" id="company" name="' + escapeAttr(formFieldNames.name) + '" placeholder=""></li><li><label for="phone">' + escapeHtml(text_.phoneLabel) + ':</label><input type="text" id="phone" name="' + escapeAttr(formFieldNames.phone) + '" placeholder=""></li><li><label for="mail">' + escapeHtml(text_.mailLabel) + ':</label><input type="text" id="mail" name="' + escapeAttr(formFieldNames.mail) + '" placeholder=""></li><li><label for="content">' + escapeHtml(text_.detailMessage) + ':</label><textarea id="content" name="' + escapeAttr(formFieldNames.content) + '" placeholder=""></textarea></li><li><input type="submit" value="' + escapeAttr(text_.submit) + '"></li></ul></form></div></div></div><i class="close iconfont iconfont-close" aria-label="' + escapeAttr(getLangText('common', 'close', '')) + '"></i></div>';
            var callbackLock = false;
            var state = readState();

            function cloneState(value) {
                return parseJson(JSON.stringify(value));
            }

            function normalizeItem(item) {
                item = item || {};
                var normalized = {
                    id: item.id != null ? String(item.id) : '',
                    name: item.name != null ? String(item.name) : '',
                    url: item.url != null ? String(item.url) : '',
                    det: item.det != null ? String(item.det) : '',
                    img: item.img != null ? String(item.img) : '',
                    tag: item.tag != null ? String(item.tag) : '',
                    qty: Math.max(1, parseInt(item.qty, 10) || 1),
                    message: item.message != null ? String(item.message) : ''
                };
                if (!normalized.id) normalized.id = normalized.name || normalized.url || pluginId('cart_');
                return normalized;
            }

            function normalizeItems(items) {
                var result = [];
                $.each(items || [], function (index, item) {
                    if (!item) return;
                    if (typeof item === 'string') {
                        item = parseJson(item);
                        if (!item) return;
                    }
                    if (!$.isArray(item) && typeof item === 'object') {
                        var keys = Object.keys(item);
                        if (!item.id && keys.length === 1 && item[keys[0]] && typeof item[keys[0]] === 'object') {
                            item = $.extend({ id: keys[0] }, item[keys[0]]);
                        }
                        result.push(normalizeItem(item));
                    }
                });
                return result;
            }

            function normalizeState(raw) {
                if ($.isArray(raw)) raw = { items: raw };
                raw = raw || {};
                return {
                    items: normalizeItems(raw.items || []),
                    form: $.extend({}, raw.form || {})
                };
            }

            function readState() {
                var stored = getSimpleStorage(storageKey);
                if (!stored) return { items: [], form: {} };
                var parsed = parseJson(stored);
                if (parsed && (parsed.items || parsed.form || $.isArray(parsed))) {
                    return normalizeState(parsed);
                }
                if (stored.indexOf('?^') > -1) {
                    return normalizeState({ items: stored.split('?^') });
                }
                return normalizeState({ items: [stored] });
            }

            function saveState() {
                setSimpleStorage(storageKey, JSON.stringify(state));
                $(element.shopping_cart).find('em').html(state.items.length);
                syncProductButtons();
                return state;
            }

            function findItemIndex(id) {
                var index = -1;
                $.each(state.items||[], function (itemIndex, item) {
                    if (item.id === id) {
                        index = itemIndex;
                        return false;
                    }
                });
                return index;
            }

            function syncProductButtons() {
                $(element.product_box).find(element.product_add).removeClass('active');
                $.each(state.items||[], function (index, item) {
                    $(element.product_box).filter(function () {
                        return String($(this).attr('data-id') || '') === item.id;
                    }).find(element.product_add).addClass('active');
                });
            }

            function buildItemFromTrigger(trigger) {
                var box = trigger.closest(element.product_box);
                var tags = [];
                box.find(element.product_tag).children('*').each(function () {
                    tags.push($.trim($(this).text()));
                });
                return normalizeItem({
                    id: String(box.attr('data-id') || ''),
                    name: $.trim(box.find(element.product_name).first().text()).replace(/\s+/g, ' '),
                    url: box.find(element.product_link).first().attr('href') || '',
                    det: $.trim(box.find(element.product_det).first().text()),
                    img: box.find(element.product_img).first().attr('src') || '',
                    tag: tags.join('/'),
                    qty: 1,
                    message: ''
                });
            }

            function updateItem(id, patch, silent) {
                var index = findItemIndex(id);
                if (index === -1) return api;
                state.items[index] = normalizeItem($.extend({}, state.items[index], patch || {}));
                persistAndRender();
                if (!silent) notify('item:update', { item: cloneState(state.items[index]) });
                return api;
            }

            function addItem(item, silent) {
                state.items.push(normalizeItem(item));
                persistAndRender();
                if (!silent) notify('item:add', { item: cloneState(item) });
                return api;
            }

            function removeItem(id, silent) {
                var index = findItemIndex(id);
                if (index === -1) return api;
                var removed = state.items.splice(index, 1)[0];
                persistAndRender();
                if (!silent) notify('item:remove', { item: cloneState(removed) });
                return api;
            }

            function clearItems(silent) {
                state.items = [];
                persistAndRender();
                if (!silent) notify('items:clear');
                return api;
            }

            function getState() {
                return cloneState(state);
            }

            function getFormRoot() {
                return $(element.shopping_form).find('form');
            }

            function readFormFromDom() {
                var data = {};
                $.each(getFormRoot().serializeArray()||[], function (index, item) {
                    data[item.name] = item.value;
                });
                state.form = $.extend({}, state.form, data);
                saveState();
                return cloneState(state.form);
            }

            function writeFormToDom() {
                var formData = state.form || {};
                $.each(formData||[], function (name, value) {
                    getFormRoot().find('[name="' + name + '"]').val(value);
                });
            }

            function composeCartMessage() {
                var content = '';
                $.each(state.items||[], function (index, item) {
                    content += '\n' + item.name + '\n' + text_.msgNumber + ':' + item.qty + '\n' + text_.msg + ':' + item.message + '\n' + text_.msgUrl + ':' + item.url + '\n-------------------------------------------\n';
                });
                return content;
            }

            function renderCartList() {
                if (cart_page) return;
                var list = $(element.shopping_list);
                list.html('');
                if (!state.items.length) {
                    list.html('<li class="empty">' + escapeHtml(text_.cart) + '</li>');
                    return;
                }
                $.each(state.items||[], function (index, item) {
                    list.append('<li data-id="' + escapeAttr(item.id) + '"><div class="box2 grid-box"><div class="img column"><a href="' + escapeAttr(item.url) + '"><img src="' + escapeAttr(item.img) + '?imageView2/2/w/400/h/400/format/jpg/q/80" alt=""></a></div><div class="text column"><h4><a href="' + escapeAttr(item.url) + '">' + escapeHtml(item.name) + '</a></h4><p>' + escapeHtml(text_.number) + '</p><input class="num" type="number" min="1" value="' + escapeAttr(item.qty) + '"><div class="Item" hidden>' + escapeHtml(item.tag) + '</div><textarea class="msg" placeholder="">' + escapeHtml(item.message) + '</textarea><i class="del iconfont iconfont-gouwuche"></i></div></div></li>');
                });
            }

            function renderCart() {
                if (!cart_page) {
                    renderCartList();
                    writeFormToDom();
                }
                return api;
            }

            function persistAndRender() {
                saveState();
                renderCart();
            }

            function setState(nextState, silent) {
                state = normalizeState(nextState);
                persistAndRender();
                if (!silent) notify('state:set');
                return api;
            }

            function setItems(items, silent) {
                state.items = normalizeItems(items);
                persistAndRender();
                if (!silent) notify('items:set');
                return api;
            }

            function setFormData(formData, silent) {
                state.form = $.extend({}, state.form, formData || {});
                persistAndRender();
                if (!silent) notify('form:set');
                return api;
            }

            function applyCallbackResult(result) {
                if (result == null) return;
                if ($.isArray(result)) {
                    setItems(result, true);
                    return;
                }
                if (result && typeof result === 'object' && (result.items || result.form)) {
                    setState(result, true);
                }
            }

            function notify(action, meta) {
                if (!callback || callbackLock) return;
                callbackLock = true;
                var result = callback(getState(), api, action, meta || {});
                callbackLock = false;
                applyCallbackResult(result);
            }

            var closeCartTimer = null;
            function openCart() {
                if (!cart_page) {
                    renderCart();
                    clearTimeout(closeCartTimer);
                    $('#cart_mask').stop().fadeIn(160);
                    $('#cart').show();
                    setTimeout(function () {
                        $('#cart').addClass('hwaq-cart-open');
                    }, 20);
                }
                notify('cart:open');
                return api;
            }

            function closeCart() {
                if (!cart_page) {
                    $('#cart').removeClass('hwaq-cart-open');
                    $('#cart_mask').stop().fadeOut(160);
                    closeCartTimer = setTimeout(function () {
                        $('#cart').hide();
                    }, 240);
                }
                return api;
            }

            var api = {
                getState: getState,
                setState: setState,
                getItems: function () {
                    return getState().items;
                },
                setItems: setItems,
                updateItems: function (handler) {
                    if (typeof handler !== 'function') return api;
                    var nextItems = handler(getState().items, api);
                    if (nextItems != null) setItems(nextItems);
                    return api;
                },
                getFormData: function () {
                    return cloneState(state.form || {});
                },
                setFormData: setFormData,
                updateFormData: function (handler) {
                    if (typeof handler !== 'function') return api;
                    var nextForm = handler(cloneState(state.form || {}), api);
                    if (nextForm != null) setFormData(nextForm);
                    return api;
                },
                addItem: addItem,
                removeItem: removeItem,
                clear: clearItems,
                save: function () {
                    saveState();
                    return api;
                },
                render: renderCart,
                open: openCart,
                close: closeCart
            };

            if (!cart_page) {
                $('#cart,#cart_mask,#cart_css').remove();
                $(document).off('.hwaqCart');
                $('body').append(html, css.replace('id=""', 'id="cart_css"').replace('#cart i.fa-close', '#cart i.close'));
                ensureLayer();
                renderCart();
                $(document).on('click.hwaqCartAdd', element.product_add, function () {
                    var item = buildItemFromTrigger($(this));
                    if (!item.id) return;
                    if (findItemIndex(item.id) > -1) removeItem(item.id);else addItem(item);
                });
                $(document).on('click.hwaqCart', '#cart i.del', function () {
                    removeItem($(this).closest('li').attr('data-id'));
                });
                $(document).on('input.hwaqCart change.hwaqCart', '#cart .num', function () {
                    var value = Math.max(1, parseInt($(this).val(), 10) || 1);
                    $(this).val(value);
                    updateItem($(this).closest('li').attr('data-id'), { qty: value }, true);
                    notify('item:qty', { id: $(this).closest('li').attr('data-id'), qty: value });
                });
                $(document).on('input.hwaqCart change.hwaqCart', '#cart .msg', function () {
                    var message = $(this).val();
                    updateItem($(this).closest('li').attr('data-id'), { message: message }, true);
                    notify('item:message', { id: $(this).closest('li').attr('data-id'), message: message });
                });
                $(document).on('input.hwaqCart change.hwaqCart', '#cart form [name]', function () {
                    readFormFromDom();
                    notify('form:change', { name: $(this).attr('name'), value: $(this).val() });
                });
                $(document).on('blur.hwaqCart', '#cart input[type="text"],#cart input[type="number"],#cart textarea', function () {
                    if ($(this).val() === '') {
                        layerMsg(text_.required, { icon: 2, time: 4000 });
                    }
                });
                $(document).on('click.hwaqCart', '#cart input[type="submit"]', function (e) {
                    e.preventDefault();
                    readFormFromDom();
                    var payload = $.extend({}, state.form);
                    var contentKey = formFieldNames.content;
                    var originalContent = payload[contentKey] || '';
                    payload[contentKey] = originalContent + composeCartMessage();
                    if (window.layer && layer.load) layer.load(0, { shade: 0.1, shadeClose: false });
                    $.ajax({
                        type: 'post',
                        url: submitUrl,
                        data: payload,
                        dataType: 'json',
                        success: function success(ret) {
                            closeLayerAll();
                            if (ret.status == 200) {
                                layerMsg(ret.result, { icon: 1, time: 4000 });
                                clearItems(true);
                                notify('submit:success', { response: ret, payload: payload });
                            } else {
                                layerMsg(ret.result, { icon: 2, time: 4000 });
                                notify('submit:error', { response: ret, payload: payload });
                            }
                        }
                    });
                });
                $(document).on('click.hwaqCart', '#cart span.close_all', function () {
                    clearItems();
                });
                $(document).on('click.hwaqCart', element.shopping_cart, function () {
                    openCart();
                });
                $(document).on('click.hwaqCart', '#cart i.close', function () {
                    closeCart();
                });
                $(document).on('click.hwaqCart', '#cart_mask', function () {
                    closeCart();
                });
            }

            saveState();
            renderCart();
            notify('init');
            setRefreshEntry('shoppingCart', {
                cart_page: cart_page,
                element: refreshElement,
                text_: refreshText,
                product: product,
                api: api
            });
            return api;
        },
        form_files_Picture: function form_files_Picture(obj, btn, name, list, required) {
            if (!$(obj).length || !btn) return false;
            var commonLang = getLangSection('common');
            if (typeof html2canvas == 'undefined') {
                if (confirm(commonLang.html2canvasMissing)) {
                    window.open('http://html2canvas.hertzen.com/dist/html2canvas.min.js');
                }
                return false;
            }
            function savePic() {
                var _this = this;
                var width = $(obj)[0].offsetWidth; //dom瀹?                var height = $(obj)[0].offsetHeight; //dom楂?                var scale = 2; //鏀惧ぇ鍊嶆暟
                var canvas = document.createElement('canvas');
                canvas.width = width * 2;
                canvas.height = height * 2;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                var context = canvas.getContext('2d');
                context.scale(scale, scale);
                //璁剧疆context浣嶇疆锛屽€间负鐩稿浜庤绐楃殑鍋忕Щ閲忚礋鍊硷紝璁╁浘鐗囧浣?瑙ｅ喅鍋忕Щ鐨勯噸鐐?
                var rect = $(obj).get(0).getBoundingClientRect(); //鑾峰彇鍏冪礌鐩稿浜庤瀵熺殑鍋忕Щ閲?                context.translate(-rect.left, -rect.top);
                var opts = {
                    imageTimeout: 15000,
                    useCORS: true, //闃叉鍥剧墖璺ㄥ煙
                    x: 0,
                    y: 0,
                    scrollY: 0,
                    scrollX: 0,
                    logging: true
                };
                var target = document.querySelector(obj) || document.querySelector(".form_information table");
                if (!target) return false;
                html2canvas(target, opts).then(function (canvas) {
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
                            closeLayerAll();
                            if (data.status == 200) {
                                layerMsg(data.result, { icon: 1, time: 4000 });
                            } else {
                                layerMsg(data.result, { icon: 2, time: 4000 });
                            }
                        }
                    });
                });
            }
            $(document).off('click.hwaqFormPicture', btn).on('click.hwaqFormPicture', btn, function () {
                var lock = false;
                if (window.layer && layer.load) layer.load(0, { shade: 0.1, shadeClose: false });
                $(obj + list + required).filter(function () {
                    if ($(this).parents(list).next().find('input').val() === '') {
                        lock = true;
                    }
                });
                if (lock) {
                    closeLayerAll();
                    layerMsg(commonLang.checkRequiredItems, { icon: 2, time: 4000 });
                    return false;
                }
                savePic();
            });
        },
        SmoothScroll: function SmoothScroll(options) {
            if (options === false) return $.plugin.disableSmoothScroll();
            if (options && typeof options === 'object') {
                window.SmoothScrollOptions = $.extend(true, {}, window.SmoothScrollOptions || {}, options);
            }
            if (window.disableSmoothScroll) {
                return $.plugin.disableSmoothScroll();
            }
            if (window.SmoothScroll && window.SmoothScroll.destroy) {
                window.SmoothScroll.destroy();
            }
            try {
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
                        var aw = Date.now();var aE = 0;var aD = 0;for (var az = 0; az < (V ? V.length : 0); az++) {
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
                        }if (V && V.length) {
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
                    clearTimeout(ae);ae = setTimeout(function () {
                        o = n = al = {};
                    }, 1 * 1000);
                }function g(ap, ao, e) {
                    ap = ap || [];var an = e ? o : n;for (var aq = ap.length; aq--;) {
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
                    }if (!ai || !ai.length) {
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
            } catch (error) {
                window.hwaqLastError = { name: 'SmoothScroll', error: error };
                if (window.console && console.error) {
                    console.error('[hwaq:SmoothScroll]', error);
                }
                return false;
            }
            return true;
        },
        ajaxAbort:function ajaxAbort() {
            if (window.hwaqAjaxAbortReady) return true;
            window.hwaqAjaxAbortReady = true;
            $(document).ajaxSend(function (event, jqXHR, settings) {
                if (window.disableAjaxAbort) return;
                var lang = getLangSection('ajaxAbort').message;
                var content = getAjaxField(settings && settings.data, 'content');
                if (content && content.length < 15) {
                    closeLayerAll();
                    layerMsg(lang, { icon: 2, time: 4000 });
                    jqXHR.abort();
                }
            });
            return true;
        },
        Cookie_Privacy:function Cookie_Privacy(options) {
            setRefreshEntry('cookiePrivacy', {
                options: $.extend(true, {}, options || {})
            });
            if (!canUseLangPack(options && options.lang || window.lang)) {
                ensureLangPack(options && options.lang || window.lang, function (ready) {
                    if (ready) $.plugin.Cookie_Privacy($.extend(true, {}, options || {}));
                });
                return false;
            }
            var defaults = $.extend(true, {
                type: 'banner',
                position: 'bottom',
                cookieName: 'hwaq_cookie_consent',
                expires: 180,
                force: false,
                onChange: null,
                categories: []
            }, getLangSection('cookiePrivacy', {}, options && options.lang));
            var opt = $.extend(true, {}, defaults, options || {});
            var type = opt.type === 'popup' || opt.mode === 'popup' ? 'popup' : 'banner';
            var position = String(opt.position || (type === 'banner' ? 'bottom' : 'bottom-left')).toLowerCase();
            var popupPositions = { 'top-left': 1, 'top-right': 1, 'bottom-left': 1, 'bottom-right': 1 };

            if (type === 'banner') {
                position = position === 'top' ? 'top' : 'bottom';
            } else if (!popupPositions[position]) {
                position = 'bottom-left';
            }

            if (!opt.force && getSimpleStorage(opt.cookieName)) return false;

            function normalizeCategories(categories) {
                var result = [];
                if ($.isArray(categories)) {
                    result = categories.slice(0);
                } else if (categories && typeof categories === 'object') {
                    $.each(categories||[], function (key, value) {
                        if (typeof value === 'string') {
                            result.push({ key: key, title: key, description: value });
                        } else {
                            result.push($.extend({ key: key }, value));
                        }
                    });
                }
                if (!$.isArray(result) || !result.length) {
                    result = $.map(defaults.categories || [], function (item) {
                        return $.extend({}, item);
                    });
                }
                return result;
            }

            var categories = normalizeCategories(opt.categories);
            var necessaryFound = false;
            $.each(categories||[], function (index, item) {
                if (item.required || item.key === 'necessary') necessaryFound = true;
            });
            if (!necessaryFound) {
                categories.unshift($.extend({ key: 'necessary', required: true }, defaults.categories && defaults.categories[0] ? defaults.categories[0] : {}));
            }

            if (!$("#hwaq_cookie_privacy_css").length) {
                $("head").append('<style id="hwaq_cookie_privacy_css">.hwaq-cookie,.hwaq-cookie *{box-sizing:border-box}.hwaq-cookie{position:fixed;z-index:99999;font-family:Arial,Helvetica,sans-serif;color:#1f2937}.hwaq-cookie--banner{left:0;right:0;padding:16px}.hwaq-cookie--top{top:0}.hwaq-cookie--bottom{bottom:0}.hwaq-cookie--popup{width:420px;max-width:calc(100% - 32px)}.hwaq-cookie--top-left{top:16px;left:16px}.hwaq-cookie--top-right{top:16px;right:16px}.hwaq-cookie--bottom-left{bottom:16px;left:16px}.hwaq-cookie--bottom-right{bottom:16px;right:16px}.hwaq-cookie__panel{background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 18px 50px rgba(15,23,42,.18);padding:20px}.hwaq-cookie--banner .hwaq-cookie__panel{width:1120px;max-width:100%;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}.hwaq-cookie__badge{display:inline-block;margin-bottom:8px;padding:4px 9px;border-radius:999px;background:#eef2ff;color:#273a8a;font-size:12px;font-weight:700;line-height:1.2}.hwaq-cookie__title{margin:0 0 8px;font-size:20px;line-height:1.25;color:#111827}.hwaq-cookie__text{margin:0;font-size:14px;line-height:1.55;color:#4b5563}.hwaq-cookie__actions{display:flex;gap:10px;align-items:center;justify-content:flex-end;flex-wrap:wrap}.hwaq-cookie--popup .hwaq-cookie__actions{justify-content:flex-start;margin-top:18px}.hwaq-cookie__btn{appearance:none;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#111827;cursor:pointer;font-size:14px;font-weight:700;line-height:1;padding:12px 16px;transition:background .2s,color .2s,border-color .2s,box-shadow .2s}.hwaq-cookie__btn:hover{border-color:#111827}.hwaq-cookie__btn--primary{background:#111827;border-color:#111827;color:#fff}.hwaq-cookie__btn--primary:hover{background:#000;border-color:#000}.hwaq-cookie__btn--ghost{background:#f9fafb}.hwaq-cookie__settings{grid-column:1/-1;border-top:1px solid #e5e7eb;margin-top:4px;padding-top:14px}.hwaq-cookie__settings[hidden]{display:none!important}.hwaq-cookie__item{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;padding:12px 0;border-bottom:1px solid #f3f4f6}.hwaq-cookie__item:last-child{border-bottom:0}.hwaq-cookie__item strong{display:block;font-size:14px;color:#111827}.hwaq-cookie__item p{margin:4px 0 0;font-size:13px;line-height:1.45;color:#6b7280}.hwaq-cookie__switch{position:relative;display:inline-block;width:44px;height:24px}.hwaq-cookie__switch input{opacity:0;width:0;height:0}.hwaq-cookie__slider{position:absolute;cursor:pointer;inset:0;background:#d1d5db;border-radius:999px;transition:.2s}.hwaq-cookie__slider:before{content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}.hwaq-cookie__switch input:checked+.hwaq-cookie__slider{background:#111827}.hwaq-cookie__switch input:checked+.hwaq-cookie__slider:before{transform:translateX(20px)}.hwaq-cookie__switch input:disabled+.hwaq-cookie__slider{cursor:not-allowed;opacity:.65}@media screen and (max-width:720px){.hwaq-cookie--banner{padding:10px}.hwaq-cookie--banner .hwaq-cookie__panel{display:block}.hwaq-cookie--popup{left:10px!important;right:10px!important;bottom:10px!important;top:auto!important;width:auto;max-width:none}.hwaq-cookie__actions{justify-content:stretch;margin-top:16px}.hwaq-cookie__btn{width:100%}.hwaq-cookie__title{font-size:18px}}</style>');
            }

            function settingsHtml() {
                var html = '<div class="hwaq-cookie__settings" hidden>';
                $.each(categories||[], function (index, item) {
                    var key = item.key || ('category_' + index);
                    var title = item.title || key;
                    var description = item.description || '';
                    var required = !!(item.required || key === 'necessary');
                    html += '<div class="hwaq-cookie__item"><div><strong>' + escapeHtml(title) + '</strong><p>' + escapeHtml(description) + '</p></div><label class="hwaq-cookie__switch"><input type="checkbox" data-cookie-category="' + escapeAttr(key) + '"' + (required ? ' checked disabled' : ' checked') + '><span class="hwaq-cookie__slider"></span></label></div>';
                });
                return html + '</div>';
            }

            function getPreferences(mode) {
                var prefs = {};
                $.each(categories||[], function (index, item) {
                    var key = item.key || ('category_' + index);
                    var required = !!(item.required || key === 'necessary');
                    if (required) {
                        prefs[key] = true;
                    } else if (mode === 'accept') {
                        prefs[key] = true;
                    } else if (mode === 'reject') {
                        prefs[key] = false;
                    } else {
                        prefs[key] = !!$('#hwaq_cookie_privacy [data-cookie-category="' + key + '"]').prop('checked');
                    }
                });
                return prefs;
            }

            function saveConsent(action, prefs) {
                var payload = {
                    action: action,
                    preferences: prefs,
                    time: new Date().toISOString()
                };
                setSimpleStorage(opt.cookieName, JSON.stringify(payload), opt.expires);
                $(document).trigger('hwaqCookieConsent', [payload]);
                if (typeof opt.onChange === 'function') opt.onChange(payload);
                $("#hwaq_cookie_privacy").fadeOut(180, function () {
                    $(this).remove();
                });
            }

            $("#hwaq_cookie_privacy").remove();
            var html = '<div id="hwaq_cookie_privacy" class="hwaq-cookie hwaq-cookie--' + type + ' hwaq-cookie--' + position + '" role="dialog" aria-live="polite" aria-label="' + escapeAttr(opt.dialogLabel || opt.badge || '') + '"><div class="hwaq-cookie__panel"><div class="hwaq-cookie__copy"><span class="hwaq-cookie__badge">' + escapeHtml(opt.badge) + '</span><h3 class="hwaq-cookie__title">' + escapeHtml(opt.title) + '</h3><p class="hwaq-cookie__text">' + escapeHtml(opt.text) + '</p></div><div class="hwaq-cookie__actions"><button type="button" class="hwaq-cookie__btn hwaq-cookie__btn--ghost" data-cookie-action="customize">' + escapeHtml(opt.customizeText) + '</button><button type="button" class="hwaq-cookie__btn" data-cookie-action="reject">' + escapeHtml(opt.rejectText) + '</button><button type="button" class="hwaq-cookie__btn hwaq-cookie__btn--primary" data-cookie-action="accept">' + escapeHtml(opt.acceptText) + '</button><button type="button" class="hwaq-cookie__btn hwaq-cookie__btn--primary" data-cookie-action="save" hidden>' + escapeHtml(opt.saveText) + '</button></div>' + settingsHtml() + '</div></div>';
            $("body").append(html);

            var root = $("#hwaq_cookie_privacy");
            root.on('click', '[data-cookie-action="customize"]', function () {
                root.find('.hwaq-cookie__settings').removeAttr('hidden');
                root.find('[data-cookie-action="save"]').removeAttr('hidden');
                $(this).attr('hidden', true);
            });
            root.on('click', '[data-cookie-action="accept"]', function () {
                saveConsent('accept', getPreferences('accept'));
            });
            root.on('click', '[data-cookie-action="reject"]', function () {
                saveConsent('reject', getPreferences('reject'));
            });
            root.on('click', '[data-cookie-action="save"]', function () {
                saveConsent('custom', getPreferences('custom'));
            });

            return root;
        },
        CookiePrivacy:function CookiePrivacy(options) {
            return $.plugin.Cookie_Privacy(options);
        },
        CookieYes:function CookieYes(options) {
            return $.plugin.Cookie_Privacy(options);
        },
        sideBar:function sideBar($el, $qr, $top) {
            if (!$el || typeof $el !== 'object') {
                alert(getLangSection('common').sidebarObjectRequired);
                return false;
            }
            var liNew = '';
            $.each($el||[], function (value, html) {
                liNew += '<li><i class="iconfont ' + escapeAttr(value) + '"></i><div class="child">' + html + '</div></li>';
            });
            var qrNew = $qr ? '<li class="qr"><i class="iconfont iconfont-erweima1"></i><div class="child"><div id="sidebar_qr"></div></div></li>' : '';
            var topNew = $top ? '<li class="top"><i class="iconfont iconfont-top"></i></li>' : '';
            var htmlNew = '<div id="sidebar"><ul>' + liNew + qrNew + topNew + '</ul></div>';
            $('#sidebar').remove();
            $('body').append(htmlNew);
            if ($qr && window.QRCode && document.getElementById('sidebar_qr')) {
                new QRCode(document.getElementById('sidebar_qr'), {
                    text: window.href,
                    correctLevel: 3
                });
            }
            if ($top) {
                $('#sidebar .top').off('click.hwaqSidebar').on('click.hwaqSidebar', function () {
                    $('body,html').animate({ scrollTop: 0 }, 1000);
                });
            }
            return true;
        }
    });

    window.hwaqRefreshLang = function (lang) {
        return $.plugin.refreshLang(lang);
    };
    window.hwaqRefreshGlobals = function (overrides) {
        return $.plugin.refreshGlobals(overrides);
    };
    if (typeof window.refreshLang === 'undefined') window.refreshLang = window.hwaqRefreshLang;
    if (typeof window.refreshHwaq === 'undefined') window.refreshHwaq = window.hwaqRefreshGlobals;
    scheduleGlobalRefreshAfterLang(false);
    $(window).off('load.hwaqLangSync').on('load.hwaqLangSync', function () {
        runGlobalRefresh(null, 'globals');
    });
});
