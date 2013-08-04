/* AJAX Demonstration: load tagline.txt and display under the product name. div tag id=tagline */


function app_load_template( elementId, url, done ) {
    console.log( 'app_load_template( id:' + elementId + ', url:' + url + ' )' );
    $.ajax({
        url: url,
        dataType: 'html',
        success: function(data) {
            $('#' + elementId).html(data);
            console.log( 'DONE: app_load_template( id:' + elementId + ', url:' + url + ' )' );
            if ( done ) done();
        }
    });
}

/*
 * template_header  ->  templates/header.html
 * template_body    ->  templates/body.html
 * template_footer  ->  templates/footer.html
 */
app_load_template( "template_header", "templates/header.html", function() {
    app_load_template( "tagline", "conf/tagline.txt" );
    app_load_template( "template_about", "templates/about.html" );
});
app_load_template( "template_footer", "templates/footer.html" );
app_load_template( "template_body", "templates/body.html", function() {

});
