'use strict';

//Intital mvp Client Home Page//

// url finder independant of domain name
function change_url(pathArg) {
    let url = 'https://afternoon-cove-68012.herokuapp.com/';
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

//MouseDown & Click Timers

let timeoutId = 0;
let held_toggle = false;

// static client_page for mvp (will have log in page that will change id)
const mvp_static_account_id = `5c6e29146667000017fde5a8`;
const client_home_url = change_url(`client_pages/${mvp_static_account_id}`);
const client_post_project_url = change_url(`client_pages/project/${mvp_static_account_id}`);
let client_post_sub_project_url = '';
let client_post_sub_project_picture_url = '';
let client_delete_project_url = '';
let client_delete_sub_project_url = '';
let client_delete_sub_project_picture_url = '';
let client_edit_project_url = '';
let client_edit_sub_project_url = '';


// initial page load // 
function initial_mvp_page_load() {
    $.getJSON(client_home_url)
        .then(account_data => {
            selected_storage.project = (account_data.projects.length) - 1;
            selected_storage.subProject = (account_data.projects[`${selected_storage.project}`].subProjects.length) - 1;
            place_projects(account_data, account_data.projects.length);
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
                    client_post_sub_project_picture_url = change_url(`client_pages/subProjectPicture/${selected_storage.subProjectId}`);
                }
            }
        });
}
        

