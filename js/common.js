/**
 * @author Joseph
 */

taskListKey="taskListKey";

var hosts=['i.doit.im','i.doitim.com'];

var openSetting=true

function ls(){
/**    chrome.extension.sendRequest({method: "getLocalStorage"}, function (response) {
        for (var k in response.data)
            localStorage[k] = response.data[k];
    });
*/
    return localStorage;
}

function hostPrefix(){
    var saved_host=ls().doit_host
    if(undefined==saved_host&&openSetting){
        openSetting=false;
        chrome.tabs.create({url: chrome.runtime.getURL("options.html")});
        return "https://"+hosts[1];
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
    //here are those tasks previously from doit that are still in pomo TODO list.
    var doitRestList=doitData.filter(function (task) {
        var title=task.title;
        //remove those already done in pomotodo
        if(pomoDoneList.some(function(e){return e.indexOf(title)>=0})){
//            completeDoit(task); return false;//TODO sync the done tasks from pomotodo to doit.im, else retain it
            return true;
        } else if(todoList.every(function(e){return e.indexOf(title)<0})){
            createPomoTask(task);
            return false;
        }else return true;
    }).map(function(task){
        return task.title;
    });
    pomoTodo.forEach(function (task) {
       if(doitRestList.every(function(title){return task.description.indexOf(title)<0})){
            donePomoTask(task);
       }
    })
}

function storeTask(task){
    chrome.storage.sync.get(taskListKey,function (list){
        if(undefined==list)
            list=[];
        list.push(task);
        chrome.storage.sync.set({
            taskListKey:list
        })
    })
}

function removeTask(task){
    chrome.storage.sync.get(taskListKey,function (list){
        var newList=list.filter(function(e){
            return e.id!=task.id;
        })
        chrome.storage.sync.set({
            taskListKey:newList
        })
    })
}

function notifyLogin(url){
    var opt={
        type: "basic",
        title: "Login",
        message: "Login to Sync",
        iconUrl: "images/icon-38.png"
    }
    var notification = chrome.notifications.create(url,opt,function(notifyId){return notifyId});
    chrome.notifications.onClicked.addListener( function (notifyId) {
        chrome.notifications.clear(notifyId,function(){});
        chrome.tabs.create({
            url:url
        })
    });
    setTimeout(function(){
        chrome.notifications.clear(url,function(){});
    },5000);
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
    xhr.overrideMimeType(mime_string);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200 ) {
            var json=JSON.parse(xhr.responseText);
            console.info('response object is:');
            console.info(json);
            callback(json);
        }
    };
    if(undefined!=data)
        xhr.send(JSON.stringify(data));
    else xhr.send();
    console.info(method+"ing "+url);
}
