/**
 *@user Joseph
 */
// Saves options to localStorage.

function msg(name){
	return chrome.i18n.getMessage(name);
}

function s(selector){
	return document.querySelector(selector);
}

function save_options() {
//    test_keys();
    localStorage["doit_host"] =document.querySelector('input[name="host"]:checked').value;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = msg("saved");
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
    chrome.extension.sendRequest({method: "setLocalStorage",data:localStorage});
    chrome.extension.sendRequest({method: "checkLogin",data:localStorage});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    document.querySelectorAll("input[name=host][value='"+localStorage["doit_host"]+"']")[0].checked=true;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options)
s('#save').value=(msg("save"));
s('#header h1').innerHTML=msg('settings');
s('#legend').innerHTML=msg('server_selection');
s('#select_a_server').innerHTML=msg('select_a_server');
s('#china').innerHTML=msg('china');
s('#international').innerHTML=msg('international');
