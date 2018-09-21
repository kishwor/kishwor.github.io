setTimeout(function (one) {
    // only if not supported ...
    if (!one) {
        var
            slice = [].slice,
            // trap original versions
            Timeout = window.setTimeout,
            Interval = window.setInterval,
            // create a delegate
            delegate = function (callback, $arguments) {
                $arguments = slice.call($arguments, 2);
                return function () {
                    callback.apply(null, $arguments);
                };
            }
        ;
        // redefine original versions
        window.setTimeout = function (callback, delay) {
            return Timeout(delegate(callback, arguments), delay);
        };
        window.setInterval = function (callback, delay) {
            return Interval(delegate(callback, arguments), delay);
        };
    }
}, 0, 1);

if (!browser) {
    var browser = {};
    //Check for IE and its version
    browser.ie = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    browser.ieVersion = browser.ie ? new Number(RegExp.$1) : null;

    if (browser.ie == true) {
        document.documentElement.setAttribute('class', 'ie ie' + browser.ieVersion);
    } else if (!!navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.indexOf("rv:11.0") != -1) {
        document.documentElement.setAttribute('class', 'ie ie11');
    } else if (!!navigator.userAgent.match(/Edge/)) {
        document.documentElement.setAttribute('class', 'ie edge');
    }
}

if (document.images) {
  spinner=new Image(16,16);
  spinner.src='/images/spinner.gif';
}

function toggle_tab(id,page) {
    display=($('section'+id).style.display==''?0:1);
    $('section'+id).style.display=(display?'':'none');
    $('image'+id).src='/images/arrow_'+(display?'open':'shut')+'.php?page='+page+'&toggle='+id;
    $('header'+id).className=(display?'toggleon':'toggleoff');
}

function openwindow(theurl,windowname,features) {
    window.open(theurl,windowname,features);
}

function scrollAndScreen() {
    var scrollX,scrollY,width,height;
    if (self.pageYOffset) {
        scrollX=self.pageXOffset;
        scrollY=self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
        scrollX=document.documentElement.scrollLeft;
        scrollY=document.documentElement.scrollTop;
    } else if (document.body) {
        scrollX=document.body.scrollLeft;
        scrollY=document.body.scrollTop;
    }
    if (self.innerHeight) {
        width=self.innerWidth;
        height=self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        width=document.documentElement.clientWidth;
        height=document.documentElement.clientHeight;
    } else if (document.body) {
        width=document.body.clientWidth;
        height=document.body.clientHeight;
    }
    return new Array(scrollX,scrollY,width,height);
}

function open_iframe(src,settings) {
    height=(settings[0]?settings[0]:'550px');
    max_height=height;
    width=(settings[1]?settings[1]:'700px');
    num=(window.name=='innerframe1'?2:1);
    if (!top.$('outerdiv'+num)) {
        top.creatediv('outerdiv'+num);
        var o=top.$('outerdiv'+num);
        o.style.zIndex=101;
        o.style.background='#FFFFFF';
        o.style.border='1px solid #2c476a';
        innerHTML = '<table id="pop_title' + num + '" cellspacing="0" cellpadding="0" width="100%" class="popup_head">';
        innerHTML+='<tr>';
        innerHTML += '<td height="26" colspan="2"><span id="page_title' + num + '" style="position:absolute;top:6px;left:6px;font-weight:bold;-moz-user-select:none;' + (num == 1 ? 'cursor:move;' : '') + '"></span><img src="/images/close.png" alt="Close Window" style="position:absolute;top:6px;right:6px;cursor:pointer;" onclick="close_iframe(' + num + ');" onmouseover="this.src=\'/images/close_over.png\';" onmouseout="this.src=\'/images/close.png\';" /></td>';
        innerHTML+='</tr>';
        innerHTML+='</table>';
        innerHTML += '<iframe id="innerframe' + num + '" name="innerframe' + num + '" style="height:' + (height - 80) + 'px;width:100%;display:none;overflow-x:hidden;overflow-y:auto;" scrolling="yes" frameborder="0"  src="/cust_login.php"></iframe>';
        innerHTML += '<div id="loading' + num + '" style="height:' + (height - 80) + 'px;width:100%;"><center><img src="/images/spinner.gif" class="frame-spinner" border="0" style="margin-top:100px;" /> <span class="frame-phrase">Loading - please wait</span></center></div>';
        o.innerHTML=innerHTML;
        if (typeof(Draggable)=='function') { drag_window=new Draggable(o,{starteffect:'',endeffect:''}); }
    } else {
        var o=top.$('outerdiv'+num);
        top.$('innerframe'+num).style.height=(height-80)+'px';
        top.$('innerframe'+num).style.display='none';
        top.$('loading'+num).style.height=(height-80)+'px';
        if (typeof(Draggable)=='function' && document.all) { drag_window=new Draggable(o,{starteffect:'',endeffect:''}); }
    }
    top.$('pop_title'+num).onselectstart=function() { return false; }
    top.$('pop_title'+num).onmousedown=function() { return false; }
    o.style.height=height+'px';
    o.style.width=width+'px';
    top.$('loading'+num).style.display='';
    o.style.position='absolute';
    if (num==1) { top.show_overlay(60); } else { show_overlay(30); }
    position_iframe(num);
    o.style.display='';
    if(/^\/loggedin\/htmleditor\.php\?m=accounts&id=email_html/.test(src)) top.$('innerframe'+num).style.display='';
    (num==1?top.innerframe1.location.href=src:top.innerframe2.location.href=src);
    top.hide_flyout_menus();
    hideselects();
    Event.observe(window,'resize',function() { position_iframe(num); });
    Event.observe(window,'scroll',function() { position_iframe(num); });
}

