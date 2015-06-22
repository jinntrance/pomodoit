chrome.extension.sendRequest({method: "sync",data:localStorage}, function(rsp){
    console.info(rsp);
    if(rsp.data && rsp.data.status == 2) {
    	document.querySelector('#message_text').innerHTML = 'Synced';
    }
});
