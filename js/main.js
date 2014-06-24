/**
 * @user Joseph
 **/


$(document).on("DOMAttrModified","span.check",function(){
  if($(this).attr("action")!="check")
    completeDoit($(this).parents("li.doitim"))
});