function position_iframe(val) {
    vars=top.scrollAndScreen();
    if (height>vars[3] || height<max_height) {
        height=(vars[3]<=max_height?(vars[3]-40):max_height);
        top.$('outerdiv'+val).style.height=height+'px';
        top.$('innerframe'+val).style.height=(height-80)+'px';
    }
    top.center_item(top.$('outerdiv'+val),width,height);
    top.$('overlay').style.width = '100%';
    top.$('overlay').style.height = '100%';
}

function set_iframe_title(title) {
    if (top.$(window.name)) {
        if(top.$(window.name).style) {
            top.$(window.name).style.display='';
            top.$((window.name=='innerframe2'?'loading2':'loading1')).style.display='none';
        }

        top.$((window.name=='innerframe2'?'page_title2':'page_title1')).innerHTML=title;
    }
}

function close_iframe(num,effect) {
    num=(num?num:1);
    if (num==1) { top.$('overlay').hide(); } else { top.innerframe1.$('overlay').hide(); }
    if (typeof(Draggable)=='function' && typeof(drag_window)=='object' && document.all) { drag_window.destroy(); }
    top.$('outerdiv'+num).style.display='none';
    top.$('innerframe'+num).style.display='none';
    top.$('page_title'+num).innerHTML='';
    if (num==1) { top.show_flyout_menus(); top.showselects(); }
    if (num==1 && typeof(top.innerframe1.onclose)=='function') { top.innerframe1.onclose();    }
}

function help_popup_on(div,text) {
    var imgs=div.getElementsByTagName('img');
    for(i=0;i<imgs.length;i++) { imgs[i].src='/images/help_over.png'; }
    vars=scrollAndScreen();
    if (!document.getElementById('h')) { creatediv('h'); }
    var h=document.getElementById('h');
    var hs=h.style;
    hs.zIndex=101;
    hs.background='#FFFFFF';
    hs.border='1px solid #000000';
    hs.position='absolute';
    hs.width='350px';
    hs.padding='10px';
    h.innerHTML=text;
    hs.display='';
    divxpos=getAbsPos(div,'Left');
    xpos=((divxpos+350)>(vars[0]+vars[2])?divxpos-325:divxpos-50);
    if(xpos<0)xpos=0;
    divypos=getAbsPos(div,'Top');
    ypos=((divypos+h.offsetHeight+20)>(vars[1]+vars[3])?divypos-h.offsetHeight-5:divypos+20);
    hs.top=ypos+'px';
    hs.left=xpos+'px';
    hideselects();
}

function help_popup_off(div) {
    var imgs=div.getElementsByTagName('img');
    for(i=0;i<imgs.length;i++) { imgs[i].src='/images/help_out.png'; }
    document.getElementById('h').style.display='none';
    showselects();
}

