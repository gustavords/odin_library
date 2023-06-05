const add_book_form = document.getElementById(`add-book-form`);
const lib_grid = document.getElementById(`lib-grid`);
const overlay = document.getElementById(`overlay`);
const add_book_btns = document.querySelectorAll(`.add-btn`);
const edit_book_btn = document.querySelector(`#edit-btn`);

const close_modal_btn = document.getElementById(`close-modal-btn`);
let string = ``;
let myLibrary = [];
let lastBookID = myLibrary.length - 1;

//for testing
const theHobbit = new Book(`The Hobbit`, `J.R.R. Tolkien`, `295`, true);
const test = new Book(`Aaaa`, `Aaaa`, `11`, `Unread`);
const test2 = new Book(`Wwww`, `Wwww`, `22`, false);
const test3 = new Book(`10qqqqqqqqqqq`, `qqqqqqqqqqq`, `1000000000`, `Read`);

//for testing
myLibrary.push(theHobbit);
myLibrary.push(test);
myLibrary.push(test2);
myLibrary.push(test3);


function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}, ${this.read}`;
};


/**
 * * currently just adds to libraryArray
 * where everything should happen according to the project
 */
function addBookToLibrary(formData, location = undefined) {

    // const formData = new FormData(add_book_form);
    const book = new Book(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("read")
    );


    if (isBookInLibrary(book)) {
        //for editing a book
        if (+location >= 0 && typeof location !== undefined) {
            myLibrary[location] = book;
            console.log(`has been edited`);
        }
        else {
            alert(`This book is already in the Library!\n\nMake sure the books have a different Title and Author`);

        }
    }
    else {
        //for editing a book
        if (+location >= 0 && typeof +location === `number`) {
            myLibrary[location] = book;
            console.log(`has been edited`);
        }
        else {
            myLibrary.push(book);
        }
    }

}

const isBookInLibrary = (book) => {
    let bookMatch = false;
    // console.log(myLibrary)
    myLibrary.forEach((libBook) => {
        if (libBook.title === book.title && libBook.author === book.author) { bookMatch = true; }
    })
    return bookMatch;
}


/**
 *
 * @param {*} formSelector takes CSS selector name in order to get the DOM Element and create a FormData Object
 */
const validateForm = (formSelector) => {
    const formElement = document.querySelector(formSelector);

    /**
     * better way to validate???
     * ?https://www.sitepoint.com/html-forms-constraint-validation-complete-guide/
     */
    const inputValidationOptions = [

        {
            attribute: `noPunctuationMarks`,
            isValid: (input) => {
                const regEx = /[\~!@#$%\^<>/\\*\(\)\[\]\{\}\+\-\:\=\|\/]/;
                return input.value && regEx.test(input.value) === false
            },
            errorMessage: (input, label) => {
                return `only sp.characters allowed [. , ; \`  " &]`
            }
        },
        {
            attribute: `noNumber`,
            isValid: (input) => {
                const regEx = /\d/;
                return input.value && regEx.test(input.value) === false
            },
            errorMessage: (input, label) => {
                return `${label.textContent} cannot have numbers*`
            }
        },
        {
            attribute: `noDecimal`,
            isValid: (input) => { return input.value && +input.value % 1 === 0 },
            errorMessage: (input, label) => {
                return `${label.textContent} cannot have decimals*`
            }
        },
        {
            attribute: `minlength`,
            //checks if its there and if its the appropriate min length, `minLength` can only be used for <input>
            isValid: (input) => { return input.value && input.value.length >= +input.minLength },
            errorMessage: (input) => {
                return `requires ${input.minLength} or more characters*`
            }
        },
        {
            attribute: `min`,
            isValid: (input) => { return input.value && +input.value >= +input.min },
            errorMessage: (input, label) => {
                return `needs to be at least ${input.min} ${label.textContent.toLowerCase()}*`
            }
        },
        {
            attribute: `required`,
            isValid: (input) => { return input.value.trim() !== `` && input.value !== null; },
            errorMessage: (input, label) => {
                return `${label.textContent} is required*`;
            },
        },

    ];

    /**
     * 
     * @param {*} formGroup validates and display errors on particular group
     * @returns Boolean value determining if the particular group is valid 
     */
    const validateSingleFormGroup = (formGroup) => {
        const label = formGroup.querySelector(`label`);
        const input = formGroup.querySelector(`input, textarea`);
        const errorContainer = formGroup.querySelector(`.error`);
        const errorIcon = formGroup.querySelector(`.error-icon`);
        const successIcon = formGroup.querySelector(`.success-icon`);

        let isGroupValid = true;
        let formGroupError = false;
        inputValidationOptions.forEach((option) => {
            if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
                console.log(input); //
                isGroupValid = false
                errorContainer.textContent = option.errorMessage(input, label) + `\n`;
                input.classList.add(`error-red`);
                input.classList.remove(`success-green`);
                successIcon.setAttribute(`hidden`, `false`);
                errorIcon.removeAttribute(`hidden`);
                formGroupError = true;
            }
            if (input.value === null) {
                isGroupValid = false
            }
        });

        //reset error message
        if (!formGroupError) {
            errorContainer.textContent = ``;
            input.classList.add(`success-green`);
            input.classList.remove(`error-red`);
            errorIcon.setAttribute(`hidden`, ``);
            successIcon.removeAttribute(`hidden`);
            formGroupError = false;
        }
        console.log(`isFormValid: ${isGroupValid}`)

        return isGroupValid;
    };

    const validateFormGroups = (formElement) => {
        const formGroups = Array.from(formElement.querySelectorAll(`.formGroup`));
        const isFormValidArr = [];
        let isFormValid = ``;
        formGroups.forEach((formGroup) => {
            validateSingleFormGroup(formGroup);
            isFormValidArr.push(validateSingleFormGroup(formGroup));
        });

        isFormValid = isFormValidArr.find(x => (x === false));

        if (isFormValid === undefined) {
            isFormValid = true;
        }
        // not necessary since if found IsFormValid return value is already a false boolean
        // else {
        //     isFormValid = false;
        // }
        return isFormValid;
    };

    formElement.setAttribute(`novalidate`, ``);

    formElement.addEventListener(`formdata`, (e) => {

        console.log("formdata fired, created through event listener");
        const formData = e.formData;

        const isNotNull = (input) => {
            return formData.get(input) === null ? false : formData.get(input);
        };

        //sanitization
        formData.set("title", titleCaseWord(formData.get("title")));
        formData.set("author", capitalizeWord(formData.get("author")));
        formData.set("pages", +formData.get("pages")); //removes extra zeros through unary plus operator
        formData.set("read", isNotNull(`read`) === `true` ? `Read` : `Unread`);

    });

    formElement.addEventListener(`submit`, (x) => {
        //so add_book_form doesn't submit
        x.preventDefault();

        // validateFormGroups(formElement); //should happen before formData is pulled again
        // 
        if (validateFormGroups(formElement)) {
            addBookToLibrary(new FormData(add_book_form));
            displayCards();
            add_book_form.reset();
            overlay.style.display = `none`;
            currentBookDisplay(myLibrary.length - 1);
        }
    });

    ///Sanitization stuff
    function capitalizeWord(string) {
        const words = string.split(` `);
        let capStr = ``;
        words.forEach((word) => {
            word = word.charAt(0).toUpperCase() + word.slice(1);

            capStr += word + ` `;
        });
        // console.log(capStr);
        return capStr.trim();
    }
    function titleCaseWord(string) {
        const words = string.split(` `);
        let newStr = ``;
        words.forEach((word) => {
            word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            newStr += word + ` `;
        });
        // console.log(newStr);
        return newStr.trim();
    }

};

