/**
 * @author Joseph
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log("received method: "+request.method)
    switch(request.method){
        case "getLocalStorage":
            sendResponse({data: localStorage});
            break;
        case "setLocalStorage":
            window.localStorage=request.data;
            sendResponse({data: localStorage});
            break;
        case "addLocalStorage":
            for (var k in request.data){
                window.localStorage[k] = request.data[k];
            };
	    lego_token = (_ref = localStorage.session) != undefined ? JSON.parse(_ref).token : lego_token;
            sendResponse({data: localStorage});
            break;
        case 'openSettings':
            chrome.tabs.create({url: chrome.runtime.getURL("options.html")+'#'+request.anchor});
            sendResponse({data:{tabid:sender.tab.id}})
            break;
        case 'checkLogin':
            routinelyCheck();
        default :
            sendResponse({data:[]}); // snub them.
    }
});

function syncData(){
    var logon = 0;
    todayTasks(function(){
        logon = logon + 1;
        if( 2 == logon )
            todoList(sync);
    });
    completedList(function(){
        logon = logon + 1;
        if( 2 == logon )
            todoList(sync);
    });
}

function routinelyCheck(){
    var logon = 0;
    isUserSignedOn(hostPrefix(),'autologin','/signin',function(){
        //isUserSignedOn(pomoHostPrefix,'PHPSESSID','/account#login',syncData);
      var session = ls()['session'];
      if( ! session || session.length == 0 || !  JSON.parse(session)['token'])
        notifyLogin(pomoHostPrefix+'/account#login');
      else  syncData();
    });
    setTimeout(function(){
        routinelyCheck();
    },30*60*1000); // 30 min
}

function isUserSignedOn(hostUrl,name,loginUrl,callback) {
    chrome.cookies.get({"url": hostUrl, "name": name}, function (cookie) {
        if (cookie) {
            console.info(cookie)
            localStorage.setItem(hostUrl+"/"+name, cookie.name);
            callback();
        } else {    
            localStorage.removeItem(hostUrl+"/"+name);
            notifyLogin(hostUrl+loginUrl);
        }
    });
    if (undefined == localStorage.session) {
        notifyLogin(pomoHostPrefix+'/account#login');
    }
}

lego_token = (_ref = localStorage.session) != undefined ? JSON.parse(_ref).token : undefined;

// everytime clear previous tasks when it restarts
chrome.storage.sync.set({
    taskListKey: []
})  
routinelyCheck();
