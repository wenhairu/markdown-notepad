/*! markdown-notepad v0.1.0 2016-04-26 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):window.jQuery&&a(window.jQuery)}(function(a){function b(a,b){var c=document.createElement("a");if(c.setAttribute("href",a),c.setAttribute("download",b),document.createEvent){var d=document.createEvent("MouseEvents");d.initEvent("click",!0,!0),c.dispatchEvent(d)}else c.click()}var c=function(a){this._opt=a,this._d={}};c.prototype={constructor:c,setItem:function(a,b){var c=this;b?c._d[a]=b:delete c._d[a]},getItem:function(a){return this._d[a]},save:function(){var a=this,b=a._opt,c=window.localStorage;if(c){for(var d in a._d){var e=a._d[d];"object"!=typeof e||e.d||delete a._d[d]}c.setItem(b.id,JSON.stringify(a._d))}},load:function(){var b=this,c=b._opt,d=window.localStorage;if(d){var e=d.getItem(c.id);e&&(b._d=a.parseJSON(e))}else console.log("Unsupport localStorage!");return b}};var d=function(b,d){var e=this;e._el=b,e._opt=d,e._adapter=d.adapter,e._autoSaveInterval=d.autoSaveInterval||6e5,e._initTime=(new Date).getTime(),e._store=new c({id:d.id||"__notes"}).load();var f=e._store._d,g=a(".notes-tab",b).on("closed.bs.tab",a.proxy(e._tabClosed,e)).on("close.bs.tab",a.proxy(e._tabClose,e)).on("selected.bs.tab",a.proxy(e._tabSelected,e)).on("created.bs.tab",a.proxy(e._tabCreated,e)).on("shown.bs.tab",a.proxy(e._tabShown,e)).on("rename.bs.tab",a.proxy(e._tabRename,e));e._notestab=g[0];var h=[];for(var i in f)"__ctxUid"===i?e._ctxUid=f[i]:h[h.length]=f[i];h.length>0?(g.notestab("create",h),e._ctxUid?a("a",a("li[data-note-uid="+e._ctxUid+"]",g)).tab("show"):a("a",a("li:first",g)).tab("show")):g.notestab("createUntitled"),a(e._adapter).on("edit.ntadapter",a.proxy(e._edit,e)),a(".notes-header",b).on("click","button",a.proxy(e._cmd,e))};d.prototype={constructor:d,_edit:function(b,c){var d=this,e=d.note(d._ctxUid);e&&e.d!==c&&(e.unsaved=!0,e.d=c||a(d._adapter).data("ntadapter").data(),a(d._notestab).notestab("markUnsaved",!1,e),(new Date).getTime()-d._initTime>d._autoSaveInterval&&d.save2LocalStore())},_tabClose:function(a,b){var c=this;c.close(b)},_tabClosed:function(b,c){var d=this,e=d._store,f=a(d._notestab).data("notestab"),g=d.note(c);delete g.d,0===f.count()&&a(d._adapter).ntadapter("data",g),e.setItem(c)},_tabSelected:function(b,c){var d=this,e=d.note(c);d._ctxUid=c,a(d._adapter).ntadapter("data",e)},_tabCreated:function(b,c){var d=this,e=a(d._notestab).data("notestab");if(e.count()>1){var f=d.note(d._ctxUid);!f||f.unsaved||f.d||0!==f.name.indexOf("Untitled")||e.close(f.uid)}d.note(c.uid,c),a(d._adapter).ntadapter("data",c)},_tabShown:function(b){var c=this,d=a(b.target).parent().data("note-uid");c._ctxUid=d,a(c._adapter).ntadapter("data",c.note(d))},_tabRename:function(b,c,d){var e=this,f=e.note(c);d&&(f.name=d,a(e._notestab).notestab("rename",f))},_cmd:function(b){var c=this,d=a(b.currentTarget).data("cmd");switch(d){case"save":c.saveLocal();break;case"new":a(c._notestab).notestab("createUntitled");break;case"open":c.open()}},note:function(a,b){var c=this,d=c._store;return b?void d.setItem(a,b):d.getItem(a)},open:function(){var b=this;b.openLocal(function(c,d,e){var f=e[d],g={name:f.name,d:c};a(b._notestab).notestab("create",g,!0)})},openLocal:function(b){var c=this;a('<input type="file" name="file" multiple />').on("change",a.proxy(c._loadLocal,c)).on("load",function(c,d,e,f){b(d,e,f),e===f.length-1&&a(c.target).remove()}).click()},openRemote:function(b){var c=this,d=b.url||b||prompt("Remote URL:","http://");if(d){var e=document.createElement("a");e.href=d;var f=e.pathname.split("/").pop(),g={name:f,d:"> Loading...",readOnly:!0};"string"!=typeof b&&(g=a.extend(g,b)),a(c._notestab).notestab("create",g,!0),a.ajax({url:d,success:function(b){g.d=b,a(c._adapter).ntadapter("data",g)},error:function(b,d,e){g.d="> Load failure!!!\n"+(d||e),a(c._adapter).ntadapter("data",g)}})}},close:function(b){var c=this,d=a(c._notestab).data("notestab"),e=c.note(b||d.activeUid());(e&&!e.unsaved||confirm('Close "'+e.name+'"?'))&&d.close(b)},saveLocal:function(c){var d=this,e=d._opt,f="."+(e.suffix||"txt"),g=a(d._notestab).data("notestab"),h=c||d.note(g.activeUid());if(d.save2LocalStore(),h){var i=h.d||"",j=h.name;if(j+=-1===j.lastIndexOf(".")?f:"",window.saveAs)window.saveAs(new Blob([i],{type:e.mime||"text/plain"}),j);else if(navigator.msSaveBlob)navigator.msSaveBlob(new Blob([i],{type:e.mime||"text/plain"}),j);else{var k="data:"+(e.mime||"text/plain")+";charset=utf-8,"+encodeURIComponent(i);b(k,j)}a(d._notestab).notestab("markUnsaved",!0)}},_noteLoad:function(a,b,c){return function(d){var e=d.target.result;c.trigger("load",[e,a,b])}},_loadLocal:function(b){for(var c=this,d=a(b.target),e=d[0].files,f=0;f<e.length;f++){var g=e.item(f),h=new FileReader;h.onload=a.proxy(c._noteLoad,c)(f,e,d),/\.(txt|md|js|xml|html|json)$/i.test(g.name)?h.readAsText(g):h.readAsDataURL(g)}},save2LocalStore:function(){var a=this;if(a._ctxUid){var b=a.note(a._ctxUid);b&&b.d&&a._store.setItem("__ctxUid",a._ctxUid)}a._store.save()},hotkey:function(b){var c=this,d=a(c._notestab),e=!1;if(b.ctrlKey)switch(b.which){case 84:d.notestab("createUntitled"),e=!0;break;case 79:c.open(),e=!0;break;case 83:c.saveLocal(),e=!0;break;case 87:c.close(),e=!0;break;case 116:}e&&(b.preventDefault(),b.stopPropagation())}},a.fn.notes=function(b){var c=arguments;return this.each(function(){var e=a(this),f=e.data("notes"),g="object"==typeof b?b:{};f||"string"==typeof b?"string"==typeof b&&f[b].apply(f,Array.prototype.slice.call(c,1)):e.data("notes",new d(this,g))})}});