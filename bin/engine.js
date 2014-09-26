var conf = require('../conf.json'),
    logger = require('jslogging'),
    Mustache = require('mustache');

exports = module.exports = new engine;

function engine() {

}

function buildBareBonesPostHtml(post) {
    finalHtml = '';

    // TODO: Remove this markup, pull current markup from client
    var template = '<script>window.location = "scriptEnabled/client/index.html?entryId={{uri}}";</script> \
        <div class="post-article"> \
        <div class="post-title">{{title}}</div> \
        <div class="post-field"> \
            <div class="subtitle">{{subtitle}}</div> \
        </div>'

    var sectionHeaderTemplate = '<hr class="section-divider"> \
        <div class="post-article"> \
            <h3>{{title}}</h3>'

    var sectionContentParagraphTemplate ='<div class="post-content"> \
            {{content}} \
        </div>'

    var sectionContentCodeTemplate =' <pre class="prettyprint linenums" style"overflow:scroll;"> \
    {{content}} \
            </pre>'

    var sectionContentQuoteTemplate = '<div class="post-content quote"> \
            {{content}} \
        </div> \
        <div class="post-content attributedTo"> \
            - {{attributedTo}} \
        </div>'

    var sectionContentPictureTemplate = '<div class="post-content"> \
            <img src="{{url}}" alt="{{alttext}}" class="center-block img-responsive"> \
        </div>'

    // Build a header object and start rendering the article
    headerObject = {};
    headerObject.title = post.title;
    headerObject.subtitle = post.subtitle;
    headerObject.uri = post.uri;

    finalHtml = Mustache.to_html(template, headerObject);

    // Iterate through the markdown and add sections as appropriate

    sections = post.markdown.sections;

    for(var i = 0; i < sections.length; i++) {
        var section = sections[i];
        finalHtml += Mustache.to_html(sectionHeaderTemplate, section);
        for(var k = 0; k < section.contents.length; k++) {
            var content = section.contents[k];
            switch(content.type) {
                case 'paragraph':
                    finalHtml += Mustache.to_html(sectionContentParagraphTemplate, content);
                    break;
                case 'code':
                    finalHtml += Mustache.to_html(sectionContentCodeTemplate, content);
                    break;
                case 'quote':
                    finalHtml += Mustache.to_html(sectionContentQuoteTemplate, content);
                    break;
                case 'picture':
                    var picture = {};
                    picture.url = conf.blogserver + '/entries/pictures/' + post.date + '_' + content.id + '.' + content.fileType;
                    picture.alttext = content.altText;
                    finalHtml += Mustache.to_html(sectionContentPictureTemplate, picture);
                    break;
                default:
            }
        }
    }

    // template = menuLinksTemplate;
    // var html = Mustache.to_html(template, blogEngine.content);
    // $('#modalContainer').append(html);

    return finalHtml;
}

engine.prototype.render = function(entry) {
    logger.log('Rendering entry: ' + JSON.stringify(entry), 7);
    return buildBareBonesPostHtml(entry);
}