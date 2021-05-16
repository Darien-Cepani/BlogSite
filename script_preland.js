/*
 ;(function(globalObj) {

 })(window);
 */

 function getUrlQueryString(){
    var query = window.location.search;

    if( query ){
        var index_str = query.indexOf('?');

        if( index_str == -1 ){
            return false;
        }else{
            return window.location.search.slice(index_str + 1);
        }
    }else{
        return false;
    }
}

function getUrlParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getAlUserData(name) {
    try{
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }catch(err){
        return undefined;
    }
}

function setAlUserData(name, value, options) {
    try{
        options = options || {};

        var expires = options.expires;

        var d = new Date();

        if (typeof expires == "number" && expires) {
            d.setTime(d.getTime() + expires*1000);
            expires = options.expires = d;
        }else{
            d.setTime(d.getTime() + 2592000*1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for(var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }catch(err){
        //console.log(err)
    }
}

function getSystemParams(){
    function getApp() {
        try {
            return navigator.appCodeName;
        } catch (err) {
            return null;
        }
    }

    function getAppName() {
        try {
            return navigator.appName;
        } catch (err) {
            return null;
        }
    }

    function getAppVersion() {
        try {
            return navigator.appVersion;
        } catch (err) {
            return null;
        }
    }

    function getAppPlatform() {
        try {
            return navigator.platform;
        } catch (err) {
            return null;
        }
    }

    function getJavaEnabled(){
        try {
            return navigator.javaEnabled();
        } catch (err) {
            return null;
        }
    }

    function getCookieEnabled(){
        try {
            return navigator.cookieEnabled;
        } catch (err) {
            return null;
        }
    }

    function getLanguage() {
        try {
            return (navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0,2).toLowerCase();
        } catch (err) {
            return null;
        }
    }

    function versionMinor() {
        try {
            var appVers = navigator.appVersion;

            var pos, versMinor = 0;

            if ((pos = appVers.indexOf ("MSIE")) > -1) {
                versMinor = parseFloat(appVers.substr (pos+5));
            } else {
                versMinor = parseFloat(appVers);
            }

            return (versMinor);
        } catch (err) {
            return null;
        }
    }

    function versionMajor() {
        try {
            return parseInt(navigator.appVersion,10)
        } catch (err) {
            return null;
        }
    }

    function screenWidth() {
        try {
            if (window.screen) {
                return(screen.width);
            } else {
                return(0);
            }
        } catch (err) {
            return null;
        }
    }

    function screenHeight() {
        try {
            if (window.screen) {
                return(screen.height);
            } else {
                return(0);
            }
        } catch (err) {
            return null;
        }
    }

    function getTzOffset(){
        try {
            var offset = new Date().getTimezoneOffset();
            return (-1)*(offset*60);
        } catch (err) {
            return null;
        }
    }

    return {
        'app': getApp(),
        'app_name': getAppName(),
        'app_version': getAppVersion(),
        'language': getLanguage(),
        'platform': getAppPlatform(),
        'java_enabled': getJavaEnabled(),
        'cookie_enabled': getCookieEnabled(),
        'browser_ver_minor': versionMajor(),
        'browser_ver_major': versionMinor(),
        's_width': screenWidth(),
        's_height': screenHeight(),
        'tz_offset': getTzOffset()
    }
}

function alInitUserData(){
    var qs = getUrlQueryString();

    if( qs ){
        var hashes = qs.split('&');

        if( hashes.length > 0 ){
            for(var i = 0; i < hashes.length; i++){
                var hash = hashes[i].split('=');
                setAlUserData(hash[0], hash[1]);
            }
        }
    }

    setAlUserData('_allocation', window.location.href);

    setAlUserData('_alreferer', document.referrer);

    if( getAlUserData('_alquery') == undefined && qs ){
        setAlUserData('_alquery', qs);
    }

    if( getAlUserData('_alstart') == undefined ){
        setAlUserData('_alstart', parseInt(Date.now()/1000));
    }

    setAlUserData('_alsystems', JSON.stringify(getSystemParams()));
}

function encodeQueryData(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
}

function bindReady(handler){

    var called = false

    function ready() {
        if (called) return
        called = true
        handler()
    }

    if ( document.addEventListener ) {
        document.addEventListener( "DOMContentLoaded", function(){
            ready()
        }, false )
    } else if ( document.attachEvent ) {
        if ( document.documentElement.doScroll && window == window.top ) {
            function tryScroll(){
                if (called) return
                if (!document.body) return
                try {
                    document.documentElement.doScroll("left")
                    ready()
                } catch(e) {
                    setTimeout(tryScroll, 0)
                }
            }
            tryScroll()
        }

        document.attachEvent("onreadystatechange", function(){

            if ( document.readyState === "complete" ) {
                ready()
            }
        })
    }

    if (window.addEventListener)
        window.addEventListener('load', ready, false)
    else if (window.attachEvent)
        window.attachEvent('onload', ready)
}

function runLandScriptsParams(land_params) {
    setAlUserData('_alid', land_params['_alid']);

    alStatPixel();

    window.addEventListener('load', function() {

        var fb_pixel_land = getUrlParameterByName('fb_pixel_land');
        var fb_pixel_lead = getUrlParameterByName('fb_pixel_lead');

        var landing_url = land_params['landing_url'];

        if( fb_pixel_land !== null ){
            landing_url = landing_url + '&fb_pixel_land=' + fb_pixel_land;
        }

        if( fb_pixel_lead !== null ){
            landing_url = landing_url + '&fb_pixel_lead=' + fb_pixel_lead;
        }

        for ( var i=0; i < document.links.length; i++ ){
            document.links[i].setAttribute('href', landing_url);
        }

        var fb_pixel_pre_land = getUrlParameterByName('fb_pixel_pre_land');

        if( fb_pixel_pre_land === null && "fb_pixel" in land_params ){
            fb_pixel_pre_land = land_params['fb_pixel'];
        }

        if( fb_pixel_pre_land !== null ){
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','//connect.facebook.net/en_US/fbevents.js');

            var fb_pixels = fb_pixel_pre_land.split('|');

            for(var i in fb_pixels){
                fbq('init', fb_pixels[i]);
                fbq('track', 'PageView');
            }
        }

        if ( "iframe_url" in land_params ){
            var iframe = document.createElement('IFRAME');
            iframe.setAttribute('src', land_params['iframe_url']);
            iframe.style.display = 'none !important';
            iframe.setAttribute('height', '1');
            iframe.setAttribute('width', '1');
            iframe.setAttribute('border', '0');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('seamless', 'seamless');
            document.body.appendChild(iframe);
        }

        if ("script_pre_langing" in land_params && land_params["script_pre_langing"]){
            var _scr = document.createElement("script");
            _scr.type ="text/javascript";
            _scr.src = "/land/script?mode=preland&alstream="+land_params["script_pre_langing"];
            var s = document.getElementsByTagName("head")[0];
            s.appendChild(_scr);
        }
    });
}

function alStatPixel() {
    //stat pixel
    var pixel_data = getSystemParams();

    var _allocation = getAlUserData('_allocation');
    if( _allocation ){
        pixel_data['_allocation'] = _allocation;
    }else{
        pixel_data['_allocation'] = window.location.href;
    }

    var alstream = getAlUserData('alstream');
    if( alstream ){
        pixel_data['alstream'] = alstream;
    }else{
        alstream = getUrlParameterByName('alstream');

        if( alstream !== null ){
            pixel_data['alstream'] = alstream;
        }
    }

    var _u_alid = getAlUserData('_alid');
    if( _u_alid ){
        pixel_data['_alid'] = _u_alid;
    }

    var alunique = getAlUserData('alunique');
    if( alunique == undefined ){
        setAlUserData('alunique', 1, {'expires' : 86400});
        pixel_data['alunique'] = 1;
    }else{
        pixel_data['alunique'] = 0;
    }

    var _alstart = getAlUserData('_alstart');
    if( _alstart ){
        pixel_data['_alstart'] = _alstart;
    }

    var alclick = getAlUserData('alclick');
    if( alclick ){
        pixel_data['alclick'] = alclick;
    }else{
        alclick = getUrlParameterByName('alclick');

        if( alclick !== null ){
            pixel_data['alclick'] = alclick;
        }
    }

    var _alreferer = getAlUserData('_alreferer');
    if( _alreferer ){
        pixel_data['_alreferer'] = _alreferer;
    }else{
        pixel_data['_alreferer'] = document.referrer;
    }

    var sub_id = getAlUserData('sub_id');
    if( sub_id ){
        pixel_data['sub_id'] = sub_id;
    }else{
        sub_id = getUrlParameterByName('sub_id');

        if( sub_id !== null ){
            pixel_data['sub_id'] = sub_id;
        }
    }

    var sub_id_1 = getAlUserData('sub_id_1');
    if( sub_id_1 ){
        pixel_data['sub_id_1'] = sub_id_1;
    }else{
        sub_id_1 = getUrlParameterByName('sub_id_1');

        if( sub_id_1 !== null ){
            pixel_data['sub_id_1'] = sub_id_1;
        }
    }

    var sub_id_2 = getAlUserData('sub_id_2');
    if( sub_id_2 ){
        pixel_data['sub_id_2'] = sub_id_2;
    }else{
        sub_id_2 = getUrlParameterByName('sub_id_2');

        if( sub_id_2 !== null ){
            pixel_data['sub_id_2'] = sub_id_2;
        }
    }

    var sub_id_3 = getAlUserData('sub_id_3');
    if( sub_id_3 ){
        pixel_data['sub_id_3'] = sub_id_3;
    }else{
        sub_id_3 = getUrlParameterByName('sub_id_3');

        if( sub_id_3 !== null ){
            pixel_data['sub_id_3'] = sub_id_3;
        }
    }

    var sub_id_4 = getAlUserData('sub_id_4');
    if( sub_id_4 ){
        pixel_data['sub_id_4'] = sub_id_4;
    }else{
        sub_id_4 = getUrlParameterByName('sub_id_4');

        if( sub_id_4 !== null ){
            pixel_data['sub_id_4'] = sub_id_4;
        }
    }

    var utm_source = getAlUserData('utm_source');
    if( utm_source ){
        pixel_data['utm_source'] = utm_source;
    }else{
        utm_source = getUrlParameterByName('utm_source');

        if( utm_source !== null ){
            pixel_data['utm_source'] = utm_source;
        }
    }

    var utm_medium = getAlUserData('utm_medium');
    if( utm_medium ){
        pixel_data['utm_medium'] = utm_medium;
    }else{
        utm_medium = getUrlParameterByName('utm_medium');

        if( utm_medium !== null ){
            pixel_data['utm_medium'] = utm_medium;
        }
    }

    var utm_campaign = getAlUserData('utm_campaign');
    if( utm_campaign ){
        pixel_data['utm_campaign'] = utm_campaign;
    }else{
        utm_campaign = getUrlParameterByName('utm_campaign');

        if( utm_campaign !== null ){
            pixel_data['utm_campaign'] = utm_campaign;
        }
    }

    var utm_term = getAlUserData('utm_term');
    if( utm_term ){
        pixel_data['utm_term'] = utm_term;
    }else{
        utm_term = getUrlParameterByName('utm_term');

        if( utm_term !== null ){
            pixel_data['utm_term'] = utm_term;
        }
    }

    var utm_content = getAlUserData('utm_content');
    if( utm_content ){
        pixel_data['utm_content'] = utm_content;
    }else{
        utm_content = getUrlParameterByName('utm_content');

        if( utm_content !== null ){
            pixel_data['utm_content'] = utm_content;
        }
    }

    pixel_data['rand'] = parseInt(Math.random() * 100000);

    //(window.Image ? (new Image()) : document.createElement('img')).src = 'http://terra-stat.com/land/collect/?'+encodeQueryData(pixel_data);
    (window.Image ? (new Image()) : document.createElement('img')).src = '/land/collect/?'+encodeQueryData(pixel_data);
}

function alGetData() {
    var lang =(navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0,2).toLowerCase();
    var data = {
        'lang': lang
    };

    var _allocation = getAlUserData('_allocation');
    if( _allocation ){
        data['location'] = _allocation;
    }

    var alstream = getAlUserData('alstream');
    if( alstream ){
        data['alstream'] = alstream;
    }

    data['rand'] = parseInt(Math.random() * 100000);

    var _scr = document.createElement("script");
    _scr.type ="text/javascript";
    //_scr.src = "http://terra-stat.com/land/params/?"+encodeQueryData(data);
    _scr.src = "/land/params/?"+encodeQueryData(data);
    //_scr.async = true;
    var s = document.getElementsByTagName("head")[0];
    //s.parentNode.insertBefore(_scr, s.nextSibling);
    s.appendChild(_scr);
}

try{
    /*
     window.addEventListener('error', function (errorEvent) {
     var data = {
     'error' : errorEvent.error,
     'message' : errorEvent.message,
     'filename' : errorEvent.filename,
     'lineno' : errorEvent.lineno,
     'colno' : errorEvent.colno
     };

     //(window.Image ? (new Image()) : document.createElement('img')).src = 'http://terra-stat.com/land/errors/?'+encodeQueryData(data);
     (window.Image ? (new Image()) : document.createElement('img')).src = '/land/errors/?'+encodeQueryData(data);
     });
     */

    //Init user data
    alInitUserData();
    alGetData();
}catch(e){
    /*
     var data = {
     'name': e.name,
     'message': e.message,
     'stack': e.stack
     };

     //(window.Image ? (new Image()) : document.createElement('img')).src = 'http://terra-stat.com/land/errors/?'+encodeQueryData(data);
     (window.Image ? (new Image()) : document.createElement('img')).src = '/land/errors/?'+encodeQueryData(data);
     */
}