/**
 * TODO: MUST DO CARD LAYOUT TO FIgure out proper event handling area, or make it a fucking button
 * Problem is event delegation only really works one parent up
 * and its not possible to give the .card class the event since it loops do to how its generated
 */
const editBook = () => {
    let bookID = ``;
    lib_grid.addEventListener(`dblclick`, (e) => {
        //get parent id of child element 
        if (e.target && +e.target.parentElement.id >= 0 && e.target.parentElement.id !== ``) {
            console.log(e.target.parentElement.id);

            //sets the form up for edit
            add_book_form.querySelector(`legend h1`).textContent = `Edit Book`;
            add_book_form.querySelector(`button[type="submit"]`).setAttribute(`hidden`, ``);

            edit_book_btn.removeAttribute(`hidden`);

            bookID = e.target.parentElement.id;
            console.log(`bookId: ` + bookID);
            //get book in array through index === id
            let theBook = myLibrary[bookID];

            //open up book info already in form
            overlay.style.display = `block`;
            add_book_form.querySelector(`input[id="title"]`).value = `${theBook.title}`;
            add_book_form.querySelector(`input[id="author"]`).value = `${theBook.author}`;
            add_book_form.querySelector(`input[id="pages"]`).value = `${theBook.pages}`;
            (theBook.read === `Read` || theBook.read === true) ?
                add_book_form.querySelector(`input[id="read"]`).checked = true :
                add_book_form.querySelector(`input[id="read"]`).checked = false;
            ;

        }


    });

    edit_book_btn.addEventListener(`click`, (e) => {
        // btnTest();
        const test = new FormData(add_book_form);
        console.log(test);
        addBookToLibrary(test, bookID);
        displayCards();
        overlay.style.display = `none`;
        add_book_form.reset();
    });




    //save button that only changes once something has been edited
};


