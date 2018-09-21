var cycledividend = .2;

function initTypewriter(sourceId, newSpeed, typeWindow) {
typeWindow.innerHTML = '';
message=document.getElementById(sourceId).innerHTML;
msgLength=message.length+1;
count=0;
typing=setInterval(function () { typeText(typeWindow, message);}, newSpeed);
}

function typeText(typeWindow, message) {
var cursorHTML='<span class="cursorChar">@</span>';
typeWindow = document.getElementById(typeWindow);
    
    if (count == msgLength)
    {
        clearInterval(typing);
        return;
    }
    else if (count == 0)
        typedPortion = '';
    else
        typedPortion = message.substring(0, count);
        cursorChar = message.charAt(count);
    if (/</.test(cursorChar))
    {
        var tag = message.substring(count).match(/<\/?[^>]+>/);
        if (tag)
        {
            typedPortion += tag[0];
            count += tag[0].length;
        }
    }
    else
    {
        workHTML = '';
        workHTML += typedPortion;
        if (count != msgLength - 1)
            workHTML += cursorHTML.replace(/@/, cursorChar);
        typeWindow.innerHTML = workHTML;
        count++;
    }
}

function opacity(id, opacStart, opacEnd, millisec) {
    //speed for each frame
    var speed = Math.round(millisec / 100);
    var timer = 0;

    //determine the direction for the blending, if start and end are the same nothing happens
    if(opacStart > opacEnd) {
        for(i = opacStart; i >= opacEnd; i--) {
            setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed));
            timer++;
        }
    } else if(opacStart < opacEnd) {
        for(i = opacStart; i <= opacEnd; i++)
            {
            setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed));
            timer++;
        }
    }
}

//change the opacity for different browsers
function changeOpac(opacity, id) {
    var object = document.getElementById(id).style;
    object.opacity = (opacity / 100);
    object.MozOpacity = (opacity / 100);
    object.KhtmlOpacity = (opacity / 100);
    object.filter = "alpha(opacity=" + opacity + ")";
} 

function cycleText (htmlarray, DivId, transition, ivalue) {
    var i = 0;
    var htmltemp;
    cycleTextInner();
    
    function cycleTextInner () {
        //declare content by id of object
        var content = document.getElementById(DivId);
        //begin, load/fade in item
        if (ivalue > 1 || typeof ivalue == 'undefined') //if at end of item timer sequence
        {
            ivalue = 0;//start again
        }
        if (ivalue == 1)
        {
            //appear(content, 1); //disappear (supposedly)
            opacity(DivId,100,0,800);
        }
        if (ivalue == 0) //if at start
        {
            content.innerHTML = htmlarray[i]; //load next item from array
            //DivId.innerHTML = "test";
            //appear(content, 0);
            if (transition == 2) {
                opacity(DivId,0,100,0);
                initTypewriter(DivId, 30, DivId);
            } else {
                opacity(DivId,0,100,800);
            }
            
            if (i == (htmlarray.length-1))
            {
                i=0;
            }
            else
            {
                i++;
            }
        }
        ivalue = ivalue + cycledividend;
        if (transition == 2) {
            setTimeout(function () {cycleTextInner()} , cycledelay+((cycledelay/4)*2));
        } else {
            setTimeout(function () {cycleTextInner()} , cycledelay);
        }
    }
    
}

function setup_overlay(name,width,height) {
    vars=scrollAndScreen();
    var adjwidth=parseInt(width>(vars[2]-75)?vars[2]-75:width);
    var adjheight=parseInt(height>(vars[3]-75)?vars[3]-75:height);
    var overlay=document.querySelector('#overlay');
    var home_od=document.querySelector('#home_od');
    var home_id=document.querySelector('#home_id');
    var title=document.querySelector('#title');
    overlay.style.height=(document.body.scrollHeight>vars[3]?document.body.scrollHeight:vars[3])+'px';
    overlay.style.display='';
    home_od.style.width=adjwidth+'px';
    home_od.style.height=(adjheight+25)+'px';
    home_od.style.left=vars[0]+(vars[2]-adjwidth)/2+'px';
    home_od.style.top=vars[1]+(vars[3]-(adjheight+25))/2+'px';
    home_od.style.display='';
    home_id.style.overflowX=(adjwidth<width?'scroll':'hidden');
    home_id.style.overflowY=(adjheight<height?'scroll':'hidden');
    home_id.style.width=adjwidth+'px';
    home_id.style.height=adjheight+'px';
    title.innerHTML=name;
}

function load_image(src,name,width,height, prev, next) {
    setup_overlay(name,width,height);
    if (prev > 0 || next > 0){
        set_next(prev, next);
    }
    document.querySelector('#image').src= src+'';
}

function set_next(prev, next) {
    document.querySelector('#title2').innerHTML= "<a href='#' onclick='showImage("+prev+")'>Previous</a> - <a href='#' onclick='showImage("+next+")'>Next</a>";;
}

function load_url(src,name,width,height) {
    var url=document.querySelector('#url');
    setup_overlay(name,width,height);
    document.querySelector('#image').style.display='none';
    url.style.display='';
    url.style.width=width+'px';
    url.style.height=height+'px';
    window.url.location.href=src;
}

function iframeLoaded(id) {
    var iFrame = document.getElementById(id);
    if(iFrame) {
        var bodyHeight = iFrame.contentWindow.document.body.scrollHeight
        iFrame.style.height = bodyHeight + "px";
        $('home_id').style.overflowY=($('home_id').getHeight()<bodyHeight?'scroll':'hidden');
    }
}

function close_overlay() {
    document.querySelector('#overlay').style.display='none';
    document.querySelector('#home_od').style.display='none';
    document.querySelector('#title').innerHTML='';
    document.querySelector('#url').style.display='none';
    document.querySelector('#image').style.display='';
    document.querySelector('#image').src='/images/spinner.gif';
    window.url.location.href='about:blank';
}