function show_overlay(opacity) {
    vars=scrollAndScreen();
    if (!$('overlay')) { creatediv('overlay'); }
    var o=$('overlay');
    var os=o.style;
    os.zIndex=90;
    os.background='#000000';
    os.filter='alpha(opacity='+opacity+')';
    os.opacity=(opacity/100);
    os.position='absolute';
    os.top='0px';
    os.left='0px';
    os.width=document.body.scrollWidth+'px';
    os.height=(vars[3]>document.body.scrollHeight?vars[3]:document.body.scrollHeight)+'px';
    os.display='';
}

function show_spinner(text) {
    if (!$('spin')) { creatediv('spin'); }
    var s=$('spin');
    var ss=s.style;
    ss.zIndex=101;
    ss.background='#FFFFFF';
    ss.border='1px solid #000000';
    ss.position='absolute';
    ss.width='200px';
    ss.height='50px';
    ss.textAlign='center';
    s.innerHTML='<br /><img src="/images/spinner.gif" border="0" /> '+text;
    center_item(s,200,50);
    ss.display='';
}

function hide_spinner() {
    $('spin').style.display='none';
    $('overlay').style.display='none';
}

function center_item(item,width,height) {
    vars=scrollAndScreen();
    item.style.left=vars[0]+(vars[2]-width)/2+'px';
    item.style.top=vars[1]+(vars[3]-height)/2+'px';
}

var search_timeout;
var search_offset;
function submit_site_search(search_term) {
    search_offset=0;
    window.clearTimeout(search_timeout);
    $('search_suggestions_outer').style.left=($('search_term').offsetLeft+40)+'px';
    $('search_suggestions_outer').show();
    search_term=search_term.replace('%','').trim();
    if (search_term.length>2) {
        if (!$('search_suggestions').innerHTML || $('search_suggestions').innerHTML.length>300) {
            $('search_suggestions').innerHTML='<div style="background:#FFFFFF;border:1px solid #999999;padding:25px;padding-left:42px;"><img src="/images/spinner.gif" border="0" /> Searching for matches</div>';
        }
        search_timeout=setTimeout("site_search()",1000);
    } else {
        $('search_suggestions').innerHTML='';
    }
}

function site_search() {
    if (typeof(siteSearch)=='object') { siteSearch.transport.abort(); siteSearch=''; }
    siteSearch=new Ajax.Updater('search_suggestions','/loggedin/search.php?action=auto_suggest&csrf='+$('search_csrf').value+'&search='+$('search_term').value+'&type='+$('search_type').value+'&offset='+search_offset);
}

function search_page_change(offset) {
    search_offset=offset;
    $('search_page_change').show();
    $('main_search_results').style.filter='alpha(opacity=30)';
    $('main_search_results').style.opacity=0.3;
    site_search();
}

var retain_time_picker;
function show_time_picker(input_id,format) {
    if (!$('time')) { creatediv('time'); }
    var t=$('time');
    var ts=t.style;
    var html='<select id="time_drop" size="15" style="border:1px solid #999999;" onfocus="retain_time_picker=1;" onclick="$(\''+input_id+'\').value=this.value;close_time_picker();" onblur="close_time_picker();">';
    for (i=0;i<24;i++) {
        for (j=0;j<46;j+=15) {
            if (format=='H:i:s' || format=='H:i') {
                value=(i<10?'0':'')+i+':'+(j<10?'0':'')+j;
            } else {
                hour=(i>12?i-12:(i==0?12:i));
                am_pm=(i>11?'pm':'am');
                value=hour+':'+(j<10?'0':'')+j+' '+am_pm;
            }
            html+='<option value="'+value+'" '+(value==$(input_id).value?'selected="selected"':'')+'>'+value+'</option>';
        }
    }
    html+='</select>';
    t.innerHTML=html;
    ts.position='absolute';
    ts.left=getAbsPos($(input_id),'Left')+'px';
    ts.display='';
    vars=scrollAndScreen();
    var toppos=getAbsPos($(input_id),'Top');
    ts.top=((toppos+t.offsetHeight)>(vars[1]+vars[3])?toppos-t.offsetHeight:toppos+20)+'px';
}

function close_time_picker() {
    if ($('time').style.display!='none') {
        setTimeout(function(){$('time').style.display=(!retain_time_picker?'none':'');},20);
    }
    retain_time_picker=0;
}

function getAbsPos(elt,which) {
    iPos=0;
    while (elt!=null) { iPos+=elt['offset'+which]; elt=elt.offsetParent; }
    return iPos;
}

