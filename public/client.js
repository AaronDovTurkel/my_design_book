'use strict';

//Intital mvp Client Home Page load//

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
            initial_place_projects(account_data, account_data.projects.length);
            initial_place_profile_name(account_data);
            initial_place_profile_img(account_data);
            selector_place_sub_projects(account_data);
            selector_place_sub_project_pictures(account_data);
            return account_data;
        })
        .then(temporary_storage => {
            console.log(`doSomethingElse works! ${temporary_storage}`);
            return temporary_storage
        })
        .then(formattedData => {
            //$.('#output-div').html(formattedData);
        })
        .catch(err => {
            console.log(err);
        });
}

function initial_place_projects(account_dataArg, number_of_projectsArg) {
    for (let i = 0; i < number_of_projectsArg; i++) {
        console.log(`place_project worked ${i + 1} time(s).`);
        if (i == number_of_projectsArg - 1) {
            $('.project_container').prepend(
                `<article class="project_card unique_project_card">
                                
                    <div class="project_card__description">
                        <p>${account_dataArg.projects[i].projectTitle}</p>
                    </div>
    
                </article>`
            );
            store_project_id(account_dataArg.projects[i].projectTitle)
        } else {
            $('.project_container').prepend(
                `<article class="project_card unique_project_card">
                                
                    <div class="project_card__description">
                        <p>${account_dataArg.projects[i].projectTitle}</p>
                    </div>
    
                </article>`
            );
        }
    }
}

//find ids's
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

function initial_place_profile_name(account_dataArg) {
    $('.profile_name').html(
        `<p>${account_dataArg.name.firstName} ${account_dataArg.name.lastName}</p>`
    );
}

function initial_place_profile_img(account_dataArg) {
    $('.profile_img').html(
        `<img class="profile_img_current" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="No Img">`
    );
}

//GET (selector) functions//

function selector_functions() {
    select_project();
    select_sub_project();
}

function project_class_toggle(x, y) {
    const target_card = $(x);
    const other_cards = $(y).not(target_card);

    other_cards.removeClass('project_card-checked');
    target_card.toggleClass('project_card-checked');
}

function sub_project_class_toggle(x, y) {
    const target_card = $(x);
    const other_cards = $(y).not(target_card);

    other_cards.removeClass('sub_project_card-checked');
    target_card.toggleClass('sub_project_card-checked');
}

function select_project() {
    $('.project_container').on( "click", ".unique_project_card", ( event => {
        event.preventDefault();	
        let selected_project = $(event.currentTarget).text().trim();
        $.getJSON(client_home_url)
            .then(current_account_store => {
                console.log(current_account_store);
                for (let i = 0; i < current_account_store.projects.length; i++) {
                    if (current_account_store.projects[i].projectTitle == selected_project) {
                        console.log(`Loading subProjects for ${current_account_store.projects[i].projectTitle}`);
                        selected_storage.project = i;
                        selected_storage.subProject = (current_account_store.projects[selected_storage.project].subProjects.length) - 1;
                        console.log(selected_storage.project);
                        project_class_toggle(event.currentTarget, '.project_card');
                        selector_place_sub_projects(current_account_store);
                        selector_place_sub_project_pictures(current_account_store);
                        store_project_id(current_account_store.projects[i].projectTitle);
                    } else {
                        console.log(`${selected_project} is not in ${current_account_store.projects[i].projectTitle}`);
                    }
                }
            });
    }));
}

function select_sub_project() {
    $('.sub_project_container').on( "click", ".unique_sub_project_card", ( event => {
        event.preventDefault();
        sub_project_class_toggle(event.currentTarget, ".sub_project_card");
        $.getJSON(client_home_url)
            .then(current_account_store => {
                console.log(current_account_store);
                let selected_sub_project = $(event.currentTarget).text().trim();
                for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
                    if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                        console.log(`Loading subProjectsPictures for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                        selected_storage.subProject = i;
                        sub_project_class_toggle(event.currentTarget, '.sub_project_card');
                        selector_place_sub_project_pictures(current_account_store, selected_storage.project);
                        store_sub_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                    } else {
                        console.log(`${selected_sub_project} is not in ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                    }
                }
            });
    }));
}

