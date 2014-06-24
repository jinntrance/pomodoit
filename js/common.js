/**
 * @author Joseph
 */

taskListKey="taskListKey";

var hosts=['i.doit.im','i.doitim.com'];

function hostPrefix(){
    return "https://"+hosts[1];//TODO
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
    //those tasks from doit that are already in pomo.
    var doitRestList=doitData.filter(function (task) {
        var title=task.title;
        if(pomoDoneList.some(function(e){return e.indexOf(title)>=0})){
//            completeDoit(task);//TODO sync the done tasks from pomotodo to doit.im
            return false;
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
    var notification = webkitNotifications.createNotification("icon_48.png", "Login", "Login to Sync");
    notification.addEventListener('click', function () {
        notification.cancel();
        chrome.tabs.create({
            url:url
        })
    });
    setTimeout(function(){
        notification.cancel();
    },5000);
    notification.show();
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
