/**
 * @author Joseph
 */

taskListKey="taskListKey";

var hosts=['i.doit.im','i.doitim.com'];

var openSetting=true

function ls(callback){
    chrome.extension.sendRequest({method: "getLocalStorage"}, function (response) {
        if (response) {
            for (var k in response.data) {
                localStorage[k] = response.data[k];
            }
        }
        if (callback) {
            callback(localStorage)
        }
    });
    return localStorage;
}

function hostPrefix(){
    var saved_host=ls().doit_host;
    if(undefined==saved_host&&openSetting){
        openSetting=false;
        chrome.tabs.create({url: chrome.runtime.getURL("options.html")});
        return "https://"+chrome.i18n.getMessage('doit_server');
    }else return "https://"+saved_host;
}

function sync(){
    chrome.storage.local.get(taskListKey,function(list){
        chrome.storage.local.get(todoKey,function(pomoTodo){
            chrome.storage.local.get(doneKey,function(pomoDoneList){
            })
        })
    });
    var todoList=pomoTodo.map(function(task){
        return task.description;
    });
    var addedTasksNum = 0;
    //here are those tasks previously from doit that are still in pomo TODO list.
    var doitRestList=doitData.filter(function (task) {
        var title=task.title;
        //remove those already done in pomotodo
        if(pomoDoneList.some(function(e){return e.indexOf(title)>=0})){
//            completeDoit(task); return false;//TODO sync the done tasks from pomotodo to doit.im, else retain it
            return true;
        } else if(todoList.every(function(e){return e.indexOf(title)<0})){
            createPomoTask(task);
            addedTasksNum++;
            return false;
        }else return true;
    }).map(function(task){
        return task.title;
    });
    pomoTodo.forEach(function (task) {
       if(doitRestList.every(function(title){return task.description.indexOf(title)<0})){
            finishPomoTask(task);
            removeTask(task);
       }
    });

    // add the number of taks in todoList
    chrome.browserAction.setBadgeText({text: String(todoList.length + addedTasksNum)});
}

function isEmpty(obj) {
    for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

    return true;
}

function storeTask(task){
    chrome.storage.sync.get(taskListKey,function (obj){
        console.info("geting object from storage: " + taskListKey)
        console.info(obj)
        list=[];
        if(! isEmpty(obj))
            list=obj[taskListKey]
        list.push(task);
        chrome.storage.sync.set({
            taskListKey:list
        })
    })
}

function removeTask(task){
    chrome.storage.sync.get(taskListKey,function (obj){
        var newList= []
        if(undefined != obj[taskListKey])
            newList=obj[taskListKey].filter(function(e){
            return e.id!=task.id;
        })
        chrome.storage.sync.set({
            taskListKey:newList
        })
    })
}

var notified = false;

function notifyLogin(url){
    console.info("login needed at " + url);
    if(!url || url.indexOf("http") < 0) {
        return;
    }
    var opt={
        type: "basic",
        title: "Login",
        message: "Login to Sync. " + url,
        iconUrl: "images/pomotodo-icon-38.png"
    }
    if(url.indexOf("doit")>-1) {
        opt.iconUrl = "images/doit-icon32.png";
    }
    var notId = Math.random().toString(36)
    if (! notified) {
        notification = chrome.notifications.create(notId,opt,function(notifyId){
            console.info(notifyId + " was created.")
            notified = true
        });
    }
    chrome.notifications.onClicked.addListener( function (notifyId) {
        console.info("notification was clicked")
        chrome.notifications.clear(notifyId,function(){});
        if (notId == notifyId) {
            chrome.tabs.create({
                url:url
            })
        }
        notified = false 

    });
    setTimeout(function(){
        chrome.notifications.clear(url,function(){});
    },8000);
}


/**
 *
 * @param url
 * @param callback function
 * @param method request METHOD
 * @param data Object
 */
function requestJSON(url,callback,method,data){
    var mime_string='application/json; charset=UTF-8';
    var xhr = new XMLHttpRequest();
    if(undefined==method){
        method='GET';
    }
    var d=new Date();
    //to avoid the browser cache
    if(url.indexOf('?')>1)
        url+='&_='+ d.getTime();
    else url+='?_='+ d.getTime();
    xhr.open(method, url, true);//GET url asyncly。
    xhr.setRequestHeader("Content-type",mime_string);
    xhr.setRequestHeader("X-Lego-Token",lego_token);
    // xhr.setRequestHeader("Authorization","token " + lego_token);
    if(localStorage["token"]) {
        xhr.setRequestHeader("Authorization", "token " + localStorage["token"]);
    }
    xhr.overrideMimeType(mime_string);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200 ) {
            var json=JSON.parse(xhr.responseText);
            console.info('response object is:');
            console.info(json);
            callback(json);
        } else if (401 == xhr.status) {
            console.info("LOGIN needed")
            if(-1<url.indexOf(hostPrefix())){
                chrome.cookies.remove({"url": hostPrefix(), "name": 'autologin'})
            }
            if(-1<url.indexOf(pomoAPIPrefix)){
                chrome.cookies.remove({"url": pomoAPIPrefix, "name": 'PHPSESSID'})
            }
            // routinelyCheck();
            return true;
        }
    };
    if(undefined!=data)
        xhr.send(JSON.stringify(data));
    else xhr.send();
    console.info(method+"ing "+url);
}
