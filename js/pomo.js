/**
 * @author Joseph
 */

todoKey='pomo.todo';
doneKey='pomo.done';
pomoAPIPrefix='https://api.pomotodo.com/1/';
pomoHostPrefix='https://pomotodo.com';
pomoLoginUrl= pomoHostPrefix + '/account#login';

function createPomoTask(doitTask){
    var url= pomoAPIPrefix + '/todos';
    var prioritySuffix='';
    for(var i=0;i<doitTask.priority;i++)
        prioritySuffix+='!';
    if(prioritySuffix.length>1)
        prioritySuffix=' '+prioritySuffix;
    var suffix='';
    if(undefined!=doitTask.tags&&doitTask.tags.length>1)
        suffix=doitTask.tags.map(function(tag){
        return '#'+tag;
    }).join(' ') ;
    requestJSON(url,function(json){
        console.log(json.data.description+" created");
        var task=json.data;
        task.pin=doitTask.now;
        task.priority=doitTask.priority;
        task.estimated_pomo_count=Math.ceil(doitTask.estimated_time/25.0);
        patchPomoTask(task);
        task['doit_task']=doitTask;
        //storeTask(task);
    },'POST',{
        description: doitTask.title+suffix+prioritySuffix,
        pin: doitTask.now,
        priority: doitTask.priority,
        tags: doitTask.tags
    })
}

function finishPomoTask(task){
    var url= pomoAPIPrefix + '/todos/' + task.uuid;
    requestJSON(url,function(json){
    },"PATCH",{
        "completed":true
    })
}

/**
 * change a task
 * @param task
 */
function patchPomoTask(task){
    var url= pomoAPIPrefix + '/todos/' + task.uuid;
    requestJSON(url,function(json){
    },"PATCH",task)
}

/**
 * get unfinished tasks
 * @param callback
 */
function todoList(callback){
    var url= pomoAPIPrefix + '/todos?completed=false';
    requestJSON(url, function (json) {
        pomoTodo = json;
        chrome.storage.local.set({todoKey:json});
        callback();
    },"GET",undefined)
}

/**
 * get finished tasks
 * @param callback
 */
function completedList(callback){
    var url= pomoAPIPrefix + "/todos?completed=true";
    requestJSON(url, function (json) {
        if ( true == json.error ){
            notifyLogin(pomoLoginUrl);
        } else {
            var list=json.map(function(task){
                return task.description;
            });
            pomoDoneList=list;
            chrome.storage.local.set({doneKey:list});
            callback();
        }
    },"GET",undefined)
}
