/**
 * @author Joseph
 */

/**
 *
 * @param task data from doit.im
 */
doitDataKey = 'doit.tasks';

function completeDoit(task){
    var url=hostPrefix()+"/api/tasks/complete/"+task.uuid;
    var d=new Date();
    task.completed= d.getTime();
    requestJSON(url,function(data){
        console.info(task.title+" completed");
    },'PUT',task)
}

function createDoitTask(){
    var url=hostPrefix()+'/api/tasks/create';

}

/**
 * get today task from doit.im
 * @param callback
 */
function todayTasks(callback){
    var url=hostPrefix()+'/api/tasks/today';
    requestJSON(url,function(json){
        var list=json.entities.sort(function(a,b){
            if(true==b.now&&false==a.now) return 4;
            else if(false==b.now&&true==a.now) return -4;
            else return b.priority- a.priority;
        });
        if(typeof(doitData)!="undefined")
	        oldDoitData=doitData;
        doitData=list;
        chrome.storage.local.set({doitDataKey:list});
        callback();
    },"GET",undefined)

}
