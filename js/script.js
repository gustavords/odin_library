let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}, ${this.read}`;
}


function addBookToLibrary(book) {
    // do stuff here
    myLibrary.push(book);
}


const form = document.getElementById("add-book-form");
const info = document.getElementById("b_array")

let string = ``;

form.addEventListener(`submit`, (x) => {
    //so form doesn't mess up
    x.preventDefault();

    console.log(form.querySelector('input[name="title"]').value);
    // console.log(x);

    const formData = new FormData(form);
    const book = new Book(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("read")
    );

    addBookToLibrary(book);


    // info.innerText += "\n" + book.info() + `  :: index -> ${myLibrary.length-1}`;
    info.innerText = ``;
    myLibrary.forEach((book) => {
        // console.log(book.info() + "\n")
        info.innerText += book.info() + "\n";
    });
    // console.log(myLibrary);

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