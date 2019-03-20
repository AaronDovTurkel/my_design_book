'use strict';

//Intital mvp Client Home Page load//

// url finder independant of domain name
function change_url(pathArg) {
    let url = window.location;
    let new_url = url + `${pathArg}`;
    return new_url;
};

// static client_page for mvp (will have log in page that will change id)
const mvp_static_account_id = `5c9038e8242d32247981b932`;
const client_home_url = change_url(`client_pages/${mvp_static_account_id}`);

let selected_storage = {
    project: 0,
    subProject: 0,
    subProjectPicture: 0
}

// current account store //


function initial_mvp_page_load() {
    $.getJSON(client_home_url)
        .then(account_data => {
                console.log(account_data);
                let number_of_projects = account_data.projects.length;
                let number_of_sub_projects = account_data.projects[`${number_of_projects - 1}`].subProjects.length;
                let number_of_sub_project_pictures = account_data.projects[`${number_of_projects - 1}`].subProjects[`${number_of_sub_projects - 1}`].pictures.length;
                console.log(number_of_projects, number_of_sub_projects, number_of_sub_project_pictures);
                initial_place_projects(account_data, number_of_projects);
                initial_place_sub_projects(account_data, number_of_projects, number_of_sub_projects);
                initial_place_sub_project_pictures(account_data, number_of_projects, number_of_sub_projects, number_of_sub_project_pictures);
                initial_place_profile_name(account_data);
                initial_place_profile_img(account_data);
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
        $('.project_container').prepend(
            `<article class="project_card unique">
                            
                <div class="project_card__description">
                    <p>${account_dataArg.projects[i].projectTitle}</p>
                </div>

            </article>`
        );
    }
}

function initial_place_sub_projects(account_dataArg, number_of_projectsArg, number_of_sub_projectsArg) {
    for (let i = 0; i < number_of_sub_projectsArg; i++) {
        console.log(`place_sub_project worked ${i + 1} time(s).`);
        $('.sub_project_container').prepend(
            `<article class="sub_project_card unique_sub_project_card">
                        
                <div class="project_card__description">
                    <p>${account_dataArg.projects[number_of_projectsArg - 1].subProjects[i].subProjectTitle}</p>
                </div>
    
            </article>`
        );
    }
}

function initial_place_sub_project_pictures(account_dataArg, number_of_projectsArg, number_of_sub_projectsArg, number_of_sub_project_picturesArg) {
    for (let i = 0; i < number_of_sub_project_picturesArg; i++) {
        console.log(`place_sub_project_pictures worked ${i + 1} time(s).`);
        $('.sub_project_picture_container').prepend(
            `<article class="sub_project_picture_card unique_sub_project_picture_card">
                <header class="card__title">
                    <p>${account_dataArg.projects[number_of_projectsArg - 1].subProjects[number_of_sub_projectsArg - 1].pictures[i].pictureTitle}</p>
                </header>
                <figure class="card__thumbnail">
                    <img src="${account_dataArg.projects[number_of_projectsArg - 1].subProjects[number_of_sub_projectsArg - 1].pictures[i].imgUrl} alt="Smiley face"">
                </figure>
            </article>`
        );
    }
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

//Selector functions//

function selector_functions() {
    $.getJSON(client_home_url)
        .then(account_data => {
            console.log(account_data);
            select_project(account_data);
            select_sub_project(account_data);
        })
        .catch(err => {
            console.log(err);
        });
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

function select_project(current_account_store) {
    $('.project_container').on( "click", ".project_card", ( event => {
        event.preventDefault();	
        let selected_project = $(event.currentTarget).text().trim();
        for (let i = 0; i < current_account_store.projects.length; i++) {
            if (current_account_store.projects[i].projectTitle == selected_project) {
                console.log(`Loading subProjects for ${current_account_store.projects[i].projectTitle}`);
                selected_storage.project = i;
                console.log(selected_storage.project);
                project_class_toggle(event.currentTarget, '.project_card');
                selector_place_sub_projects(current_account_store);
            } else {
                console.log(`${selected_project} is not in ${current_account_store.projects[i].projectTitle}`);
            }
        }
    }));
}

function select_sub_project(current_account_store) {
    $('.sub_project_container').on( "click", ".sub_project_card", ( event => {
        event.preventDefault();
        sub_project_class_toggle(event.currentTarget, ".sub_project_card");
        let selected_sub_project = $(event.currentTarget).text().trim();
        for (let i = 0; i < current_account_store.projects[selected_storage.project].subProjects.length; i++) {
            if (current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle == selected_sub_project) {
                console.log(`Loading subProjectsPictures for ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
                selected_storage.subProject = i;
                sub_project_class_toggle(event.currentTarget, '.sub_project_card');
                selector_place_sub_project_pictures(current_account_store, selected_storage.project);
            } else {
                console.log(`${selected_sub_project} is not in ${current_account_store.projects[selected_storage.project].subProjects[i].subProjectTitle}`);
            }
        }
    }));
}

function selector_place_sub_projects(account_dataArg) {
    selector_clear_sub_projects();
    for (let i = 0; i < account_dataArg.projects[selected_storage.project].subProjects.length; i++) {
        console.log(`place_sub_project worked ${i + 1} time(s).`);
        $('.sub_project_container').prepend(
            `<article class="sub_project_card unique_sub_project_card">
                        
                <div class="project_card__description">
                    <p>${account_dataArg.projects[selected_storage.project].subProjects[i].subProjectTitle}</p>
                </div>
    
            </article>`
        );
    }
}

function selector_place_sub_project_pictures(account_dataArg) {
    selector_clear_sub_project_pictures();
    for (let i = 0; i < account_dataArg.projects[selected_storage.project].subProjects[selected_storage.subProject].pictures.length; i++) {
        console.log(`place_sub_project_pictures worked ${i + 1} time(s).`);
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


function selector_clear_sub_projects() {
    console.log(`got here`);
    $('Article.unique_sub_project_card').remove();
}

function selector_clear_sub_project_pictures() {
    console.log(`got here`);
    $('Article.unique_sub_project_picture_card').remove();
}

function run_all_functions() {
    initial_mvp_page_load();
    selector_functions();
};

run_all_functions();