function selector_place_sub_projects(account_dataArg) {
    selector_clear_sub_projects();
    for (let i = 0; i < account_dataArg.projects[selected_storage.project].subProjects.length; i++) {
        console.log(`place_sub_project worked ${i + 1} time(s).`);
        if (i == account_dataArg.projects[selected_storage.project].subProjects.length - 1) {
            $('.sub_project_container').prepend(
                `<article class="sub_project_card unique_sub_project_card most_recent_sub_project">
                            
                    <div class="project_card__description">
                        <p>${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                    </div>
        
                </article>`
            );
            store_sub_project_id(account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle);
        } else {
            $('.sub_project_container').prepend(
                `<article class="sub_project_card unique_sub_project_card">
                            
                    <div class="project_card__description">
                        <p>${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                    </div>
        
                </article>`
            );
        }
    }
}

function selector_place_sub_project_pictures(account_dataArg) {
    selector_clear_sub_project_pictures();
    for (let i = 0; i < account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
        console.log(`place_sub_project_pictures worked ${i + 1} time(s).`);
        if (i == account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length - 1) {
            $('.sub_project_picture_container').prepend(
                `<article class="sub_project_picture_card unique_sub_project_picture_card">
                    <header class="card__title">
                        <p>${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureTitle}</p>
                    </header>
                    <figure class="card__thumbnail">
                        <img src="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].imgUrl} alt="Smiley face"">
                    </figure>
                </article>`
            );
            store_sub_project_picture_id(account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureTitle);
        } else {
            $('.sub_project_picture_container').prepend(
                `<article class="sub_project_picture_card unique_sub_project_picture_card">
                    <header class="card__title">
                        <p>${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].pictureTitle}</p>
                    </header>
                    <figure class="card__thumbnail">
                        <img src="${account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures[i].imgUrl} alt="Smiley face"">
                    </figure>
                </article>`
            );
        }
        
    }
}

function selector_clear_projects() {
    $('Article.unique_project_card').remove();
}

function selector_clear_sub_projects() {
    $('Article.unique_sub_project_card').remove();
}

function selector_clear_sub_project_pictures() {
    $('Article.unique_sub_project_picture_card').remove();
}

function clear_all() {
    selector_clear_projects();
    selector_clear_sub_projects();
    selector_clear_sub_project_pictures();
}

function refresh_page() {
    clear_all();
    initial_mvp_page_load();
}


//POST (add) functions  //

function add_functions() {
    new_project_toggle();
    new_sub_project_toggle();
    new_sub_project_picture_toggle();
}

// new project add functions
function new_project_toggle() {
    $('.project_container').on( "click", ".project-add_button", ( event => {
        event.preventDefault();
        new_project_submition_form();
        new_project_submition();
        new_project_back_toggle();
    }));
}

function new_project_submition_form() {
    $('.project-add_button').css("display", "none");
    $('.project-add_submition').css("display", "grid");
    $('.project-add_submition').html(
        `<label for="project_title">Project Title:</label>

        <input type="text" id="project_title" name="project_title" required minlength="1" maxlength="25">
        
        <input type="submit" class="project_submition_button">
        <input type="button" value="Back" class="project_back_button">`
    );
}

function new_project_back_toggle() {
    $('.project_container').on( "click", ".project_back_button", ( event => {
        event.preventDefault();
        $('.project-add_button').css("display", "grid");
        $('.project-add_submition').css("display", "none");
    }));
}

