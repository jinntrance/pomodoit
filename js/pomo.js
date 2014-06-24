/**
 * @author Joseph
 */

todoKey='pomo.todo';
doneKey='pomo.done';
pomoHostPrefix='https://pomotodo.com/';

function createPomoTask(doitTask){
    var url=pomoHostPrefix+'/api/todo';
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
//        task.priority=doitTask.priority;
        patchPomoTask(task);
        task['doit_task']=doitTask;
        storeTask(task);
    },'POST',{
        description: doitTask.title+suffix+prioritySuffix,
        pin: doitTask.now,
        priority: doitTask.priority,
        tags: doitTask.tags
    })
}

function donePomoTask(task){
    var url=pomoHostPrefix+'/api/todo/'+task.id;
    task.completed=true;
    task.status='finished';
    requestJSON(url,function(json){
    },"PATCH",task)
}

function patchPomoTask(task){
    var url=pomoHostPrefix+'/api/todo/'+task.id;
    requestJSON(url,function(json){
    },"PATCH",task)
}

function todoList(callback){
    var url=pomoHostPrefix+'/api/todo';
    requestJSON(url, function (json) {
        pomoTodo=json.data;
        chrome.storage.local.set({todoKey:json.data});
        callback();
    },"GET",undefined)
}

function completedList(callback){
    var url=pomoHostPrefix+"/api/pomo?days=1";
    requestJSON(url, function (json) {
        var today=new Date();
        var date=today.getDate();
        var list=json.data.map(function(task){
            var d=new Date(parseInt(task.end_time+'000'));
            if(d.getDate()==date&& d.getHours()>=4)
                return task.description;
            else return '';
        });
        pomoDoneList=list;
        chrome.storage.local.set({doneKey:list});
        callback();
    },"GET",undefined)
}