function store_sub_project_picture_id(subProjectPictureIdArg) {
    $.getJSON(client_home_url)
        .then(account_data => {
            for (let i = 0; i < account_data.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
                if (subProjectPictureIdArg == account_data.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i]._id) {
                    selected_storage.subProjectPictureId = account_data.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i]._id;
                    selected_storage.subProjectPictureTitle = subProjectPictureIdArg;
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

function place_projects(account_dataArg, number_of_projectsArg) {
    for (let i = 0; i < number_of_projectsArg; i++) {
        if (i == number_of_projectsArg - 1) {
            $('.project_list').prepend(
                `<li class="project_card unique_project_card ${account_dataArg.projects[i].projectTitle}">
                    <input class="project_edit" type="button" value="x">
                    <p>${account_dataArg.projects[i].projectTitle}</p>
                </li>`
            );
            store_project_id(account_dataArg.projects[i].projectTitle);
            place_current_home(account_dataArg.projects[i].projectTitle);
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
                    <p>${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                </li>`
            );
            store_sub_project_id(account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle);
            place_current_room(account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle);
        } else {
            $('.sub_project_list').prepend(
                `<li class="sub_project_card unique_sub_project_card">
                    <input class="sub_project_edit" type="button" value="x">
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
                `<li class="picture_card unique_picture_card" id="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureDate}">
                    <input class="sub_project_picture_edit" type="button" value="x">
                    <img class="list_img" src="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].imgUrl} alt="image not loading..." />
                </li>`
            );
            store_sub_project_picture_id(account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i]._id);
        } else {
            $('.picture_list').prepend(
                `<li class="picture_card unique_picture_card" id="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureDate}">
                    <input class="sub_project_picture_edit" type="button" value="x">
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
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.project_list').on( "click", ".unique_project_card > p", ( event => {
            event.preventDefault();
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
                            place_current_home(current_account_store.projects[i].projectTitle);
                        }
                    }
                });
        }));
    } else {
        $('.project_list').on( "touchend", ".unique_project_card > p", ( event => {
            event.preventDefault();
            if (held_toggle === false) {
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
                                place_current_home(current_account_store.projects[i].projectTitle);
                            }
                        }
                    });
            }
        }))
    }
    
}

function select_sub_project() {
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.sub_project_list').on( "click", ".unique_sub_project_card > p", ( event => {
            event.preventDefault();
            let selected_sub_project = $(event.currentTarget).text().trim();
            $.getJSON(client_home_url)
                .then(current_account_store => {
                    for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                        if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                            console.log(`Loading subProjectsPictures for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                            selected_storage.subProject = i;
                            place_sub_project_pictures(current_account_store, selected_storage.project);
                            store_sub_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                            place_current_room(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                        }
                    }
                });
        }));
    } else {
        $('.sub_project_list').on( "touchend", ".unique_sub_project_card > p", ( event => {
            event.preventDefault();
            if (held_toggle === false) {
                let selected_sub_project = $(event.currentTarget).text().trim();
                $.getJSON(client_home_url)
                    .then(current_account_store => {
                        for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                            if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                                console.log(`Loading subProjectsPictures for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                                selected_storage.subProject = i;
                                place_sub_project_pictures(current_account_store, selected_storage.project);
                                store_sub_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                                place_current_room(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                                mobile_select_sub_project();
                            }
                        }
                    });
            }
        }));
    }
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
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.project_options_container').css("display", "none");
        $('.form_container').css("display", "grid");
        $('.add_submition').css("display", "grid");
        render_new_project_form()
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    } else {
        $('.form_container').css('display', 'grid');
        $('.form_container').css('grid-row', '1 / 3');
        $('.form_container').css('grid-column', '1 / 2');
        $('.client_options_container').css('display', 'none');
        $('.main_display').css('display', 'none');
        $('.project_options_container').css("display", "none");
        $('.add_submition').css("display", "grid");
        render_new_project_form();
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    }

}

function render_new_project_form() {
    $('.add_submition').html(
        `<label class="form_label" for="project_title">Home Title</label>

        <input class="form_text" type="text" id="project_title" name="project_title" required minlength="1">
        
        <input type="button" value="Submit" class="project_submition_button add_submition_button">
        <input type="button" value="Back" class="project_back_button add_submition_back">`
    );
}


function new_project_submition() {
    $('.add_submition').on( "click", ".project_submition_button", ( event => {
        event.preventDefault();
        let new_project_title = $('#project_title').val();
        $('#project_title').val('');
        new_project_ajax_post(new_project_title);
    }));
}

function new_project_back_toggle() {
    $('.add_submition').on( "click", ".add_submition_back", ( event => {
        event.preventDefault();
        if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
            $('.project_options_container').css("display", "grid");
            $('.form_container').css("display", "none");
            $('.add_submition').css("display", "none");
            $('.project_toggle').css("pointer-events", "auto");
            $('.profile_img').css("pointer-events", "auto");
            $('.add_submition').html('');
        } else {
            $('.form_container').css('display', 'none');
            $('.client_options_container').css('display', 'none');
            $('.main_display').css('display', 'none');
            $('.project_options_container').css("display", "grid");
            $('.add_submition').css("display", "none");
            $('.project_toggle').css("pointer-events", "auto");
            $('.profile_img').css("pointer-events", "auto");
            $('.add_submition').html('');
        }
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
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
        $('.project_options_container').css("display", "grid");
        $('.form_container').css("display", "none");
        $('.add_submition').css("display", "none");
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        $('.add_submition').html('');
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
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.project_options_container').css("display", "none");
        $('.form_container').css("display", "grid");
        $('.add_submition').css("display", "grid");
        render_new_sub_project_form()
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    } else {
        $('.form_container').css('display', 'grid');
        $('.form_container').css('grid-row', '1 / 3');
        $('.form_container').css('grid-column', '1 / 2');
        $('.client_options_container').css('display', 'none');
        $('.main_display').css('display', 'none');
        $('.project_options_container').css("display", "none");
        $('.add_submition').css("display", "grid");
        render_new_sub_project_form();
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    }
}

function render_new_sub_project_form() {
    $('.add_submition').html(
        `<label class="form_label" for="sub_project_title">Room Title</label>

        <input class="form_text" type="text" id="sub_project_title" name="sub_project_title" required minlength="1">
        
        <input type="button" value="Submit" class="sub_project_submition_button add_submition_button">
        <input type="button" value="Back" class="sub_project_back_button add_submition_back">`
    );
}

function new_sub_project_submition() {
    $('.add_submition').on( "click", ".sub_project_submition_button", ( event => {
        event.preventDefault();	
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
    $('.add_submition').on( "click", ".sub_project_back_button", ( event => {
        event.preventDefault();
        if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
            $('.project_options_container').css("display", "grid");
            $('.form_container').css("display", "none");
            $('.add_submition').css("display", "none");
            $('.project_toggle').css("pointer-events", "auto");
            $('.profile_img').css("pointer-events", "auto");
            $('.add_submition').html('');
        } else {
            $('.form_container').css('display', 'none');
            $('.client_options_container').css('display', 'none');
            $('.main_display').css('display', 'none');
            $('.project_options_container').css("display", "grid");
            $('.add_submition').css("display", "none");
            $('.project_toggle').css("pointer-events", "auto");
            $('.profile_img').css("pointer-events", "auto");
            $('.add_submition').html('');
        }
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
                    place_sub_projects(current_account_store);
                    place_sub_project_pictures(current_account_store);
                    store_project_id(current_account_store.projects[i].projectTitle);
                }
            }
        });
}

function sub_project_picture_load() {
    $.getJSON(client_home_url)
        .then(current_account_store => {
            for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
            
                    console.log(`Loading subProjectsPictures for ${current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].subProjectTitle}`);
                    place_sub_project_pictures(current_account_store);
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
        clear_sub_projects();
        clear_sub_project_pictures();
        $('.project_options_container').css("display", "grid");
        $('.form_container').css("display", "none");
        $('.add_submition').css("display", "none");
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        $('.add_submition').html('');
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
    $('.add_img_submition').css("display", "grid");
}

function new_sub_project_picture_back_toggle() {
    $('.add_img_submition').on( "click", ".img_url_back", ( event => {
        event.preventDefault();
        $('.add_button').css("display", "grid");
        $('.add_img_submition').css("display", "none");
    }));
}

function new_sub_project_picture_submition() {
    $('.add_img_submition').on( "click", ".add_submition_button", ( event => {
        event.preventDefault();	
        let new_sub_project_picture_url = $('#img_url').val();
        $('#img_url').val('');
        if (new_sub_project_picture_url !== '') {
            new_sub_project_picture_ajax_post(new_sub_project_picture_url);
        } else {
            alert(`Error. Something went wrong. Please try again.`);
        }
    }));
}

function new_sub_project_picture_ajax_post(y) {
    let bodyRequest = { imgUrl: y };
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
        $('.add_img_submition').css("display", "none");
        return results;
    })
    .then(results => {
        sub_project_picture_load();
    });
}

function sub_project_picture_load() {
    let selected_sub_project = selected_storage.subProjectTitle;
    $.getJSON(client_home_url)
        .then(current_account_store => {
            for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                    console.log(`Loading subProjectsPicture for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                    selected_storage.subProject = i;
                    selected_storage.subProjectPicture = (current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length) - 1;
                    place_sub_project_pictures(current_account_store);
                    store_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
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
    delete_sub_project_picture_toggle();
}

// DELETE Project functions
function delete_project_toggle() {
    $('main').on('click', ".project_edit", ( event => {
        event.preventDefault();
        selected_storage.selected_project_for_deletion = $(event.currentTarget).siblings().text().trim();
        verify_delete_project_display_toggle(selected_storage.selected_project_for_deletion);
    }));
}

function verify_delete_project_display_toggle(homeArg) {
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.project_options_container').css("display", "none");
        $('.form_container').css("display", "grid");
        $('.delete_form').css("display", "grid");
        $('.delete_form').html(
            `<label class="delete_label" for="verify_delete_project">Are you sure you want to delete "${homeArg}"?</label>
                        
            <input type="button" class="verify_delete_project delete delete_project" id="verify_delete_project" value="Yes">
            
            <input type="button" class="verify_delete_project keep keep_project" id="verify_delete_project" value="No">`
        );
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    } else {
        $('.form_container').css('display', 'grid');
        $('.form_container').css('grid-row', '1 / 3');
        $('.form_container').css('grid-column', '1 / 2');
        $('.client_options_container').css('display', 'none');
        $('.main_display').css('display', 'none');
        $('.project_options_container').css("display", "none");
        $('.delete_form').css("display", "grid");
        $('.delete_form').html(
            `<label class="delete_label" for="verify_delete_project">Are you sure you want to delete "${homeArg}"?</label>
                        
            <input type="button" class="verify_delete_project delete delete_project" id="verify_delete_project" value="Yes">
            
            <input type="button" class="verify_delete_project keep keep_project" id="verify_delete_project" value="No">`
        );
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    }
}

function verify_delete_project_input() {
    $('main').on('click', '.delete_project', ( event => {
        event.preventDefault();
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
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
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
        console.log("device control succeeded");
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
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
        verify_delete_sub_project_display_toggle(selected_storage.selected_sub_project_for_deletion);
    }));
}

function verify_delete_sub_project_display_toggle(roomArg) {
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.project_options_container').css("display", "none");
        $('.form_container').css("display", "grid");
        $('.delete_form').css("display", "grid");
        $('.delete_form').html(
            `<label class="delete_label" for="verify_delete_sub_project">Are you sure you want to delete ${roomArg}?</label>
                        
            <input type="button" class="verify_delete_sub_project delete delete_sub_project" id="verify_delete_sub_project" value="Yes">
            
            <input type="button" class="verify_delete_sub_project keep keep_sub_project" id="verify_delete_sub_project" value="No">`
        )
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    } else {
        $('.form_container').css('display', 'grid');
        $('.form_container').css('grid-row', '1 / 3');
        $('.form_container').css('grid-column', '1 / 2');
        $('.client_options_container').css('display', 'none');
        $('.main_display').css('display', 'none');
        $('.project_options_container').css("display", "none");
        $('.delete_form').css("display", "grid");
        $('.delete_form').html(
            `<label class="delete_label" for="verify_delete_sub_project">Are you sure you want to delete ${roomArg}?</label>
                        
            <input type="button" class="verify_delete_sub_project delete delete_sub_project" id="verify_delete_sub_project" value="Yes">
            
            <input type="button" class="verify_delete_sub_project keep keep_sub_project" id="verify_delete_sub_project" value="No">`
        )
        $('.project_toggle').css("pointer-events", "none");
        $('.profile_img').css("pointer-events", "none");
    }
}

function verify_delete_sub_project_input() {
    $('main').on('click', '.delete_sub_project', ( event => {
        event.preventDefault();
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
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.delete_form').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
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
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        selected_storage.selected_project_for_deletion = '';
    })
    .catch(err => {
        console.log(err);
    });
}


// DELETE Sub-Project-Picture functions
function delete_sub_project_picture_toggle() {
    $('main').on('click', ".sub_project_picture_edit", ( event => {
        event.preventDefault();
        let selected_picture = $(event.currentTarget).parent().attr('id');
        $.getJSON(client_home_url)
            .then(current_account_store => {
                for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
                    if (selected_picture == current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureDate) {
                        selected_storage.subProjectPictureId = current_account_store.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i]._id;
                        console.log(selected_storage.subProjectPictureId);
                    }
                };
            })
            .then(() => {
                console.log(`Deleteing ${selected_storage.selected_sub_project_for_deletion}`);
                client_delete_sub_project_picture_url = change_url(`client_pages/subProjectPicture/${selected_storage.subProjectPictureId}`);
                ajax_delete_sub_project_picture();
            });
    }));
}

function ajax_delete_sub_project_picture() {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        type: 'Delete',
        url: client_delete_sub_project_picture_url
    })
    .then(results => { 
        console.log(results);
        console.log("device control succeeded");
        clear_sub_project_pictures();
        sub_project_picture_load();
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
    edit_sub_project_title_toggle();
    edit_sub_project_title_back_toggle();
    edit_sub_project_title_submition();
}



// PUT (edit) Project functions
function edit_project_title_toggle() {
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.project_list').on( 'mousedown', ".unique_project_card > p", ( event => {
            event.preventDefault();
            timeoutId = setTimeout( () => {
                $(".unique_project_card > p").css("pointer-events", "none");
                selected_storage.selected_project_for_edit = $(event.currentTarget).text().trim();
                $('.project_options_container').css('display', 'none');
                $('.form_container').css('display', 'grid');
                $('.edit_submition').css('display', 'grid');
                $('.edit_submition').html(
                    `<label class="form_edit_label" for="new_project_title">New Room Title</label>
            
                    <input class="form_edit_text" type="text" id="new_project_title" name="new_project_title" required minlength="1">
                    
                    <input type="button" value="Submit" class="project_submition_button edit_submition_button">
                    <input type="button" value="Back" class="project_back_button edit_submition_back">`
                );
                $('.project_toggle').css("pointer-events", "none");
                $('.profile_img').css("pointer-events", "none");
                $.getJSON(client_home_url)
                    .then(current_account_store => {
                        for (let i = 0; i < current_account_store.projects.length; i++) {
                            if (current_account_store.projects[i].projectTitle == selected_storage.selected_project_for_edit) {
                                console.log(`Editing ${selected_storage.selected_project_for_edit}...`);
                                client_edit_project_url = change_url(`client_pages/project/${current_account_store.projects[i]._id}`);
                            }
                        };
                    });
            }, 500)
        })).on('mouseup mouseleave', function() {
            clearTimeout(timeoutId);
        });
    } else {
        $('.project_list').on( 'touchstart', ".unique_project_card > p", ( event => {
            event.preventDefault();
            timeoutId = setTimeout( () => {
                held_toggle = true;
                $(".unique_project_card > p").css("pointer-events", "none");
                selected_storage.selected_project_for_edit = $(event.currentTarget).text().trim();
                $('.project_options_container').css('display', 'none');
                $('.edit_submition').css('display', 'grid');
                $('.form_container').css('display', 'grid');
                $('.form_container').css('grid-row', '1 / 3');
                $('.form_container').css('grid-column', '1 / 2');
                $('.client_options_container').css('display', 'none');
                $('.main_display').css('display', 'none');
                $('.project_options_container').css("display", "none");
                $('.edit_submition').html(
                    `<label class="form_edit_label" for="new_project_title">New Room Title</label>
            
                    <input class="form_edit_text" type="text" id="new_project_title" name="new_project_title" required minlength="1">
                    
                    <input type="button" value="Submit" class="project_submition_button edit_submition_button">
                    <input type="button" value="Back" class="project_back_button edit_submition_back">`
                );
                $('.project_toggle').css("pointer-events", "none");
                $('.profile_img').css("pointer-events", "none");
                $.getJSON(client_home_url)
                    .then(current_account_store => {
                        for (let i = 0; i < current_account_store.projects.length; i++) {
                            if (current_account_store.projects[i].projectTitle == selected_storage.selected_project_for_edit) {
                                console.log(`Editing ${selected_storage.selected_project_for_edit}...`);
                                client_edit_project_url = change_url(`client_pages/project/${current_account_store.projects[i]._id}`);
                            }
                        };
                    });
            }, 500)
        })).on('touchend', function() {
            clearTimeout(timeoutId);
            held_toggle = false;
        });
    }
    
}

