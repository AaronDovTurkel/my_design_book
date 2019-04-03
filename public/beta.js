'use strict';

//Intital mvp Client Home Page//

// url finder independant of domain name
function change_url(pathArg) {
    let url = window.location;
    let new_url = url + `${pathArg}`;
    return new_url;
}

// current account store //
let selected_storage = {
    project: 0,
    subProject: 0,
    subProjectPicture: 0,
    projectId: '',
    subProjectId: '',
    subProjectPictureId: '',
    projectTitle: '',
    subProjectTitle: '',
    subProjectPictureTitle: ''
}

// static client_page for mvp (will have log in page that will change id)
const mvp_static_account_id = `5c992f195bdf02489526598c`;
const client_home_url = change_url(`client_pages/${mvp_static_account_id}`);
const client_post_project_url = change_url(`client_pages/project/${mvp_static_account_id}`);
let client_post_sub_project_url = '';
let client_post_sub_project_picture_url = '';

// initial page load // 
function initial_mvp_page_load() {
    $.getJSON(client_home_url)
        .then(account_data => {
            console.log(account_data);
            selected_storage.project = (account_data.projects.length) - 1;
            selected_storage.subProject = (account_data.projects[`${selected_storage.project}`].subProjects.length) - 1;
            place_projects(account_data, account_data.projects.length);
            place_profile_img(account_data);
            place_sub_projects(account_data);
            place_sub_project_pictures(account_data);
        })
        .catch(err => {
            console.log(err);
        });
}

//Find and Store ID's
function store_project_id(projectTitleArg) {
    $.getJSON(client_home_url)
        .then(account_data => {
            for (let i = 0; i < account_data.projects.length; i++) {
                if (projectTitleArg == account_data.projects[i].projectTitle) {
                    selected_storage.projectId = account_data.projects[i]._id;
                    selected_storage.projectTitle = projectTitleArg;
                }
            }
        });
}

function store_sub_project_id(subProjectTitleArg) {
    $.getJSON(client_home_url)
        .then(account_data => {
            for (let i = 0; i < account_data.projects[selected_storage.project].subProjects.length; i++) {
                if (subProjectTitleArg == account_data.projects[selected_storage.project].subProjects[i].subProjectTitle) {
                    selected_storage.subProjectId = account_data.projects[selected_storage.project].subProjects[i]._id;
                    selected_storage.subProjectTitle = subProjectTitleArg;
                    client_post_sub_project_url = change_url(`client_pages/subProject/${selected_storage.projectId}`);
                }
            }
        });
}
        

function store_sub_project_picture_id(subProjectPictureTitleArg) {
    $.getJSON(client_home_url)
        .then(account_data => {
            for (let i = 0; i < account_data.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
                if (subProjectPictureTitleArg == account_data.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureTitle) {
                    selected_storage.subProjectPictureId = account_data.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i]._id;
                    selected_storage.subProjectPictureTitle = subProjectPictureTitleArg;
                    client_post_sub_project_picture_url = change_url(`client_pages/subProjectPicture/${selected_storage.subProjectId}`)
                    console.log(selected_storage);
                }
            }
        });
}

//Clear Functions//
function clear_projects() {
    $('li.unique_project_card').remove();
}

function clear_sub_projects() {
    $('li.unique_sub_project_card').remove();
}

function clear_sub_project_pictures() {
    $('li.unique_picture_card').remove();
}



//Placement Functions//
function place_profile_img(account_dataArg) {
    $('.profile_img_current').html(
        `<img class="profile_img_current" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="No Img">`
    );
}

function place_projects(account_dataArg, number_of_projectsArg) {
    for (let i = 0; i < number_of_projectsArg; i++) {
        console.log(`place_project worked ${i + 1} time(s).`);
        if (i == number_of_projectsArg - 1) {
            $('.project_list').prepend(
                `<li class="project_card unique_project_card">
                    <p>${account_dataArg.projects[i].projectTitle}</p>
                </li>`
            );
            store_project_id(account_dataArg.projects[i].projectTitle)
        } else {
            $('.project_list').prepend(
                `<li class="project_card unique_project_card">
                    <p>${account_dataArg.projects[i].projectTitle}</p>
                </li>`
            );
        }
    }
}

