/* AJAX Demonstration: load tagline.txt and display under the product name. div tag id=tagline */


function create_xmlhttp() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function app_load_template( elementId, url, done ) {
    console.log( 'app_load_template( id:' + elementId + ', url:' + url + ' )' );

    /* Argument Verification */
    if ( !document.getElementById(elementId) ) {
        console.log( ' - id not found:' + elementId );
        return;
    }
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById(elementId).innerHTML = xmlhttp.responseText;
            console.log( 'DONE: app_load_template( id:' + elementId + ', url:' + url + ' )' );
            if ( done ) done();
        }
    } 
    xmlhttp.open("GET", url ,true); 
    xmlhttp.send();
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
   sshow_api_init();
} );