function edit_project_title_back_toggle() {
    $('main').on('click', '.edit_submition_back', ( event => {
        event.preventDefault();
        $(".unique_project_card > p").css("pointer-events", "auto");
        selected_storage.selected_project_for_edit = '';
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.edit_submition').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
    }));
}

function edit_project_title_submition() {
    $('main').on('click', '.edit_submition_button', ( event => {
        event.preventDefault();
        let new_project_title = $('#new_project_title').val();
        $('#new_project_title').val('');
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
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.edit_submition').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        clear_projects();
        clear_sub_projects();
        clear_sub_project_pictures();
        initial_mvp_page_load();
    })
    .catch(err => {
        console.log(err);
    });
}

// PUT (edit) Sub-Project functions
function edit_sub_project_title_toggle() {
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        $('.sub_project_list').on( 'mousedown', ".unique_sub_project_card > p", ( event => {
            event.preventDefault();
            timeoutId = setTimeout( () => {
                $(".unique_sub_project_card > p").css("pointer-events", "none");
                selected_storage.selected_sub_project_for_edit = $(event.currentTarget).text().trim();
                $('.project_options_container').css('display', 'none');
                $('.form_container').css('display', 'grid');
                $('.edit_submition').css('display', 'grid');
                $('.edit_submition').html(
                    `<label class="form_edit_label" for="new_sub_project_title">New Room Title</label>
            
                    <input class="form_edit_text" type="text" id="new_sub_project_title" name="new_sub_project_title" required minlength="1">
                    
                    <input type="button" value="Submit" class="sub_project_submition_button edit_submition_button">
                    <input type="button" value="Back" class="sub_project_back_button edit_submition_back">`
                );
                $.getJSON(client_home_url)
                    .then(current_account_store => { 
                        for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                            if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_storage.selected_sub_project_for_edit) {
                                console.log(`Editing ${selected_storage.selected_sub_project_for_edit}...`);
                                client_edit_sub_project_url = change_url(`client_pages/subProjectTitle/${current_account_store.projects[selected_storage.project].subProjects[i]._id}`);
                            }
                        };
                    });
            }, 500)
        })).on('mouseup mouseleave', function() {
            clearTimeout(timeoutId);
        })
    } else {
        $('.sub_project_list').on( 'touchstart', ".unique_sub_project_card > p", ( event => {
            event.preventDefault();
            timeoutId = setTimeout( () => {
                held_toggle = true;
                $(".unique_sub_project_card > p").css("pointer-events", "none");
                selected_storage.selected_sub_project_for_edit = $(event.currentTarget).text().trim();
                $('.project_options_container').css('display', 'none');
                $('.edit_submition').css('display', 'grid');
                $('.form_container').css('display', 'grid');
                $('.form_container').css('grid-row', '1 / 3');
                $('.form_container').css('grid-column', '1 / 2');
                $('.client_options_container').css('display', 'none');
                $('.main_display').css('display', 'none');
                $('.project_options_container').css("display", "none");
                $('.edit_submition').html(
                    `<label class="form_edit_label" for="new_sub_project_title">New Room Title</label>
            
                    <input class="form_edit_text" type="text" id="new_sub_project_title" name="new_sub_project_title" required minlength="1">
                    
                    <input type="button" value="Submit" class="sub_project_submition_button edit_submition_button">
                    <input type="button" value="Back" class="sub_project_back_button edit_submition_back">`
                );
                $('.project_toggle').css("pointer-events", "none");
                $('.profile_img').css("pointer-events", "none");
                $.getJSON(client_home_url)
                    .then(current_account_store => { 
                        for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                            if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_storage.selected_sub_project_for_edit) {
                                console.log(`Editing ${selected_storage.selected_sub_project_for_edit}...`);
                                client_edit_sub_project_url = change_url(`client_pages/subProjectTitle/${current_account_store.projects[selected_storage.project].subProjects[i]._id}`);
                            }
                        };
                    });
            }, 500)
        })).on('touchend', function() {
            clearTimeout(timeoutId);
            held_toggle = false;
        })
    }
    
}