function place_sub_projects(account_dataArg) {
    clear_sub_projects();
    for (let i = 0; i < account_dataArg.projects[selected_storage.project].subProjects.length; i++) {
        if (i == account_dataArg.projects[selected_storage.project].subProjects.length - 1) {
            $('.sub_project_list').prepend(
                `<li class="sub_project_card unique_sub_project_card">
                    <p>${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                </li>`
            );
            store_sub_project_id(account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle);
        } else {
            $('.sub_project_list').prepend(
                `<li class="sub_project_card unique_sub_project_card">
                    <p>${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                </li>`
            );
        }
    }
}

function place_sub_project_pictures(account_dataArg) {
    clear_sub_project_pictures();
    for (let i = 0; i < account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
        if (i == account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length - 1) {
            $('.picture_list').prepend(
                `<li class="picture_card unique_picture_card">
                    <img class="list_img" src="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].imgUrl} alt="image not loading..." />
                </li>`
            );
            store_sub_project_picture_id(account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureTitle);
        } else {
            $('.picture_list').prepend(
                `<li class="picture_card unique_picture_card">
                    <img class="list_img" src="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].imgUrl} alt="image not loading..." />
                </li>`
            );
        }
        
    }
}

//Selector Functions//
function selector_functions() {
    select_project();
    select_sub_project();
}


function select_project() {
    $('.project_list').on( "click", ".unique_project_card", ( event => {
        event.preventDefault();	
        let selected_project = $(event.currentTarget).text().trim();
        $.getJSON(client_home_url)
            .then(current_account_store => {
                for (let i = 0; i < current_account_store.projects.length; i++) {
                    if (current_account_store.projects[i].projectTitle == selected_project) {
                        console.log(`Loading subProjects for ${current_account_store.projects[i].projectTitle}`);
                        selected_storage.project = i;
                        selected_storage.subProject = (current_account_store.projects[selected_storage.project].subProjects.length) - 1;
                        console.log(selected_storage.project);
                        place_sub_projects(current_account_store);
                        place_sub_project_pictures(current_account_store);
                        store_project_id(current_account_store.projects[i].projectTitle);
                    } else {
                        console.log(`${selected_project} is not in ${current_account_store.projects[i].projectTitle}`);
                    }
                }
            });
    }));
}

function select_sub_project() {
    $('.sub_project_list').on( "click", ".unique_sub_project_card", ( event => {
        event.preventDefault();
        $.getJSON(client_home_url)
            .then(current_account_store => {
                console.log(current_account_store);
                let selected_sub_project = $(event.currentTarget).text().trim();
                for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                    if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                        console.log(`Loading subProjectsPictures for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                        selected_storage.subProject = i;
                        place_sub_project_pictures(current_account_store, selected_storage.project);
                        store_sub_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                    } else {
                        console.log(`${selected_sub_project} is not in ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                    }
                }
            });
    }));
}

//POST (add) Functions//
function add_functions() {
    new_project_toggle();
    new_sub_project_toggle();
    new_sub_project_picture_toggle();
}

// Project POST (add) Functions
function new_project_toggle() {
    $('.project_list').on( "click", ".project_add_button", ( event => {
        event.preventDefault();
        new_project_submition_form();
        new_project_submition();
        new_project_back_toggle();
    }));
}

function new_project_submition_form() {
    $('.project_list').css("display", "none");
    $('.project-add_submition').css("display", "grid");
}

function new_project_submition() {
    $('.project-add_submition').on( "click", ".project_submition_button", ( event => {
        event.preventDefault();	
        console.log(`this clicked`);
        let new_project_title = $('#project_title').val();
        $('#project_title').val('');
        new_project_ajax_post(new_project_title);
    }));
}

function new_project_back_toggle() {
    $('.project-add_submition').on( "click", ".project_back_button", ( event => {
        event.preventDefault();
        $('.project-add_submition').css("display", "none");
        $('.project_list').css("display", "grid");
    }));
}

