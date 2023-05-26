const add_book_form = document.getElementById(`add-book-form`);
const lib_grid = document.getElementById(`lib-grid`);
const overlay = document.getElementById(`overlay`);
const add_book_btn = document.querySelectorAll(`.add-btn`);
const close_modal_btn = document.getElementById(`close-modal-btn`);
let string = ``;
let myLibrary = [];

//for testing
const theHobbit = new Book(`The Hobbit`, `J.R.R. Tolkien`, `295`, true);
const theHobbit2 = new Book(`The Hobbit2`, `J.R.R. Tolkien2`, `2952`, false);
const theHobbit3 = new Book(`The Hobbit3`, `J.R.R. Tolkien3`, `2953`, false);

//for testing
myLibrary.push(theHobbit);
myLibrary.push(theHobbit2);
myLibrary.push(theHobbit3);

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}, ${this.read}`;
}

/**
 * TODO: - could possibly do it without instantiating book 
 * 
 * currently just adds to libraryArray 
 * where everything should happen according to the project
 */
function addBookToLibrary() {
    const formData = new FormData(add_book_form);
    const book = new Book(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("read"));
    myLibrary.push(book);
}

/**
 * 
 * @param {*} formSelector takes CSS selector name in order to get the DOM Element and create a FormData Object
 */
const validateForm = (formSelector) => {
    const formElement = document.querySelector(formSelector);
    const formData = new FormData(formElement);
    console.log(formData.getAll());

};

const isChecked = (checkBoxSelectorId) => {
    const checkBoxElement = document.getElementById(checkBoxSelectorId);
    checkBoxElement.addEventListener(`click`, () => {
        if (checkBoxElement.checked) {
            checkBoxElement.setAttribute(`checked`, `true`);
            return checkBoxElement.value = true;
        }
        else {
            checkBoxElement.removeAttribute(`checked`);
            return checkBoxElement.value = false;;
        }
    });
}

isChecked(`read`);

/**
 * TODO: Spruce it up
 * ? localStorage (???) issue of CSS not rendering when class is passed after its created
 */
function displayCards() {
    //remove all nodes with .card class
    const sharedClass = document.querySelectorAll(".card");
    if (sharedClass) {
        sharedClass.forEach((x) => {
            lib_grid.removeChild(x);
        });
    }

    myLibrary.forEach((obj, index) => {
        const card = document.createElement(`div`);
        const title = document.createElement(`p`);
        const author = document.createElement(`p`);
        const pages = document.createElement(`p`);
        const read = document.createElement(`p`);

        card.id = `${index}`
        card.className = `card`;
        // card.classList.add(`card`);  //class is added but style not rendered, so i settled for inline style localStorage issue???
        card.style.border = `1px dotted black`;
        title.innerText = `${obj.title}`;
        author.innerText = `${obj.author}`;
        pages.innerText = `${obj.pages}`;
        read.innerText = `${obj.read}`;

        //for much more stylized code insertAdjacentHTML() 
        card.append(title, author, pages, read);
        lib_grid.prepend(card);
    });
}



function btnEventListeners() {
    //event listener for all book buttons
    add_book_btn.forEach((button) => {
        button.addEventListener(`click`, () => {
            overlay.style.display = `block`;
        });
    });

    //event listener for close modal button
    close_modal_btn.addEventListener(`click`, (e) => {
        overlay.style.display = `none`;
        e.stopPropagation();
    });
}
btnEventListeners();

add_book_form.addEventListener(`submit`, (x) => {
    //so add_book_form doesn't submit
    x.preventDefault();

    validateForm(`#add-book-form`);
    //ADDS BOOK INTO ARRAY 
    addBookToLibrary();

    displayCards();
    //for testing
    // console.log(add_book_form.querySelector('input[name="title"]').value);
})