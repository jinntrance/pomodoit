/**
 * @author Joseph
 */

function syncData(){
    todayTasks(function(){
        completedList(function(){
            todoList(sync);
        })
    });
}

function routinelyCheck(){
    isUserSignedOn(hostPrefix(),'autologin','/signin',function(){
        isUserSignedOn(pomoHostPrefix,'session','/account#login',syncData);
    });
    setTimeout(function(){
        routinelyCheck();
    },30*60*1000);
}

function isUserSignedOn(hostUrl,name,loginUrl,callback) {
    chrome.cookies.get({"url": hostUrl, "name": name}, function (cookie) {
        if (cookie) {
            localStorage.setItem(hostUrl+name, cookie);
            callback();
        } else {
            localStorage.removeItem(hostUrl+name);
            notifyLogin(hostUrl+loginUrl);
        }
    });
}



    routinelyCheck();