function new_project_ajax_post(x) {
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify({ projectTitle: x}),
        dataType: 'json',
        success: function(){
            console.log("device control succeeded");
        },
        error: function(err){
            console.log("Device control failed");
            console.log(err);
            alert(`Error. Something went wrong. Please try again.`)
        },
        processData: false,
        type: 'POST',
        url: client_post_project_url
    })
    .then(results => {
        $('.project-add_submition').css("display", "none");
        $('.project_list').css("display", "grid");
        console.log(results)
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
    })
    .catch(err => {
        console.log(err);
    });
}

// SubProject POST (add) Functions
function new_sub_project_toggle() {
    $('.sub_project_list').on( "click", ".sub_project_add_button", ( event => {
        event.preventDefault();
        new_sub_project_submition_form();
        new_sub_project_submition();
        new_sub_project_back_toggle();
    }));
}

function new_sub_project_submition_form() {
    $('.sub_project_list').css("display", "none");
    $('.sub_project-add_submition').css("display", "grid");
}

function new_sub_project_submition() {
    $('.sub_project-add_submition').on( "click", ".sub_project_submition_button", ( event => {
        event.preventDefault();	
        console.log(`this clicked`);
        let new_sub_project_title = $('#sub_project_title').val();
        $('#sub_project_title').val('');
        if (new_sub_project_title !== '') {
            new_sub_project_ajax_post(new_sub_project_title);
        } else {
            alert(`Error. Something went wrong. Please try again.`);
        }
    }));
}

function new_sub_project_back_toggle() {
    $('.sub_project-add_submition').on( "click", ".sub_project_back_button", ( event => {
        event.preventDefault();
        $('.sub_project-add_submition').css("display", "none");
        $('.sub_project_list').css("display", "grid");
    }));
}

function sub_project_load() {
    let selected_project = selected_storage.projectTitle;
    $.getJSON(client_home_url)
        .then(current_account_store => {
            for (let i = 0; i < current_account_store.projects.length; i++) {
                if (current_account_store.projects[i].projectTitle == selected_project) {
                    console.log(`Loading subProjects for ${current_account_store.projects[i].projectTitle}`);
                    selected_storage.project = i;
                    selected_storage.subProject = (current_account_store.projects[selected_storage.project].subProjects.length) - 1;
                    console.log(selected_storage.project);
                    place_sub_projects(current_account_store);
                    place_sub_project_pictures(current_account_store);
                    store_project_id(current_account_store.projects[i].projectTitle);
                } else {
                    console.log(`${selected_project} is not in ${current_account_store.projects[i].projectTitle}`);
                }
            }
        });
}

function new_sub_project_ajax_post(x) {
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify({ subProjectTitle: x}),
        dataType: 'json',
        success: function(){
            console.log("device control succeeded");
        },
        error: function(err){
            console.log("Device control failed");
            console.log(err);
            alert(`Error. Something went wrong. Please try again.`)
        },
        processData: false,
        type: 'POST',
        url: client_post_sub_project_url
    })
    .then(results => {
        clear_sub_projects();
        clear_sub_project_pictures();
        $('.sub_project-add_submition').css("display", "none");
        $('.sub_project_list').css("display", "grid");
        sub_project_load();
        return results;
    })
    .then(results => {
        console.log(results);
        sub_project_load();
    })
    .catch(err => {
        console.log(err);
    });
}

// SubProjectPicture POST (add) Functions
function new_sub_project_picture_toggle() {
    $('.picture_list').on( "click", ".add_button", ( event => {
        event.preventDefault();
        new_sub_project_picture_submition_form();
        new_sub_project_picture_submition();
        new_sub_project_picture_back_toggle();
    }));
}

function new_sub_project_picture_submition_form() {
    $('.add_button').css("display", "none");
    $('.add_submition').css("display", "grid");
}

function new_sub_project_picture_back_toggle() {
    $('.add_submition').on( "click", ".sub_project_picture_back_button", ( event => {
        event.preventDefault();
        $('.add_button').css("display", "grid");
        $('.add_submition').css("display", "none");
    }));
}