function deleteEl(el) {
    new Effect.Highlight(el,{startcolor:'#ff0000',endcolor:'#ffffff',afterFinish:function() { el.style.display='none'; Element.remove(el); }});
}

function sort(section,col,total,retain_direction,nobg) {
    var cols=new Array();
    var direction=(($(section+'_'+col).src.indexOf('asc')>0?'desc':'asc'));
    if (retain_direction) { direction=(direction=='asc'?'desc':'asc'); }
    for (var i=0;i<total;i++) {
        if (i!=col) { $(section+'_'+i).src='/images/sort.gif'; }
    }
    $(section+'_'+col).src='/images/sort'+direction+'.gif';
    var all_divs=$(section).getElementsByTagName('div');
    for (var i=0;i<all_divs.length;i++) {
        var all_cols=all_divs[i].getElementsByTagName('td');
        cols[i]={id:all_divs[i].id,value:(all_cols[col]?all_cols[col].innerHTML:'')}
    }
    cols.sort(direction=='desc'?sortDesc:sortAsc);
    for (var i=0;i<cols.length;i++) {
        el=Element.remove($(cols[i]).id);
        Element.insert($(section),el);
    }
    if (!nobg) { reorder_bgcolor('div',section,''); }
    if ($('save_'+section+'_sort')) { $('save_'+section+'_sort').value=col+direction; }
}

function sortAsc(a,b) {
    var x=a.value.toLowerCase();
    var y=b.value.toLowerCase();
    return ((x<y)?-1:((x>y)?1:0));
}

function sortDesc(a,b) {
    var x=a.value.toLowerCase();
    var y=b.value.toLowerCase();
    return ((x<y)?1:((x>y)?-1:0));
}

function reorder_bgcolor(element,my_section,ignore) {
    var bgcolor='#FFFFFF';
    var all_els=$(my_section).getElementsByTagName(element);
    for (var i=0;i<all_els.length;i++) {
        if (all_els[i].style.display!='none' && all_els[i]!=ignore) {
            bgcolor=(bgcolor=='#FFFFFF'?'#eeeeee':'#FFFFFF');
            all_els[i].style.background=bgcolor;
        }
    }
}

function creatediv(id) {
    var newdiv=document.createElement('div');
    newdiv.setAttribute('id', id);
    newdiv.style.display='none';
    document.body.appendChild(newdiv);
}

function hideselects() {
    if (typeof document.body.style.maxHeight=='undefined') {
        var elements=document.getElementsByTagName('select');
        for (i=0;i<elements.length;i++) { elements[i].style.visibility='hidden'; }
    }
}

function showselects(){
    if (typeof document.body.style.maxHeight=='undefined') {
        var elements=document.getElementsByTagName('select');
        for (i=0;i<elements.length;i++) { elements[i].style.visibility='visible'; }
    }
}

function setSelection(obj,s,e) {
obj.focus();
if (obj.setSelectionRange) {
obj.setSelectionRange(s,e);
} else if(obj.createTextRange) {
m = obj.createTextRange();
m.moveStart('character',s);
m.moveEnd('character',e);
m.select();
}
}

String.prototype.addslashes=function(){
    return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
}
String.prototype.trim=function () {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
}

// is a given input a number?
function isNumber(a) {
    return typeof a=='number' && isFinite(a);
}

/* Object Functions */

function replaceHTML(obj,text){
    while(el=obj.childNodes[0]) {
        obj.removeChild(el);
    };
    obj.appendChild(document.createTextNode(text));
}


var NS4 = (navigator.appName == "Netscape" && parseInt(navigator.appVersion) < 5);
function addOption(theSel,theText,theValue) {
var newOpt=new Option(theText,theValue);
var selLength=theSel.length;
theSel.options[selLength]=newOpt;
}
function deleteOption(theSel,theIndex) {
var selLength=theSel.length;
if(selLength>0) { theSel.options[theIndex]=null; }
}
function moveOptions(theSelFrom,theSelTo,hidden) {
var selLength = theSelFrom.length;
var selectedText = new Array();
var selectedValues = new Array();
var selectedCount = 0;
var i;
for(i=selLength-1;i>=0;i--) {
if(theSelFrom.options[i].selected) {
selectedText[selectedCount] = theSelFrom.options[i].text;
selectedValues[selectedCount] = theSelFrom.options[i].value;
deleteOption(theSelFrom,i);
selectedCount++;
}
}
for(i=selectedCount-1; i>=0; i--) {
addOption(theSelTo, selectedText[i], selectedValues[i]);
}
if(NS4) history.go(0);
}

