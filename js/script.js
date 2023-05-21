const form = document.getElementById("add-book-form");
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


function addBookToLibrary(form) {
    //for testing
    // console.log(form.querySelector('input[name="title"]').value);

    const formData = new FormData(form);
    const book = new Book(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("read"));
    // do stuff here
    myLibrary.push(book);
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


const libraryGrid = document.getElementById(`lib_grid`);

function displayCards() {
    //remove all cards from grid to update
    while (libraryGrid.firstChild) {
        libraryGrid.removeChild(libraryGrid.firstChild);
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
        libraryGrid.appendChild(card);


    });

}




form.addEventListener(`submit`, (x) => {
    //so form doesn't mess up
    x.preventDefault();
    addBookToLibrary(form);
    displayBook();

    //for testing
    // console.log(form.querySelector('input[name="title"]').value);
});

form.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // modifies the form data
    const formData = e.formData;

    /**
     * TODO: (validating????)
     */
    // formdata gets modified by the formdata event 
    formData.set("title", formData.get("title").toLowerCase());
    formData.set("author", formData.get("author").toLowerCase());
});


// const theHobbit = new Book(`The Hobbit`, `J.R.R. Tolkien`, `295`, `not read yet`);

// addBookToLibrary(theHobbit);

// console.log(myLibrary[0].info());