function currentBookDisplay(bookID) {
    lastBookID = bookID;
    console.log(lastBookID);
    const currBookElement = document.getElementById(`current-book`);

    if (document.getElementById(`${bookID}`) !== null) {
        // debugger;
        document.getElementById(`${bookID}`).style.border = `1px solid red`;
        currBookElement.querySelector(`img`).setAttribute(`alt`, `${bookID}`);
        currBookElement.querySelector(`#title`).textContent = `${myLibrary[bookID].title}`;
        currBookElement.querySelector(`#author`).textContent = `${myLibrary[bookID].author}`;
        currBookElement.querySelector(`#pages`).textContent = `${myLibrary[bookID].pages}`;
        currBookElement.querySelector(`#read`).textContent = `${myLibrary[bookID].read}`;
    }
}

const currentBook = () => {
    const currBookElement = document.getElementById(`current-book`);

    const changeCurrBook = (bookID) =>{
        document.querySelectorAll(`.card`).forEach((card) => {
            card.style.border = `0`;
        });
        document.getElementById(`${bookID}`).style.border = `1px solid red`;
        currBookElement.querySelector(`img`).setAttribute(`alt`, `${bookID}`);
        currBookElement.querySelector(`#title`).textContent = `${myLibrary[bookID].title}`;
        currBookElement.querySelector(`#author`).textContent = `${myLibrary[bookID].author}`;
        currBookElement.querySelector(`#pages`).textContent = `${myLibrary[bookID].pages}`;
        currBookElement.querySelector(`#read`).textContent = `${myLibrary[bookID].read}`;
    }

    lib_grid.addEventListener(`click`, (e) => {
        //get parent id of child element 
        if (e.target && +e.target.parentElement.id >= 0 && e.target.parentElement.id !== ``) {
            let bookID = e.target.parentElement.id;
            changeCurrBook(bookID);

        }
    });
    //since the very first add will highlight the last book
    let bookID = lastBookID;

    document.getElementById(`next-book-btn`).addEventListener(`click`, () => {
        if (lastBookID === myLibrary.length - 1) {
            bookID = lastBookID;
        }
        bookID >= myLibrary.length - 1 || bookID === `` ? bookID = 0 : bookID++;
        changeCurrBook(bookID);
        lastBookID = bookID;
    });
    document.getElementById(`previous-book-btn`).addEventListener(`click`, () => {
        if (lastBookID === myLibrary.length - 1) {
            bookID = lastBookID;
        }

        bookID <= 0 || bookID === `` ? bookID = myLibrary.length - 1 : bookID--;
        changeCurrBook(bookID);
        lastBookID = bookID;
    });
    document.addEventListener(`keydown`, (e)=>{
        // (e.target && +e.target.parentElement.id >= 0 && e.target.parentElement.id !== ``) 
        console.log(e.code);
        if(e.code === `ArrowRight`){
            if (lastBookID === myLibrary.length - 1  && document.getElementById(`${bookID}`) !== null) {
                bookID = lastBookID;
            }
            bookID >= myLibrary.length - 1 || bookID === `` ? bookID = 0 : bookID++;
            changeCurrBook(bookID);
            lastBookID = bookID;
        }
        if(e.code === `ArrowLeft`){
            if (lastBookID === myLibrary.length - 1 && document.getElementById(`${bookID}`) !== null) {
                bookID = lastBookID;
            }
    
            bookID <= 0 || bookID === `` ? bookID = myLibrary.length - 1 : bookID--;
            changeCurrBook(bookID);
            lastBookID = bookID;
        }

    });
};
currentBook();