function selectall(id) {
    if ($(id)) {
        for(var i=0;i<$(id).length;i++) {
            $(id).options[i].selected=true;
        }
    }
}

function number_format(a,b,c,d) {
a=Math.round(a*Math.pow(10, b))/Math.pow(10,b);
e=a+'';
f=e.split('.');
if(!f[0]) { f[0]='0'; }
if(!f[1]) { f[1]=''; }
if(f[1].length<b) {
g=f[1];
for(i=f[1].length+1;i<=b;i++) { g+='0'; }
f[1]=g;
}
if (d!='' && f[0].length>3) {
h=f[0];
f[0]='';
for (j=3;j<h.length;j+=3) {
i=h.slice(h.length-j,h.length-j+3);
f[0]=d+i+f[0]+'';
}
j=h.substr(0,(h.length%3==0) ? 3 : (h.length % 3));
f[0]=j+f[0];
}
c=(b <= 0) ? '': c;
return f[0] + c + f[1];
}

function loadselectdescription(id) {
if (id.options[id.selectedIndex].title) {
document.getElementById('selectdescription').style.top=getAbsPos(id,'Top');
document.getElementById('selectdescription').style.left=getAbsPos(id,'Left')+id.offsetWidth;
document.getElementById('selectdescription').innerHTML=id.options[id.selectedIndex].title+"<p align=center><a href='javascript:closeselectdescription();'>Close</a></p>";
document.getElementById('selectdescription').style.display='';
} else {
closeselectdescription();
}
}

function closeselectdescription() {
if (document.getElementById('selectdescription').style.display=='') { document.getElementById('selectdescription').style.display='none'; }
}

function gettopposition(id) {
if(navigator.appName=="Microsoft Internet Explorer") { positiontop=(document.body.offsetHeight-document.getElementById(id).clientHeight)/2+document.body.scrollTop; } else { toppos=window.innerHeight-document.getElementById(id).clientHeight; positiontop=(toppos/2); positiontop+=window.pageYOffset; }
return positiontop;
}

var intFPS=80;
var fltTransitionTimeInSeconds=0.3;
var intBaseCloseHeight=17;
var intTargetOpenHeight=151;
var intBaseCloseWidth=165;
var intTargetOpenWidth=165;
var fltTransitionValue=0
var intTransitionDirection=0;
var objCurrentItem=null;

function OpenContainer(objMover)
{
    intTransitionDirection = 1;
    objCurrentItem = objMover;
}

function CloseContainer()
{
    intTransitionDirection = -1;
}

function RunTransition()
{
    fltTransitionValue = fltTransitionValue + (intTransitionDirection / (fltTransitionTimeInSeconds * intFPS));
    if (fltTransitionValue < 0)
    {
        fltTransitionValue = 0;
        intTransitionDirection = 0;
    }
    if (fltTransitionValue > 1)
    {
        fltTransitionValue = 1;
        intTransitionDirection = 0;
    }

    if (objCurrentItem != null)
    {
        var DivContainer=eval(document.getElementById("headbasket"));

        var DivInnerContainer=eval(document.getElementById("innerbasket"));
        DivInnerContainer.style.height=intBaseCloseHeight+(intTargetOpenHeight*(1-((Math.cos(fltTransitionValue * Math.PI) + 1)/2)))+'px';

        if (fltTransitionValue!=1) {
            DivInnerContainer.style.overflow='hidden';
        }
    }
}

function capitalizeit(subject) {
tmp=eval(subject).value;
len=tmp.length;
if (len>0) {
val=eval(subject).value;
val1=val.charAt(0);
val2=val.substr(1,len-1);
CapVal=val1.toUpperCase()+val2;
eval(subject).value=CapVal;
}
}

