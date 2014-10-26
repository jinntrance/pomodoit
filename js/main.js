/**
 * @user Joseph
 **/

//sync the token to background localStorag e
chrome.extension.sendRequest({method: "addLocalStorage",data:localStorage});