function new_sub_project_picture_submition() {
    $('.add_submition').on( "click", ".sub_project_picture_submition_button", ( event => {
        event.preventDefault();	
        console.log(`this clicked`);
        let new_sub_project_picture_title = $('#sub_project_picture_title').val();
        $('#sub_project_picture_title').val('');
        let new_sub_project_picture_url = $('#sub_project_picture_url').val();
        $('#new_sub_project_picture_url').val('');
        if ((new_sub_project_picture_title !== '') && (new_sub_project_picture_url !== '')) {
            console.log(new_sub_project_picture_url);
            new_sub_project_picture_ajax_post(new_sub_project_picture_title, new_sub_project_picture_url);
        } else {
            alert(`Error. Something went wrong. Please try again.`);
        }
    }));
}

function new_sub_project_picture_ajax_post(x, y) {
    let bodyRequest = { pictureTitle: x, imgUrl: y };
    console.log(JSON.stringify(bodyRequest));
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(bodyRequest),
        dataType: 'json',
        success: function(){
            console.log("device control succeeded");
        },
        error: function(err){
            console.log("Device control failed");
            console.log(err);
            alert(`Error. Something went wrong. Please try again.`)
        },
        processData: false,
        type: 'POST',
        url: client_post_sub_project_picture_url
    })
    .then(results => {
        clear_sub_project_pictures();
        sub_project_picture_load();
        $('.add_button').css("display", "grid");
        $('.add_submition').css("display", "none");
        return results;
    })
    .then(results => {
        console.log(results);
        sub_project_picture_load();
    });
}

function sub_project_picture_load() {
    let selected_sub_project = selected_storage.subProjectTitle;
    $.getJSON(client_home_url)
        .then(current_account_store => {
            console.log(current_account_store);
            for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                    console.log(`Loading subProjectsPicture for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                    selected_storage.subProject = i;
                    selected_storage.subProjectPicture = (current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length) - 1;
                    console.log(selected_storage);
                    place_sub_project_pictures(current_account_store);
                    store_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                } else {
                    console.log(`${selected_sub_project} is not in ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                }
            }
        });
}

//Display JS//
function display_js_functions() {
    client_options_toggle();
    project_options_toggle();
}

function client_options_toggle() {
    $('.profile_img_current').on( "click", ( event => {
        event.preventDefault();
        $('.profile_img_current').toggleClass('clicked');
        $('.project_toggle').removeClass('clicked');
        if ($('.profile_img_current').hasClass('clicked')) {
            $('.main_display').css('grid-column', '2 / 3');
            $('.picture_list').css('grid-template-columns', '1fr');
            $('.picture_list').css('grid-template-rows', '100%');
            $('.picture_list').css('grid-auto-rows', '100%');
            $('.client_options_container').css('display', 'grid');
            $('.project_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 2fr');
        } else {
            $('.main_display').css('grid-column', '1 / 3');
            $('.picture_list').css('grid-template-columns', '1fr 1fr 1fr');
            $('.picture_list').css('grid-template-rows', '33.33%');
            $('.picture_list').css('grid-auto-rows', '33.33%');
            $('.client_options_container').css('display', 'none');
            $('.project_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 1fr');
        }
    }));
}

function project_options_toggle() {
    $('.project_toggle').on( "click", ( event => {
        event.preventDefault();
        $('.project_toggle').toggleClass('clicked');
        $('.profile_img_current').removeClass('clicked');
        if ($('.project_toggle').hasClass('clicked')) {
            $('.main_display').css('grid-column', '1 / 2');
            $('.picture_list').css('grid-template-columns', '1fr');
            $('.picture_list').css('grid-template-rows', '100%');
            $('.picture_list').css('grid-auto-rows', '100%');
            $('.project_options_container').css('display', 'grid');
            $('.client_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '2fr 1fr');
        } else {
            $('.main_display').css('grid-column', '1 / 3');
            $('.picture_list').css('grid-template-columns', '1fr 1fr 1fr');
            $('.picture_list').css('grid-template-rows', '33.33%');
            $('.picture_list').css('grid-auto-rows', '33.33%');
            $('.project_options_container').css('display', 'none');
            $('.client_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 1fr');
        }
    }));
}


//Run All Functions//
function run_all_functions() {
    display_js_functions();
    initial_mvp_page_load();
    selector_functions();
    add_functions();
}

run_all_functions();