sfHover=function() {
if (document.getElementById("headermenulinks")) {
var sfEls=document.getElementById("headermenulinks").getElementsByTagName("LI");
for (var i=0;i<sfEls.length;i++) {
sfEls[i].onmouseover=function() { this.className+=" sfhover"; }
sfEls[i].onmouseout=function() { this.className=this.className.replace(new RegExp(" sfhover\\b"), ""); }
}
}
if ($("submenulinks")) {
    var sfEls = $("submenulinks LI");
    for (var i=0;i<sfEls.length;i++) {
        sfEls[i].onmouseover=function() { this.className+=" sfhover"; }
        sfEls[i].onmouseout=function() { this.className=this.className.replace(new RegExp(" sfhover\\b"), ""); }
    }
}
if (document.getElementById("dashboardlinks")) {
var sfEls=document.getElementById("dashboardlinks").getElementsByTagName("LI");
for (var i=0;i<sfEls.length;i++) {
sfEls[i].onmouseover=function() { this.className+=" sfhover"; }
sfEls[i].onmouseout=function() { this.className=this.className.replace(new RegExp(" sfhover\\b"), ""); }
}
}
if (document.getElementById("leftnavlinks")) {
var sfEls=document.getElementById("leftnavlinks").getElementsByTagName("LI");
for (var i=0;i<sfEls.length;i++) {
sfEls[i].onmouseover=function() { this.className+=" sfhover"; }
sfEls[i].onmouseout=function() { this.className=this.className.replace(new RegExp(" sfhover\\b"), ""); }
}
}
if (document.getElementById("eventquicklinks")) {
var sfEls=document.getElementById("eventquicklinks").getElementsByTagName("LI");
for (var i=0;i<sfEls.length;i++) {
sfEls[i].onmouseover=function() { this.className+=" sfhover"; }
sfEls[i].onmouseout=function() { this.className=this.className.replace(new RegExp(" sfhover\\b"), ""); }
}
}
if (document.getElementById("moduleeditlinks")) {
var sfEls=document.getElementById("moduleeditlinks").getElementsByTagName("LI");
for (var i=0;i<sfEls.length;i++) {
sfEls[i].onmouseover=function() { this.className+=" sfhover"; }
sfEls[i].onmouseout=function() { this.className=this.className.replace(new RegExp(" sfhover\\b"), ""); }
}
}
}
if (window.attachEvent) { window.attachEvent("onload", sfHover); }

function isMouseLeaveOrEnter(e,handler) {
    if (e.type!='mouseout' && e.type!='mouseover') { return false; }
    var reltg=(e.relatedTarget?e.relatedTarget:(e.type=='mouseout'?e.toElement:e.fromElement));
    while (reltg && reltg!=handler) { reltg=reltg.parentNode; }
    return (reltg!=handler);
}

function hide_flyout_menus() {
    if (document.all) {
        if ($('leftnavlinks')) { $('leftnavlinks').style.display='none'; }
        if ($('eventquicklinks')) { $('eventquicklinks').style.display='none'; }
    }
}

function show_flyout_menus() {
    if (document.all) {
        if ($('leftnavlinks')) { $('leftnavlinks').style.display=''; }
        if ($('eventquicklinks')) { $('eventquicklinks').style.display=''; }
    }
}

function ajaxWrapper(url,params,successFunc) {
    new Ajax.Request(url,{parameters:params,onFailure:function(){ ajaxWrapper(url,params,successFunc); },onSuccess:successFunc});
}

function callInProgress(t) {
    switch (t.readyState) {
    case 1: case 2: case 3:
    return true;
    break;
    default:
    return false;
    break;
    }
}

function retrieve_from_xml(xml,val) {
    starttag='<'+val+'>';
    startpos=(xml.indexOf(starttag))+starttag.length;
    endpos=xml.indexOf('</'+val+'>');
    return xml.substring(startpos,endpos);
}

function in_array(needle,haystack,strict) {
    hsl=haystack.length;
    for (i=0;i<hsl;i++) {
        if(strict) {
            if (haystack[i]===needle) { return true; }
        } else {
            if (haystack[i]==needle) { return true; }
        }
    }
    return false;
}

function validate_email(email) {
    email=email.replace("'",'');
    var reg=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return reg.test(email);
}

