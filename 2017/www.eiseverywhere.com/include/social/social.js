// Stops the object being loaded more than once
if(typeof social == 'undefined'){
    var social = {
        request : undefined,
        cookies : [],
        connect : [],
        connected : [],
        load : function(){
            // Facebook settings...
            this.cookies['facebook'] = 'fb_token_138218415785';
            this.connect['facebook'] = new Template('https://www.facebook.com/dialog/oauth?client_id=138218415785&redirect_uri=#{redirect}&scope=#{permissions}&display=popup');
            
            // LinkedIn settings...
            this.cookies['linkedin'] = 'li_token_etouches';
            this.connect['linkedin'] = new Template('https://www.linkedin.com/uas/oauth/authorize?oauth_token=#{token}');
            
            $$('.social .share').invoke('observe', 'click', function(e){
                var elem = e.element();
                social.share(elem.readAttribute('class').replace(/share\s+/gi, ''));
                e.stop();
            });
            $$('.social .connect').invoke('observe', 'click', function(e){
                var elem = e.element().up('a');
                social.connect(elem.readAttribute('class').replace(/connect\s+/gi, ''), elem.readAttribute('href'), elem.readAttribute('rel'));
                e.stop();
            });
        },
        share : function(site){
            var link = $F('share_link') || '';
            var name = $F('share_name') || '';
            
            if(link.length > 0 && name.length > 0){
                switch(site){
                    case 'facebook':
                        openwindow('http://www.facebook.com/sharer.php?u=' + link + 'fb', '', 'height=400,width=550');
                        break;
                    case 'linkedin':
                        openwindow('http://www.linkedin.com/shareArticle?mini=true&url=' + link + 'li&li_like&title=' + name, '', 'height=400,width=550');
                        break;
                    case 'twitter':
                        openwindow('http://twitter.com/share?url=' + link + 'tw&tw_like&text=' + $F('twittermessage') + ($F('twitteraccount').length > 0 ? '&via=' + $F('twitteraccount') : '') + '&count=none', '', 'height=400,width=550');
                        break;
                }
            }
        },
        connect : function(site, action, permissions){
            if(typeof this.request == 'undefined'){
                this.request = new Ajax.Request('/include/social/ajax.php', {
                    parameters : { site : site, action : 'session' },
                    onSuccess : function(r){
                        social.connected[site] = undefined;
                        var data = r.responseText.isJSON() ? r.responseText.evalJSON() : new Array();
                        var url = social.connect[site].evaluate({ redirect : data.redirect, token : data.token, permissions : permissions });
                        var popup = window.open(url, 'Sign In', 'height=400, width=550');

                        var t = setInterval(function(){
                            social.checkcookies();
                            if(typeof social.connected[site] == 'boolean'){
                                clearInterval(t);
                                popup.close();
                                location.href = action.length > 0 && action != '#' ? action : location.href;
                            }
                        }, 250);
                        
                        social.request = undefined;
                    }
                });
            }
        },
        checkcookies : function(){
            var key, val, cookies = document.cookie.split(';');
            
            this.connected = [];
            
            for(var i = 0; i < cookies.length; i++){                
                cookies[i] = cookies[i].replace(/^\s+|\s+$/g, '');
                key = cookies[i].substr(0, cookies[i].indexOf('='));
                val = cookies[i].substr(cookies[i].indexOf('=') + 1);
                
                if(key == this.cookies['facebook'] && val.length > 0)
                    this.connected['facebook'] = true;
                if(key == this.cookies['linkedin'] && val.length > 0)
                    this.connected['linkedin'] = true;
            }
        }
    }
    social.load();
}