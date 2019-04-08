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
    subProjectPictureTitle: '',
    selected_project_for_deletion: '',
    selected_sub_project_for_deletion: '',
    selected_project_for_edit: '',
    selected_sub_project_for_edit: ''
}

//click and double click timers
let DELAY = 500, clicks = 0, timer = null;

// static client_page for mvp (will have log in page that will change id)
const mvp_static_account_id = `5c992f195bdf02489526598c`;
const client_home_url = change_url(`client_pages/${mvp_static_account_id}`);
const client_post_project_url = change_url(`client_pages/project/${mvp_static_account_id}`);
let client_post_sub_project_url = '';
let client_post_sub_project_picture_url = '';
let client_delete_project_url = '';
let client_delete_sub_project_url = '';
let client_edit_project_url = '';

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
                    selected_storage.projectTitle = account_data.projects[i].projectTitle;
                    client_post_sub_project_url = change_url(`client_pages/subProject/${selected_storage.projectId}`);
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
                `<li class="project_card unique_project_card ${account_dataArg.projects[i].projectTitle}">
                    <input class="project_edit" type="button" value="x">
                    <p>${account_dataArg.projects[i].projectTitle}</p>
                </li>`
            );
            store_project_id(account_dataArg.projects[i].projectTitle)
        } else {
            $('.project_list').prepend(
                `<li class="project_card unique_project_card ${account_dataArg.projects[i].projectTitle}">
                    <input class="project_edit" type="button" value="x">
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
                    <input class="sub_project_edit" type="button" value="x">
                    <p class="room_name">${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                </li>`
            );
            store_sub_project_id(account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle);
        } else {
            $('.sub_project_list').prepend(
                `<li class="sub_project_card unique_sub_project_card">
                    <input class="sub_project_edit" type="button" value="x">
                    <p class="room_name">${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
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
    $('.project_list').on( "click", ".unique_project_card > p", ( event => {
        event.preventDefault();
        clicks++;  //count clicks

        if(clicks === 1) {

            timer = setTimeout(function() {

                console.log("Single Click");  //perform single-click action    
                clicks = 0;    
                room_selected();
                let selected_project = $(event.currentTarget).text().trim();
                $.getJSON(client_home_url)
                    .then(current_account_store => {
                        for (let i = 0; i < current_account_store.projects.length; i++) {
                            if (current_account_store.projects[i].projectTitle == selected_project) {
                                console.log(`Loading subProjects for ${current_account_store.projects[i].projectTitle}`);
                                selected_storage.project = i;
                                selected_storage.subProject = (current_account_store.projects[selected_storage.project].subProjects.length) - 1;
                                place_sub_projects(current_account_store);
                                place_sub_project_pictures(current_account_store);
                                store_project_id(current_account_store.projects[i].projectTitle);
                                console.log(selected_storage);
                            } else {
                                console.log(`${selected_project} is not in ${current_account_store.projects[i].projectTitle}`);
                            }
                        }
                    });         //after action performed, reset counter

            }, DELAY);

        } else {

            clearTimeout(timer);    //prevent single-click action
            console.log("Double Click");  //perform double-click action
            clicks = 0;             //after action performed, reset counter
        }
        
    }));
}

function select_sub_project() {
    $('.sub_project_list').on( "click", ".unique_sub_project_card > p", ( event => {
        event.preventDefault();
        clicks++;  //count clicks

        if(clicks === 1) {

            timer = setTimeout(function() {

                console.log("Single Click");  //perform single-click action    
                clicks = 0;  
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
                    });           //after action performed, reset counter

            }, DELAY);

        } else {

            clearTimeout(timer);    //prevent single-click action
            console.log("Double Click");  //perform double-click action
            clicks = 0;             //after action performed, reset counter
        }
       
    }));
}

//POST (add) Functions//
function add_functions() {
    new_project_toggle();
    new_project_submition();
    new_project_back_toggle();
    new_sub_project_toggle();
    new_sub_project_submition();
    new_sub_project_back_toggle();
    new_sub_project_picture_toggle();
    new_sub_project_picture_submition();
    new_sub_project_picture_back_toggle();
}

// Project POST (add) Functions
function new_project_toggle() {
    $('.project_list').on( "click", ".project_add_button", ( event => {
        event.preventDefault();
        new_project_submition_form();
    }));
}

function new_project_submition_form() {
    $('.project_options_container').css("display", "none");
    $('.form_container').css("display", "grid");
    $('.project-add_submition').css("display", "grid");
    $('.project_toggle').css("pointer-events", "none");
    $('.profile_img').css("pointer-events", "none");
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
        $('.project_options_container').css("display", "grid");
        $('.form_container').css("display", "none");
        $('.project-add_submition').css("display", "none");
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
    }));
}

function new_project_ajax_post(x) {
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify({ projectTitle: x}),
        dataType: 'json',
        processData: false,
        type: 'POST',
        url: client_post_project_url
    })
    .then(results => {
        console.log(results);
        console.log("device control succeeded");
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
        $('.project_options_container').css("display", "grid");
        $('.form_container').css("display", "none");
        $('.project-add_submition').css("display", "none");
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
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
    }));
}

function new_sub_project_submition_form() {
    $('.project_options_container').css("display", "none");
    $('.form_container').css("display", "grid");
    $('.sub_project-add_submition').css("display", "grid");
    $('.project_toggle').css("pointer-events", "none");
    $('.profile_img').css("pointer-events", "none");
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
        $('.project_options_container').css("display", "grid");
        $('.form_container').css("display", "none");
        $('.sub_project-add_submition').css("display", "none");
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
    }));
}

function sub_project_load() {
    let selected_project = selected_storage.projectTitle;
    $.getJSON(client_home_url)
        .then(current_account_store => {
            console.log(current_account_store);
            for (let i = 0; i < current_account_store.projects.length; i++) {
                if (current_account_store.projects[i].projectTitle == selected_project) {
                    console.log(`Loading subProjects for ${current_account_store.projects[i].projectTitle}`);
                    selected_storage.project = i;
                    selected_storage.subProject = (current_account_store.projects[selected_storage.project].subProjects.length) - 1;
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
        processData: false,
        type: 'POST',
        url: client_post_sub_project_url
    })
    .then(results => {
        console.log(results);
        clear_sub_projects();
        clear_sub_project_pictures();
        $('.project_options_container').css("display", "grid");
        $('.form_container').css("display", "none");
        $('.sub_project-add_submition').css("display", "none");
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
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
    let formData = new FormData(y);
    let bodyRequest = { pictureTitle: x, imgUrl: formData };
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

//DELETE Functions//

function delete_functions() {
    delete_project_toggle();
    verify_delete_project_input();
    verify_keep_project_input();
    delete_sub_project_toggle();
    verify_delete_sub_project_input();
    verify_keep_sub_project_input();
}

// DELETE Project functions
function delete_project_toggle() {
    $('main').on('click', ".project_edit", ( event => {
        event.preventDefault();
        selected_storage.selected_project_for_deletion = $(event.currentTarget).siblings().text().trim();
        console.log(selected_storage.selected_project_for_deletion);
        verify_delete_project_display_toggle(selected_storage.selected_project_for_deletion);
    }));
}

function verify_delete_project_display_toggle(homeArg) {
    console.log(`this is working`);
    $('.project_options_container').css('display', 'none');
    $('.form_container').css('display', 'grid');
    $('.delete_form').css('display', 'grid');
    $('.delete_form').html(
        `<label for="verify_delete_project">Are you sure you want to delete ${homeArg}?</label>
                    
        <input type="button" class="verify_delete_project delete_project" id="verify_delete_project" value="Yes">
        
        <input type="button" class="verify_delete_project keep_project" id="verify_delete_project" value="No">`
    );
}

function verify_delete_project_input() {
    $('main').on('click', '.delete_project', ( event => {
        event.preventDefault();
        console.log(`line 514 clicked`);
        $.getJSON(client_home_url)
        .then(current_account_store => {
            for (let i = 0; i < current_account_store.projects.length; i++) {
                if (current_account_store.projects[i].projectTitle == selected_storage.selected_project_for_deletion) {
                    console.log(`Deleteing ${selected_storage.selected_project_for_deletion}`);
                    client_delete_project_url = change_url(`client_pages/project/${current_account_store.projects[i]._id}`);
                    ajax_delete_project();
                }
            }
        });
    }));
}

function verify_keep_project_input() {
    $('main').on('click', '.keep_project', ( event => {
        event.preventDefault();
        console.log(`Keeping Project`);
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        selected_storage.selected_project_for_deletion = '';
    }));
}

function ajax_delete_project() {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        type: 'Delete',
        url: client_delete_project_url
    })
    .then(results => {
        console.log(results);
        console.log("device control succeeded");
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        selected_storage.selected_project_for_deletion = '';
    })
    .catch(err => {
        console.log(err);
    });
}


// DELETE Sub-Project functions
function delete_sub_project_toggle() {
    $('main').on('click', ".sub_project_edit", ( event => {
        event.preventDefault();
        selected_storage.selected_sub_project_for_deletion = $(event.currentTarget).siblings().text().trim();
        console.log(selected_storage.selected_sub_project_for_deletion);
        verify_delete_sub_project_display_toggle(selected_storage.selected_sub_project_for_deletion);
    }));
}

function verify_delete_sub_project_display_toggle(roomArg) {
    console.log(`this is working`);
    $('.project_options_container').css('display', 'none');
    $('.form_container').css('display', 'grid');
    $('.delete_form').css('display', 'grid');
    $('.delete_form').html(
        `<label for="verify_delete_sub_project">Are you sure you want to delete ${roomArg}?</label>
                    
        <input type="button" class="verify_delete_sub_project delete_sub_project" id="verify_delete_sub_project" value="Yes">
        
        <input type="button" class="verify_delete_sub_project keep_sub_project" id="verify_delete_sub_project" value="No">`
    )
}

function verify_delete_sub_project_input() {
    $('main').on('click', '.delete_sub_project', ( event => {
        event.preventDefault();
        console.log(`line 592 clicked`);
        $.getJSON(client_home_url)
        .then(current_account_store => {
            for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_storage.selected_sub_project_for_deletion) {
                    console.log(`Deleteing ${selected_storage.selected_sub_project_for_deletion}`);
                    client_delete_sub_project_url = change_url(`client_pages/subProject/${current_account_store.projects[selected_storage.project].subProjects[i]._id}`);
                    ajax_delete_sub_project();
                }
            }
        });
    }));
}

function verify_keep_sub_project_input() {
    $('main').on('click', '.keep_sub_project', ( event => {
        event.preventDefault();
        console.log(`Keeping Sub-Project`);
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        selected_storage.selected_sub_project_for_deletion = '';
    }));
}

function ajax_delete_sub_project() {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        type: 'Delete',
        url: client_delete_sub_project_url
    })
    .then(results => { 
        console.log(results);
        console.log("device control succeeded");
        clear_sub_projects();
        clear_sub_project_pictures();
        sub_project_load();
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        selected_storage.selected_project_for_deletion = '';
    })
    .catch(err => {
        console.log(err);
    });
}

//PUT (edit) Functions//

function put_functions() {
    edit_project_title_toggle();
    edit_project_title_back_toggle();
    edit_project_title_submition();
}

// PUT (edit) Project functions
function edit_project_title_toggle() {
    $('.project_list').on( "dblclick", ".unique_project_card > p", ( event => {
        event.preventDefault();
        console.log(`this dblclicked`);
        $(".unique_project_card > p").css("pointer-events", "none");
        selected_storage.selected_project_for_edit = $(event.currentTarget).text().trim();
        $(event.currentTarget).parent().html(
            `<form class="edit_project_title_form">
                <input type="text" class="new_project_title_input">
                <input type="button" class="edit_project_title_submition" value="change">
                <input type="button" class="edit_project_title_back" value="back">
            </form>`
        );
        $.getJSON(client_home_url)
            .then(current_account_store => {
                for (let i = 0; i < current_account_store.projects.length; i++) {
                    if (current_account_store.projects[i].projectTitle == selected_storage.selected_project_for_edit) {
                        console.log(`Editing ${selected_storage.selected_project_for_edit}...`);
                        client_edit_project_url = change_url(`client_pages/project/${current_account_store.projects[i]._id}`);
                    }
                };
            });
    }));
}

function edit_project_title_back_toggle() {
    $('.project_list').on('click', '.edit_project_title_back', ( event => {
        event.preventDefault();
        console.log('returning...');
        $(".unique_project_card > p").css("pointer-events", "auto");
        selected_storage.selected_project_for_edit = '';
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
    }));
}

function edit_project_title_submition() {
    $('.project_list').on('click', '.edit_project_title_submition', ( event => {
        event.preventDefault();
        console.log('Submiting change...');
        let new_project_title = $('.new_project_title_input').val();
        $('.new_project_title_input').val('');
        console.log(new_project_title);
        ajax_edit_project(new_project_title);
    }));
}

function ajax_edit_project(newProjectTitleArg) {
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify({ projectTitle: newProjectTitleArg}),
        dataType: 'json',
        processData: false,
        type: 'Put',
        url: client_edit_project_url
    })
    .then(results => { 
        console.log(results);
        console.log("device control succeeded");
        selected_storage.selected_project_for_deletion = '';
        $(".unique_project_card > p").css("pointer-events", "auto");
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
    })
    .catch(err => {
        console.log(err);
    });
}

//Display JS//
function display_js_functions() {
    client_options_toggle();
    project_options_toggle();
    home_button_toggle();
    room_button_toggle();
    room_to_pic_toggle();
    client_list_options_beta_alert();
}

function client_options_toggle() {
    $('.profile_img_current').on( "click", ( event => {
        event.preventDefault();
        $('.profile_img_current').toggleClass('clicked');
        $('.project_toggle').removeClass('clicked');
        if ($('.profile_img_current').hasClass('clicked')) {
            $('.main_display').css('display', 'grid');
            $('.main_display').css('grid-column', '2 / 3');
            $('.picture_list').css('grid-template-columns', '1fr');
            $('.picture_list').css('grid-template-rows', '100%');
            $('.picture_list').css('grid-auto-rows', '100%');
            $('.client_options_container').css('display', 'grid');
            $('.project_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 9fr');
            $('.profile_img_current').css('filter', 'blur(2px)');
            $('.project_toggle').css('filter', 'blur(0px)');
        } else {
            $('.main_display').css('display', 'grid');
            $('.main_display').css('grid-column', '1 / 3');
            $('.picture_list').css('grid-template-columns', '1fr 1fr 1fr');
            $('.picture_list').css('grid-template-rows', '33.33%');
            $('.picture_list').css('grid-auto-rows', '33.33%');
            $('.client_options_container').css('display', 'none');
            $('.project_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 1fr');
            $('.profile_img_current').css('filter', 'blur(0px)');
        }
    }));
}

function project_options_toggle() {
    $('.project_toggle').on( "click", ( event => {
        event.preventDefault();
        $('.project_toggle').toggleClass('clicked');
        $('.profile_img_current').removeClass('clicked');
        if ($('.project_toggle').hasClass('clicked')) {
            $('.main_display').css('display', 'none');
            $('.project_options_container').css('display', 'grid');
            $('.client_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr');
            $('.profile_img_current').css('filter', 'blur(0px)');
            $('.project_toggle').css('filter', 'blur(2px)');
        } else {
            $('.main_display').css('display', 'grid');
            $('.main_display').css('grid-column', '1 / 3');
            $('.picture_list').css('grid-template-columns', '1fr 1fr 1fr');
            $('.picture_list').css('grid-template-rows', '33.33%');
            $('.picture_list').css('grid-auto-rows', '33.33%');
            $('.project_options_container').css('display', 'none');
            $('.client_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 1fr');
            $('.project_toggle').css('filter', 'blur(0px)');
        }
    }));
}

function room_to_pic_toggle() {
    $('.project_options_container').on( "click", ".room_name", ( event => {
        event.preventDefault();
        $('.project_toggle').toggleClass('clicked');
        $('.profile_img_current').removeClass('clicked');
        if ($('.project_toggle').hasClass('clicked')) {
            $('.main_display').css('display', 'none');
            $('.project_options_container').css('display', 'grid');
            $('.client_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr');
            $('.profile_img_current').css('filter', 'blur(0px)');
            $('.project_toggle').css('filter', 'blur(2px)');
        } else {
            $('.main_display').css('display', 'grid');
            $('.main_display').css('grid-column', '1 / 3');
            $('.picture_list').css('grid-template-columns', '1fr 1fr 1fr');
            $('.picture_list').css('grid-template-rows', '33.33%');
            $('.picture_list').css('grid-auto-rows', '33.33%');
            $('.project_options_container').css('display', 'none');
            $('.client_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 1fr');
            $('.project_toggle').css('filter', 'blur(0px)');
        }
    }));
}

function home_button_toggle() {
    $('.home_button').on( "click", ( event => {
        home_selected()
    }));
}

function room_button_toggle() {
    $('.room_button').on( "click", ( event => {
        event.preventDefault();
        room_selected();
    }));
}

function room_selected() {
    $('.room_button').css('background-color', 'white');
    $('.home_button').css('background-color', 'transparent');
    if ($('.sub_project_list').hasClass('selected')) {
        $('.project_list').removeClass('selected');
    } else {
        $('.sub_project_list').addClass('selected');
        $('.project_list').removeClass('selected');
    }
}

function home_selected() {
    $('.home_button').css('background-color', 'white');
    $('.room_button').css('background-color', 'transparent');
    event.preventDefault();
    if ($('.project_list').hasClass('selected')) {
        $('.sub_project_list').removeClass('selected');
    } else {
        $('.project_list').addClass('selected');
        $('.sub_project_list').removeClass('selected');
    }
}

function client_list_options_beta_alert() {
    $('.client_options').on('click', ( event => {
        event.preventDefault();
        if ($(event.currentTarget).text().trim() !== 'Projects') {
            alert(`Sorry! We are still in beta version... Only the "Projects" option is currently available.`);
        }
    }));
}

/**/
function drag_and_drop_image_upload() {
    $("#drop-container").on('dragenter', function(e) {
        e.preventDefault();
        $(this).css('border', '#39b311 2px dashed');
        $(this).css('background', '#f1ffef');
    });

    $("#drop-container").on('dragover', function(e) {
        e.preventDefault();
    });

    $("#drop-container").on('drop', function(e) {
        $(this).css('border', '#07c6f1 2px dashed');
        $(this).css('background', '#FFF');
        e.preventDefault();
        let image = e.originalEvent.dataTransfer.files;
        createFormData(image);
        console.log(image);
    });
};


function createFormData(image) {
	let formImage = new FormData();
    formImage.append('dropImage', image[0]);
	uploadFormData(formImage);
}

function uploadFormData(formData) {
        let bodyRequest = { imgUrl: formData };
    $.ajax({
        url: client_post_sub_project_picture_url,
        type: "POST",
        data: JSON.stringify(bodyRequest),
        contentType: false,
        cache: false,
        processData: false,
        success: function(response){
            var imagePreview = $(".drop-image").clone();
            imagePreview.attr("src", response); 
            imagePreview.removeClass("drop-image");
            imagePreview.addClass("preview");
            $('#drop-container').append(imagePreview);
        }
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


//Run All Functions//
function run_all_functions() {
    display_js_functions();
    initial_mvp_page_load();
    selector_functions();
    add_functions();
    delete_functions();
    put_functions();
    drag_and_drop_image_upload();
}

run_all_functions();