const isChecked = (checkBoxSelectorId) => {
    const checkBoxElement = document.getElementById(checkBoxSelectorId);
    const readInfo = document.getElementById(`read-info`);

    checkBoxElement.addEventListener(`click`, () => {
        const labelNodeList = Array.from(document.querySelector(`#read`).labels);

        if (checkBoxElement.checked) {
            checkBoxElement.setAttribute(`checked`, `true`);
            labelNodeList.forEach((label) => {
                label.textContent = `Read`;
            });
            readInfo.textContent = `I have read this!`;
            return (checkBoxElement.value = true);
        } else {
            checkBoxElement.removeAttribute(`checked`);
            labelNodeList.forEach((label) => {
                label.textContent = `Unread`;
            });
            readInfo.textContent = `I haven't read this yet...`;
            return (checkBoxElement.value = false);
        }
    });
};
isChecked(`read`);

const onlyNumbers = (inputSelectorId) => {
    const inputElement = document.getElementById(inputSelectorId);

    inputElement.addEventListener(`keydown`, (e) => {
        if ((e.key >= 0 && e.key <= 9) || e.key === `Backspace` || e.key === `Tab` || e.key === `Enter`) {
            // console.log(e.key);
            // allow
        }
        else {
            e.preventDefault();
        }
    });
};
onlyNumbers(`pages`);

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
        const card = document.createElement(`fieldset`);
        const read = document.createElement(`legend`);
        const title = document.createElement(`p`);
        const author = document.createElement(`p`);
        const pages = document.createElement(`p`);
        // const read = document.createElement(`p`);
        const viewBtn = document.createElement(`button`);
        const deleteBtn = document.createElement(`button`);

        card.id = `${index}`;
        card.className = `card`;
        // card.classList.add(`card`);  //class is added but style not rendered, so i settled for inline style localStorage issue???
        // card.style.border = `1px dotted black`;
        title.innerText = `${obj.title}`;
        read.innerText = `${obj.read}`
        if (obj.read === `Read` || obj.read === true) {
            // console.log(`here`);
            read.style.backgroundColor = `rgb(225, 254, 255)`;
            read.style.color = `#1992D4`;
        }
        author.innerText = `by ${obj.author}`;
        pages.innerText = `${obj.pages} pgs`;
        // read.innerText = `${obj.read}`;
        deleteBtn.innerText = `\u0078`;


        //for much more stylized code insertAdjacentHTML()
        card.append(read, title, author, pages);
        lib_grid.prepend(card);

        //can only bind events and css-styling once element has been fully added into HTML
        //not necessary during testing
        card.classList.add(`card`);
    });

}

function btnEventListeners() {
    //event listener for all book buttons
    add_book_btns.forEach((button) => {
        button.addEventListener(`click`, () => {
            add_book_form.querySelector(`button[type="submit"]`).removeAttribute(`hidden`);
            add_book_form.querySelector(`legend h1`).textContent = `Add Book`;
            edit_book_btn.setAttribute(`hidden`, ``);
            overlay.style.display = `block`;

        });
    });

    //event listener for close modal button
    close_modal_btn.addEventListener(`click`, (e) => {
        overlay.style.display = `none`;
        add_book_form.reset();
        e.stopPropagation();
    });
}


btnEventListeners();
validateForm(`#add-book-form`);  ///does it all
displayCards(); //testing\
currentBookDisplay(myLibrary.length - 1);

editBook();