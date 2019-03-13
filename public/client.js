////
'use strict';

function sign_in_submition() {
    $('.sign_in-main-form').on( "submit",( event => {
        event.preventDefault();	
        console.log(`this clicked`);
        let data = {
            userName: $('#user_name').val(),
            passWord: $('#pass_word').val()
        };
        login_post(data);
    }));
};

function sign_up_submition() {
    $('.sign_up-main-form').on( "submit",( event => {
        event.preventDefault();	
        console.log(`this clicked`);

    }));
};

function sign_in_sign_up_form_toggle() {
    $('.sign_in-footer').on( "click",( event => {
        event.preventDefault();	
        $('.sign_in-footer').toggleClass("clickToggle");
        if ($('.sign_in-footer').hasClass("clickToggle")) {
            $('.sign_in-main').css("display", "none");
            $('.sign_up-main').css("display", "grid");
            $('.sign_in-footer-create_new_book_button').css("display", "none");
            $('.sign_up-footer-return_button').css("display", "grid");
        } else {
            $('.sign_in-main').css("display", "grid");
            $('.sign_up-main').css("display", "none");
            $('.sign_in-footer-create_new_book_button').css("display", "grid");
            $('.sign_up-footer-return_button').css("display", "none");
        }
    }));
};


	//Initial API Fetches//
function login_post(dataArg) {
    const url = change_url(`client_pages/login`);
    const html_url = change_url(`client_pages/`);
    $('#user_name').val("");
    $('#pass_word').val("");
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(dataArg),
        dataType: 'json',
        success: function(results){
            console.log(results);
            $.get(html_url, function(newPage) {
                document.write(newPage);
            });
        },
        error: function(err){
            alert(err.responseJSON.error);
            console.log(err);
        },
        processData: false,
        type: 'POST',
        url: url
    });

};

function change_url(pathArg) {
    let url = window.location
    let url_path = window.location.pathname;
    let new_url = url + url_path.replace(`/`, `${pathArg}`);
    return new_url;
};

function run_all_functions() {
    sign_in_submition();
    sign_up_submition();
    sign_in_sign_up_form_toggle();
};

run_all_functions();