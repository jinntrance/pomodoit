
pomodoit
========

It's a [Chrome extension] combining GTD and Pomodoro technique. Specifically it integrates the planing on [doit.im] with actions on [pomotodo.com].


# Installation

### Online install

If you can access Chrome Web Store, install _pomodoit_ by [this link][Chrome extension].

### Offline install

If you can not access Chrome Web Store, for instance, if you're in China, follow the steps below to install _pomodoit_ on your own.

1. Download the source [zip](https://github.com/jinntrance/pomodoit/archive/master.zip).
2. Unzip it to some folder named `SOME_FOLDER`.
3. Paste `chrome://extensions/` to Google Chrome's address bar and press enter.
4. Make sure "Developer Mode" is checked.
5. Click "Load Unpacked Extension".
6. Find `$SOME_FOLDER`, then click open.

## Settings

* After installation, goto extension setting at 
  `chrome-extension://nicplokppngheaejhggneaclnojhmkag/options.html` 
  to: 
  * correctly set your **Doit.im** server, from which your synced _Pomotodo_ tasks would come. 
  * and save your **Pomotodo** access token from [Personal Access Token](https://pomotodo.com/developer), 
* Make sure you are logged in both [doit.im] and [pomotodo.com], and then your tasks would be synced every time you start/restart Google Chrome and every 30 minutes after Chrome start/restart.


## Reference

- [Pomotodo API](https://pomotodo.github.io/api-doc/)
- [Doit.im API](http://help.doitim.com/topics/1902)

<script type="text/javascript" src="http://www.josephjctang.com/assets/js/analytics.js" async="async"></script>

[doit.im]: http://doit.im/
[pomotodo.com]: https://pomotodo.com/
[Chrome extension]: https://chrome.google.com/webstore/detail/nicplokppngheaejhggneaclnojhmkag/
