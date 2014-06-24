/**
 *@user Joseph
 */
// Saves options to localStorage.
function save_options() {
//    test_keys();
    localStorage["doit_host"] =document.querySelector('input[name="host"]:checked').value;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "保存成功";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
    chrome.extension.sendRequest({method: "setLocalStorage",data:localStorage});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    $("input[name=host][value="+localStorage["doit_host"]+"]").attr("checked",true);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
