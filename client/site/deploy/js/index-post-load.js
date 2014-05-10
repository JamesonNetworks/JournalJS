function blogListGot(){var a=$("#menu-template").html(),a=Mustache.to_html(a,blogEngine.content);$("#menu-placeholder").append(a);$(".article-link").click(blogEntryClick);$("#menuEntryList").hide();$("#menuHoverToggle").hover(function(){$("#menuEntryList").stop().slideDown("slow")},function(){setTimeout(function(){$("#menuEntryList").stop().slideUp("slow")},2E3)})}
function buildBlogPostHtml(a){finalHtml="";var b=$("#blog-entry-template").html(),d=$("#section-header").html(),e=$("#section-content-paragraph").html(),f=$("#section-content-code").html(),h=$("#section-content-quote").html();headerObject={};headerObject.title=a.title;headerObject.subtitle=a.subtitle;finalHtml=Mustache.to_html(b,headerObject);sections=a.markdown.sections;for(a=0;a<sections.length;a++){b=sections[a];finalHtml+=Mustache.to_html(d,b);for(var g=0;g<b.contents.length;g++){var c=b.contents[g];
switch(c.type){case "paragraph":finalHtml+=Mustache.to_html(e,c);break;case "code":finalHtml+=Mustache.to_html(f,c);break;case "picture":finalHtml+=Mustache.to_html(h,c)}}}return finalHtml}
function blogPostGot(){$("#blog-entry-template").html();var a=buildBlogPostHtml(blogEngine.content.currentBlogPost);$("#blog-entry").fadeOut(function(){$("#blog-entry").empty();$("#blog-entry").append(a);prettyPrint();$(".article-link").removeClass("active");$("#"+blogEngine.content.currentBlogPost.date).addClass("active");$("#blog-entry").fadeIn()})}
function showMessage(a,b){var d={message:a,type:b},e=$("#message-template").html(),f=Mustache.to_html(e,d);$("#messages").slideUp(function(){$("#messages").empty();$("#messages").append(f);$("#messages").slideDown();$("#messages").bind("closed.bs.alert",function(){$("#messages").slideUp()})})}function showSuccessMessage(a){showMessage(a,"success")}function showInfoMessage(a){showMessage(a,"info")}function showWarningMessage(a){showMessage(a,"warning")}
function showDangerMessage(a){showMessage(a,"danger")}function blogEngineError(){showDangerMessage("An error has occured")}function blogEntryClick(a){blogEngine.getBlogPost(this.id+".json")}window.onload=function(){$("#"+blogEngine.EventHandler).on("BlogListGot",blogListGot);$("#"+blogEngine.EventHandler).on("BlogPostGot",blogPostGot);$("#"+blogEngine.EventHandler).on("BlogEngineError",blogEngineError);$("#blog-entry").hide();blogEngine.populateBlogPosts()};
