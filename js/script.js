const add_book_form = document.getElementById("add-book-form");
const info = document.getElementById("b_array")
let string = ``;
let myLibrary = [];

const theHobbit = new Book(`The Hobbit`, `J.R.R. Tolkien`, `295`, true);
const theHobbit2 = new Book(`The Hobbit2`, `J.R.R. Tolkien2`, `2952`, false);
const theHobbit3 = new Book(`The Hobbit3`, `J.R.R. Tolkien3`, `2953`, false);


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

const libraryGrid = document.getElementById(`lib_grid`);

function displayCards() {
    //remove all everything from grid to update
    // while (libraryGrid.firstChild) {
    //     libraryGrid.removeChild(libraryGrid.firstChild);
    // }

    //remove all nodes with .card class
    const sharedClass = document.querySelectorAll(".card");
    if (sharedClass) {
        sharedClass.forEach((x) => {
            libraryGrid.removeChild(x);
        });
    }

    myLibrary.forEach((obj, index) => {
        const card = document.createElement(`div`);
        const title = document.createElement(`p`);
        const author = document.createElement(`p`);
        const pages = document.createElement(`p`);
        const read = document.createElement(`p`);

        card.id = `${index}`
        card.className = `card`
        title.innerText = `${obj.title}`;
        author.innerText = `${obj.author}`;
        pages.innerText = `${obj.pages}`;
        read.innerText = `${obj.read}`;

        //for much more stylized code insertAdjacentHTML() 
        card.append(title, author, pages, read);
        libraryGrid.prepend(card);
    });

}


const overlay = document.getElementById(`overlay`);
const add_book_btn = document.querySelectorAll(`.add-btn`);
const close_modal_btn = document.getElementById(`close-modal-btn`);

add_book_btn.forEach((x) => {
    x.addEventListener(`click`, () => {
        overlay.style.display = `block`;
    });
});

/**
 * TODO:Figure ou why bubbling doesn't stop with .stopPropagation() method
 * 
 */
// overlay.addEventListener(`click`, (e) => {
//     overlay.style.display = `none`;
//     e.stopPropagation();
//     console.log(e.target);
// });
// document.getElementById(`modal`).
//     addEventListener(`click `, e => { e.stopPropagation(); });

close_modal_btn.addEventListener(`click`, (e) => {
    overlay.style.display = `none`;
    e.stopPropagation();

});






function addBookToLibrary() {
    //for testing
    // console.log(add_book_form.querySelector('input[name="title"]').value);

    const formData = new FormData(add_book_form);
    // console.log(formData);

    //could possibly do it without instantiating book
    // formData.prototype = Object.create(Book.prototype); 

    // console.log(`formData.title: ${}`);

    const book = new Book(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("read"));


    myLibrary.push(book);


    // formData.title = formData.get("title");
    // console.log(`formData.title: ${formData.title}`);
    // console.log(formData);
    // console.log(book);
}

/**
 * TODO: get entries of object to display all (even if i add later on)
 */
function displayBook() {
    info.innerText = ``;
    myLibrary.forEach((book) => {
        info.innerText +=
            `title: ${book.title} \n` +
            `author: ${book.author} \n` +
            `pages: ${book.pages} \n` +
            `read: ${book.read} \n` +
            `info: ${book.info()} \n`;
    });
}

// const crdTitle = document.querySelector(`.lc_top p:first-child`);
// const crdAuthor = document.querySelector(`.lc_top p:nth-child(2)`);
// const crdPages = document.querySelector(`.lc_top p:last-child`);

add_book_form.addEventListener(`submit`, (x) => {
    //so add_book_form doesn't mess up
    x.preventDefault();

    //ADDS BOOK INTO ARRAY 
    addBookToLibrary();
    // displayBook();
    displayCards();

    //for testing
    console.log(add_book_form.querySelector('input[name="title"]').value);
});

function test() {
    return `hello`
}
function formValidation(formDataObj) {
    formDataObj.set("title", formDataObj.get("title"));
    formDataObj.set("author", formDataObj.get("author"));
    // console.log("-pages type-->" + typeof formDataObj.get("pages"));

    //cannot use arrow function within the second parameter of formData.set
    formDataObj.set("pages", formDataObj.get("pages"));
    formDataObj.set("read", formDataObj.get("read"));
}

// modifies the add_book_form data
add_book_form.addEventListener(`formdata`, (e) => {
    console.log("formdata fired");

    //making an object from constructor is not necessary, 
    //since its made through the formdata event
    const formData = e.formData;
    console.log(formData);

    /**
     * TODO: (validating????)
     */
    // formdata gets modified by the formdata event 
    // formData.set("title", formData.get("title").toLowerCase());
    // formData.set("author", formData.get("author").toLowerCase());

    formValidation(formData);

});


// const theHobbit = new Book(`The Hobbit`, `J.R.R. Tolkien`, `295`, `not read yet`);

// addBookToLibrary(theHobbit);

// console.log(myLibrary[0].info());