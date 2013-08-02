
console.log( 'sshow.js loaded');

var supportCanvas = false;
var sshow_slidebox;         /* currently displayed slidebox */
var sshow_slides = [];      /* src: element: text: */
var sshow_current_slide_index;
var sshow_width = 620;
var sshow_height = 320;
var sshow_slidebox_style = 'margin:10px; background-color:black; width:' + sshow_width + 'px; height:' + sshow_height + 'px;';
var sshow_tag_id = '#sshow';
var sshow_duration_default = 2000;
var sshow_repeat = false;

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

    canvas.width = width;
    canvas.height = height;
    console.log( 'canvas:' + canvas.width + 'x' + canvas.height);

    $(sshow_tag_id).append(canvas);
    return canvas;
}
var sshow_show_slidebox = function( slidebox, image, duration ) {

    if ( !duration ) {
        duration = sshow_duration_default;
    }

    var old_slidebox = sshow_slidebox;
    if ( supportCanvas && image === true ) {
        sshow_slidebox = sshow_create_canvas( sshow_width, sshow_height );
        sshow_slidebox.getContext("2d").drawImage( slidebox, 0, 0 );
    } else {
        console.log( 'canvas disabled');
        $(sshow_tag_id).append( slidebox );
        sshow_slidebox = slidebox;
    }

    /* Overlap the old slidebox with the new one */

    $(sshow_slidebox).attr( 'style', sshow_slidebox_style + ' position: absolute; top: 0; left: 0; display: none;');
    $(sshow_slidebox).hide();

    /* Fade in/out at the same time */

    if ( old_slidebox ) {
        $(old_slidebox).fadeOut(duration, function() {
            $(old_slidebox).remove();
        });
    }

    $(sshow_slidebox).fadeIn(duration, function() {
        $(sshow_slidebox).attr('style', sshow_slidebox_style);
    });

    console.log( 'sshow_slidebox:' + $(sshow_slidebox).html());
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

    var slidebox;

    if ( sshow_slides[index].src ) {
        slidebox = sshow_slides[index].element;
        if ( !slidebox ) {
            /* Load Image from 'src' and cache */
            sshow_load_img( sshow_slides[index].src, function(img) {
                console.log( 'sshow: image loaded: src=' + $(img).attr('src') + ' '+ img.width + 'x' + img.height);

                sshow_slides[index].element = img;
                slidebox = img;
                sshow_current_slide_index = index;
                sshow_show_slidebox( slidebox, true );
            });
        } else {
            /* use the cached img */
            sshow_current_slide_index = index;
            sshow_show_slidebox( slidebox, true );
        }
    } else {
        /*
            <div class="slidebox">
                <p> ... </p>
            </div>
         */
        slidebox = document.createElement('div');
        $(slidebox).addClass('slidebox');
        /* Test of Text Slide */

        var textSlide = document.createElement('p');

        $(textSlide).text( sshow_slides[index].text);
        $(textSlide).addClass('text-center');
        $(textSlide).addClass('content-text');
        $(textSlide).attr('style', 'background-color:black; color:white; font-size:xx-large; width:' + sshow_width + 'px; height:' + sshow_height + 'px; line-height:' + sshow_height + 'px;');
        sshow_current_slide_index = index;

        $(slidebox).append(textSlide);
        sshow_slides[index].element = slidebox;
        sshow_show_slidebox( slidebox );
    }
};

var sshow_start = function() {
    sshow_current_slide_index = undefined;
    (function autoAdvance(){
        if ( !sshow_repeat && sshow_current_slide_index == (sshow_slides.length - 1) ) {
            console.log( 'sshow: end of slide show at index:' + sshow_current_slide_index );
            return;
        }
        sshow_load_slide();
        timeOut = setTimeout(autoAdvance,5000);
    })();
};

var sshow_init = function (tag_id){

    if ( tag_id ) {
        sshow_tag_id = tag_id;
    }
    console.log( 'sshow_init(' + sshow_tag_id + ')');

    // Testing wether the current browser supports the canvas element:
    // supportCanvas = 'getContext' in document.createElement('canvas');

    var slides = $('#sshowslides .sshowslide'),
        current = 0,
        slideshow = {width:0,height:0};

    if ( !slides ) {
        console.log( 'sshow: #slideshow .sshowslides not found' );
        return;
    }


    slides.each( function(index, slide) {
        var text = $(slide).attr('data-text');
        var src = $(slide).attr('data-src');
        console.log( 'sshow: slide[' + index + ']:' + $(slide).attr('data-src') );
        sshow_slides.push( {src: src, text:text });
    });

    sshow_slides.push( {text: 'dzpub.com'});

    console.log( sshow_slides.length + ' slides');

    /* Load the first slide and auto advance */
    sshow_start();

};

function sshow_api_init() {
    sshow_init();
}