function validate_domain(domain) {
    return /^([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/.test(domain);
}

function attendeepopup(item,eventid,attendeeid) {
    vars=scrollAndScreen();
    if (!$('attendeepopup')) {
        creatediv('attendeepopup');
        $('attendeepopup').setStyle({zIndex:101,width:'500px',border:'1px solid #000000',position:'absolute',background:'#FFFFFF',textAlign:'center'});
    }
    var a=$('attendeepopup');
    var itemxpos=getAbsPos(item,'Left')-($('report_scroll')?$('report_scroll').scrollLeft:'');
    var itemypos=getAbsPos(item,'Top')-($('report_scroll')?$('report_scroll').scrollTop:'');
    a.setStyle({top:(itemypos+20)+'px',left:(itemxpos-10)+'px'});
    Element.update(a,'<br /><img src="/images/spinner.gif" /> Loading<br /><br />');
    a.show();
    popup=new Ajax.Request('/loggedin/eReg/manage/attendeepopup.php',{parameters:'eventid='+eventid+'&attendees='+attendeeid,onSuccess:function(t) { Element.update(a,t.responseText); xpos=((itemxpos+500)>(vars[0]+vars[2])?itemxpos-475:itemxpos-10); ypos=((itemypos+a.offsetHeight+20)>(vars[1]+vars[3])?itemypos-a.offsetHeight-30:itemypos+20); a.setStyle({top:ypos+'px',left:xpos+'px'}); popup=''; }});
}

function closeattendeepopup() {
    if (typeof(popup)=='object') { popup.transport.abort(); }
    $('attendeepopup').hide();
}

function discountpopup(item,eventid,feeid) {
    vars=scrollAndScreen();
    if (!$('discountpopup')) {
        creatediv('discountpopup');
        $('discountpopup').setStyle({zIndex:101,width:'200px',border:'1px solid #000000',position:'absolute',background:'#FFFFFF',textAlign:'center'});
    }
    var a=$('discountpopup');
    var itemxpos=getAbsPos(item,'Left')-($('report_scroll')?$('report_scroll').scrollLeft:'');
    var itemypos=getAbsPos(item,'Top')-($('report_scroll')?$('report_scroll').scrollTop:'');
    a.setStyle({top:(itemypos+20)+'px',left:(itemxpos-10)+'px'});
    Element.update(a,'<br /><img src="/images/spinner.gif" /> Loading<br /><br />');
    a.show();
    popup=new Ajax.Request('/loggedin/eReg/discountcodespopup.php',{parameters:'eventid='+eventid+'&feeid='+feeid,onSuccess:function(t) { Element.update(a,t.responseText); xpos=((itemxpos)>(vars[0]+vars[2])?itemxpos-475:itemxpos-10); ypos=((itemypos+a.offsetHeight+20)>(vars[1]+vars[3])?itemypos-a.offsetHeight-30:itemypos+20); a.setStyle({top:ypos+'px',left:xpos+'px'}); popup=''; }});
}

function closediscountpopup() {
    if (typeof(popup)=='object') { popup.transport.abort(); }
    $('discountpopup').hide();
}

function pickcolor(id) {
    var buttonHeight = 37;
    if (typeof(currentid)=='string') {
        $(currentid).style.margin='1px';
        $(currentid).style.border='1px solid #000';
    }
    if (typeof(cp1)=='object') {
        $(id).style.margin='0px';
        $(id).style.border='2px solid red';
        vars=scrollAndScreen();
        imageypos=getAbsPos($(id),'Top');
        imagexpos=getAbsPos($(id),'Left');
        $('colorpicker').show();
        xpos=((imagexpos+450)>(vars[2]+vars[0])?imagexpos-400:imagexpos);
        ypos=((imageypos+$('colorpicker').offsetHeight+buttonHeight*2)>(vars[3]+vars[1])?imageypos-$('colorpicker').offsetHeight:(imageypos+20));
        if (ypos<0) { ypos=imageypos-buttonHeight*2; }
        $('colorpicker').style.top=ypos+'px';
        $('colorpicker').style.left=xpos+'px';
        var startval=$(id+'field').value.replace('#','');
        $('cp1_Hex').value=startval;
        cp1._cvp=new Refresh.Web.ColorValuePicker('cp1');
        cp1._cvp.color.setHex(startval);
        cp1.positionMapAndSliderArrows();
        cp1.updateVisuals();
        $('mappoint').show();
        $('rangearrows').show();
        hideselects();
        currentid=id;
    }
}

function setcolor(color) {
    $(currentid).style.margin='1px';
    $(currentid).style.border='1px solid #000';
    $('colorpicker').hide();
    $('mappoint').hide();
    $('rangearrows').hide();
    if (color) {
        $(currentid).style.background=color;
        $(currentid+'field').value=color;
        if (typeof(refresh_preview)=='function') { refresh_preview(currentid,color); }
    }
    showselects();
}

function load_support() {
    window.open("/zendesk_sso.php");
}