function edit_sub_project_title_back_toggle() {
    $('main').on('click', '.sub_project_back_button', ( event => {
        event.preventDefault();
        $(".unique_sub_project_card > p").css("pointer-events", "auto");
        selected_storage.selected_sub_project_for_edit = '';
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.edit_submition').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        clear_sub_projects();
        clear_sub_project_pictures();
        sub_project_load();
    }));
}

function edit_sub_project_title_submition() {
    $('main').on('click', '.sub_project_submition_button', ( event => {
        event.preventDefault();
        let new_sub_project_title = $('#new_sub_project_title').val();
        $('#new_sub_project_title').val('');
        ajax_edit_sub_project(new_sub_project_title);
    }));
}

function ajax_edit_sub_project(newSubProjectTitleArg) {
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify({ subProjectTitle: newSubProjectTitleArg}),
        dataType: 'json',
        processData: false,
        type: 'Put',
        url: client_edit_sub_project_url
    })
    .then(results => { 
        console.log(results);
        console.log("device control succeeded");
        selected_storage.selected_sub_project_for_deletion = '';
        $(".unique_sub_project_card > p").css("pointer-events", "auto");
        $('.project_options_container').css('display', 'grid');
        $('.form_container').css('display', 'none');
        $('.edit_submition').css('display', 'none');
        $('.project_toggle').css("pointer-events", "auto");
        $('.profile_img').css("pointer-events", "auto");
        clear_sub_projects();
        clear_sub_project_pictures();
        sub_project_load();
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
    client_list_options_beta_alert();
    info_box();

}

function place_current_home(homeArg) {
    $('.current_home').html(
        `${homeArg}`
    );
}

function place_current_room(roomArg) {
    $('.current_room').html(
        `${roomArg}`
    );
}

function client_options_toggle() {
    $('.profile_img_current').on( "click", ( event => {
        event.preventDefault();
        if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
            $('.main_display').css('display', 'grid');
            $('.main_display').css('grid-column', '2 / 3');
            $('.client_options_container').css('display', 'grid');
            $('.project_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr 8fr');
        } else {
            $('.main_display').css('display', 'grid');
            $('.main_display').css('grid-row', '2 / 3');
            $('.main_display').css('grid-column', '1 / 3');
            $('.client_options_container').css('display', 'grid');
            $('.project_options_container').css('display', 'none');
            $('main').css('grid-template-columns', '1fr');
            $('main').css('grid-template-rows', '10% 90%');
        }
    }));
}

