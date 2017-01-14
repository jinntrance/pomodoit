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
    localStorage["doit_host"] = document.querySelector('input[name="host"]:checked').value;
    var token = document.querySelector('textarea[name="token"]').value.trim();
    if (token) {
        localStorage["token"] = token;
    } else {
        alert(msg('set_token'));
        return;
    }

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
    ls(function (localStorage) {
        var prefix = localStorage["doit_host"];
        if (prefix) {
            document.querySelectorAll(
                "input[name=host][value='" + prefix + "']")[0].checked = true;
        }
        if(localStorage["token"]) {
            document.querySelectorAll('textarea[name="token"]')[0].value = localStorage["token"];
        }
    })
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
s('#save').value=(msg("save"));
s('#header h1').innerHTML=msg('settings');
s('#doit_setting').innerHTML=msg('doit_setting');
s('#select_a_server').innerHTML=msg('select_a_server');
s('#china').innerHTML=msg('china');
s('#international').innerHTML=msg('international');
s('#pomotodo_setting').innerHTML=msg('pomotodo_setting');
s('#set_token').innerHTML=msg('set_token');
s('#click_to_get').innerHTML=msg('click_to_get');
