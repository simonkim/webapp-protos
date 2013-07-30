
console.log( 'sshow.js loaded');

var supportCanvas = false;
var sshow_canvas;
var sshow_slides = [];
var sshow_current_slide_index;
var sshow_width;
var sshow_height;

function sshow_load_img(src, loaded) {
    var img = new Image();
    img.onload = function() {
        if ( loaded ) loaded (img);
    };
    img.src = src;
}

function sshow_create_canvas(width, height) {
    var canvas            = document.createElement('canvas'),
        canvasContext    = canvas.getContext("2d");

    // Make it the same size as the image
    canvas.width = width;
    canvas.height = height;
    console.log( 'canvas:' + canvas.width + 'x' + canvas.height);

    $('#sshow').append(canvas);
    return canvas;
}

var sshow_show_img = function( img ) {
    var duration = 3000;

    var oldCanvas = sshow_canvas;
    if ( supportCanvas ) {
        sshow_canvas = sshow_create_canvas( sshow_width, sshow_height );
        sshow_canvas.getContext("2d").drawImage( img, 0, 0 );
    } else {
        console.log( 'canvas disabled');
        $('#sshow').append( img );
        sshow_canvas = img;
    }

    $(sshow_canvas).attr( 'style', ' position: absolute; top: 0; left: 0; display: none;');
    $(sshow_canvas).hide();

    if ( oldCanvas ) {
        $(oldCanvas).fadeOut(duration, function() {
            $(oldCanvas).remove();
        });
    }

    $(sshow_canvas).fadeIn(duration, function() {
        $(sshow_canvas).attr('style', '');
    });
};

/*
 * sshow_load_slide()   : index = 0 or the next slide (sshow_current_slide_index + 1)
 * sshow_load_slide(n)  : nth slide
 * sshow_load_slide(-n) : (current - n)th slide
 */
var sshow_load_slide = function(index) {

    if ( sshow_current_slide_index === undefined ) {
        index = 0;
    }

    if ( index === undefined ) {
        /* next slide */
        index = (sshow_current_slide_index + 1) % sshow_slides.length;
    } else if ( index < 0 ) {
        /* backward: previous */
        index = sshow_current_slide_index - index;
        if ( index < 0) index = sshow_slides.length - index;
    }

    console.log( 'sshow_load_slide(): index=' + index);
    var img = sshow_slides[index].img;
    if ( !img ) {
        sshow_load_img( sshow_slides[index].src, function(img) {
            /* load and cache */
            console.log( 'sshow: image loaded: src=' + $(img).attr('src') + ' '+ img.width + 'x' + img.height);

            sshow_slides[index].img = img;
            sshow_current_slide_index = index;
            sshow_show_img( img );
        });
    } else {
        /* use the cached img */
        sshow_current_slide_index = index;
        sshow_show_img( img );
    }
};


var sshow_init = function (){

    console.log( 'sshow_init()');

    // Testing wether the current browser supports the canvas element:
    // supportCanvas = 'getContext' in document.createElement('canvas');

    var slides = $('#sshowslides .sshowslide'),
        current = 0,
        slideshow = {width:0,height:0};

    if ( !slides ) {
        console.log( 'sshow: #slideshow .sshowslides not found' );
        return;
    }
    sshow_width = 620;
    sshow_height = 320;

    slides.each( function(index, slide) {
        console.log( 'sshow: slide[' + index + ']:' + $(slide).attr('data-src') );
        sshow_slides.push( {src: $(slide).attr('data-src') });
    });

    console.log( sshow_slides.length + ' slides');

    /* Load the first slide */
    sshow_load_slide();

    (function autoAdvance(){
        sshow_load_slide();
        timeOut = setTimeout(autoAdvance,5000);
    })();
};

function sshow_api_init() {
    sshow_init();
}