function project_options_toggle() {
    $('.project_toggle').on( "click", ( event => {
        event.preventDefault();
        if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
            $('.project_options_container').css('display', 'grid');
            $('.client_options_container').css('display', 'none');
            $('.main_display').css('grid-column', '1 / 2');
            $('main').css('grid-template-columns', '8fr 1fr');
        } else {
            $('.project_options_container').css('display', 'grid');
            $('.project_options_container').css('grid-row', '1 / 3');
            $('.project_options_container').css('grid-column', '1 / 2');
            $('.client_options_container').css('display', 'none');
            $('.main_display').css('display', 'none');
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
    $('.room_button').css('background-color', 'rgba(0, 0, 0, .500)');
    $('.room_button').css('color', 'rgba(255, 255, 255, .500)');
    $('.room_button').css('border', '.5px solid rgba(255, 255, 255, 0.500)');
    $('.home_button').css('background-color', 'rgba(255, 255, 255, 0.500)');
    $('.home_button').css('color', 'rgba(0, 0, 0, .500)');
    $('.home_button').css('border', '.5px solid rgba(0, 0, 0, .500)');
    if ($('.sub_project_list').hasClass('selected')) {
        $('.project_list').removeClass('selected');
    } else {
        $('.sub_project_list').addClass('selected');
        $('.project_list').removeClass('selected');
    }
}

function home_selected() {
    $('.home_button').css('background-color', 'rgba(0, 0, 0, .500)');
    $('.home_button').css('color', 'rgba(255, 255, 255, .500)');
    $('.home_button').css('border', '.5px solid rgba(255, 255, 255, 0.500)');
    $('.room_button').css('background-color', 'rgba(255, 255, 255, 0.500)');
    $('.room_button').css('color', 'rgba(0, 0, 0, .500)');
    $('.room_button').css('border', '.5px solid rgba(0, 0, 0, .500)');
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

function info_box() {
    $('body').append(
        `<div class="info_box">
            <h1>My Design Book</h1>
            <p>Welcome to "My Design Book", a hub for streamlining home design for both designers and home owners alike.</p>
            <br>
            <p>At the current beta stage our app allows you to store pictures in an easy-to-use filing system. Try creating a new home; or maybe a room; and then add a couple of new pictures! (Please use open sourced images. You can try copying the images from <a href="https://unsplash.com/">here</a>).</p>
            <br>
            <p>Located at the top right of the page you will find our "list tab". From here you can select the home and room you would like to view and/or edit. Clicking on the profile image on the top left of the page will bring you back to the main image viewer. To delete a picture, home, or room: simply click on the "x" button. If you click and hold on a home or room name, you will be taken to our editing window. Just type your new name and hit "submit" to make a change.</p>
            <br>
            <p>"My Design Book" is in its humble beginnings but has lofty goals. We hope to make waves in the design world by creating a socially adept system for designers to find home owners and visa versa. Not only will this app connect people but it will also be the home base for all design needs. Whether you would like to set up a calendar, send an invoice, or store room dimensions "My Design Book" will have it all.</p>
            <br>
            <p>If you would like to learn more about this apps potential please contact <a href="mailto:theholycoder@gmail.com?Subject=Hello%20again" target="_top">The Holy Coder</a>.</p>
            <br>
            <input class="info_box_delete" type="button" value="Go to the app!">
        </div>`
    )
    info_box_delete_toggle();
}

function info_box_delete_toggle() {
    $('body').on("click", ".info_box_delete", ( event => {
        event.preventDefault();
        $('main').css('display', 'grid');
        $('.info_box').css('display', 'none');
    }))
}

//Mobile Functions//

function mobile_select_sub_project() {
    $('.main_display').css('display', 'grid');
    $('.main_display').css('grid-row', '2 / 3');
    $('.main_display').css('grid-column', '1 / 3');
    $('.client_options_container').css('display', 'grid');
    $('.project_options_container').css('display', 'none');
    $('main').css('grid-template-columns', '1fr');
    $('main').css('grid-template-rows', '10% 90%');
}


//Function to the css rule - template//
/*
function checkSize() {
    if ($(".client_options_container").css("grid-auto-flow") == "row" ) {
        console.log(`Full-Sized Functions`);
    } else {
        console.log(`Mobile Functions`);
    }
}
*/



//Run All Functions//
function run_all_functions() {
    display_js_functions();
    initial_mvp_page_load();
    selector_functions();
    add_functions();
    delete_functions();
    put_functions();
}

run_all_functions();