function new_project_submition() {
    $('.project_container').on( "click", ".project_submition_button", ( event => {
        event.preventDefault();	
        console.log(`this clicked`);
        let new_project_title = $('#project_title').val();
        $('#project_title').val('');
        new_project_ajax_post(new_project_title);
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
        clear_all();
        $('.project-add_button').css("display", "grid");
        $('.project-add_submition').css("display", "none");
        return results;
    })
    .then(results => {
        console.log(results);
        initial_mvp_page_load();
    });
}

// new sub_project add functions
function new_sub_project_toggle() {
    $('.sub_project_container').on( "click", ".sub_project-add_button", ( event => {
        event.preventDefault();
        new_sub_project_submition_form();
        new_sub_project_submition();
        new_sub_project_back_toggle();
    }));
}

function new_sub_project_submition_form() {
    $('.sub_project-add_button').css("display", "none");
    $('.sub_project-add_submition').css("display", "grid");
    $('.sub_project-add_submition').html(
        `<label for="sub_project_title">Sub-project Title:</label>

        <input type="text" id="sub_project_title" name="sub_project_title" required minlength="1" maxlength="25">
        
        <input type="submit" class="sub_project_submition_button">
        <input type="button" value="Back" class="sub_project_back_button">`
    );
}

function new_sub_project_back_toggle() {
    $('.sub_project_container').on( "click", ".sub_project_back_button", ( event => {
        event.preventDefault();
        $('.sub_project-add_button').css("display", "grid");
        $('.sub_project-add_submition').css("display", "none");
    }));
}

function new_sub_project_submition() {
    $('.sub_project_container').on( "click", ".sub_project_submition_button", ( event => {
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
        selector_clear_sub_projects();
        selector_clear_sub_project_pictures();
        $('.sub_project-add_button').css("display", "grid");
        $('.sub_project-add_submition').css("display", "none");
        sub_project_load(x);
        return results;
    })
    .then(results => {
        console.log(results);
        sub_project_load(x);
    });
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
                    console.log(selected_storage.project);
                    selector_place_sub_projects(current_account_store);
                    selector_place_sub_project_pictures(current_account_store);
                    store_project_id(current_account_store.projects[i].projectTitle);
                } else {
                    console.log(`${selected_project} is not in ${current_account_store.projects[i].projectTitle}`);
                }
            }
        });
}

// new sub_project_picture add functions
function new_sub_project_picture_toggle() {
    $('.sub_project_picture_container').on( "click", ".sub_project_picture-add_button", ( event => {
        event.preventDefault();
        new_sub_project_picture_submition_form();
        new_sub_project_picture_submition();
        new_sub_project_picture_back_toggle();
    }));
}

function new_sub_project_picture_submition_form() {
    $('.sub_project_picture-add_button').css("display", "none");
    $('.sub_project_picture-add_submition').css("display", "grid");
    $('.sub_project_picture-add_submition').html(
        `<label for="sub_project_picture_title">Sub-project_picture Title:</label>

        <input type="text" id="sub_project_picture_title" name="sub_project_picture_title" required minlength="1" maxlength="25">

        <label for="sub_project_picture_url">Sub-project_picture Url:</label>

        <input type="text" id="sub_project_picture_url" name="sub_project_picture_url" required minlength="1" maxlength="25">
        
        <input type="submit" class="sub_project_picture_submition_button">
        <input type="button" value="Back" class="sub_project_picture_back_button">`
    );
}

function new_sub_project_picture_back_toggle() {
    $('.sub_project_picture_container').on( "click", ".sub_project_picture_back_button", ( event => {
        event.preventDefault();
        $('.sub_project_picture-add_button').css("display", "grid");
        $('.sub_project_picture-add_submition').css("display", "none");
    }));
}

function new_sub_project_picture_submition() {
    $('.sub_project_picture_container').on( "click", ".sub_project_picture_submition_button", ( event => {
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
        selector_clear_sub_project_pictures();
        sub_project_picture_load(x);
        $('.sub_project_picture-add_button').css("display", "grid");
        $('.sub_project_picture-add_submition').css("display", "none");
        return results;
    })
    .then(results => {
        console.log(results);
        sub_project_picture_load(x);
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
                    selector_place_sub_project_pictures(current_account_store);
                    store_project_id(current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle);
                } else {
                    console.log(`${selected_sub_project} is not in ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                }
            }
        });
}



// //

function run_all_functions() {
    initial_mvp_page_load();
    selector_functions();
    add_functions();
}

run_all_functions();