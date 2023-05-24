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

// add_book_form.addEventListener(`submit`, (x) => {
//     //so add_book_form doesn't submit
//     // x.preventDefault();

//     //ADDS BOOK INTO ARRAY 
//     // addBookToLibrary();
//     // displayBook();
//     // displayCards();

//     //for testing
//     // console.log(add_book_form.querySelector('input[name="title"]').value);
// });







//before going into the Array, will be stopped if anything is off
function formValidation(formSelector) {

}

const validateForm = (formSelector) => {
    const formElement = document.querySelector(formSelector);

    //each validation rule
    const validationOptions = [
        {
            attribute: `minlength`,
            //checks if its there and if its the appropriate min length, `minLength` can only be used for <input>
            isValid: (input) => { return input.value && input.value.length >= +input.minLength },
            errorMessage: (input, label) => {
                return `${label.textContent} needs to be at least ${input.minLength}`
            }
        },
        {
            attribute: `min`,
            isValid: (input) => { return input.value && +input.value >= +input.getAttribute(`min`) },
            errorMessage: (input, label) => {
                return `${label.textContent} needs to be at least ${input.min}`
            }
        },
        {
            attribute: `customMaxlength`,
            //checks if its there and if its the appropriate max length, uses .getAttribute() because of custom tag
            isValid: (input) => { return input.value && input.value.length <= +input.getAttribute(`customMaxLength`) },
            errorMessage: (input, label) => {
                return `${label.textContent} too much, can only be ${input.getAttribute(`customMaxLength`)}`
            }
        },
        {
            attribute: `pattern`,
            isValid: (input) => {

                //nothing works with .test(), wtf

                // const regEx = new RegExp(input.pattern);
                // return regEx.test(input.value);

                // let regEx = /[^0-9]/;
                // console.log(regEx.test(input.value) + input.value );
                // return regEx.test(input.value)


                return input.value.match(/\d/g) === null || (input.value.match(/\d/g).length <= 0);
            },
            errorMessage: (input, label) => { return `${label.textContent} must have letters only` },
        },
        {
            attribute: `noLetters`,
            //works but error message doesnt
            isValid: (input) => {
                return input.value.match(/[^\d]/g) === null || (input.value.match(/[^\d]/g).length <= 0)
            },
            errorMessage: (input, label) => { return `${label.textContent} must have numbers only` },
        },
        {
            attribute: `required`,
            //to check if string is empty, trim to remove white space
            isValid: (input) => { return input.value.trim() !== `` },
            //makes error message dynamic
            errorMessage: (input, label) => { return `${label.textContent} is required` },
        },

    ]

    //where each individual input gets validated
    const validateSingleFormGroup = (formGroup) => {
        const label = formGroup.querySelector(`label`);
        const input = formGroup.querySelector(`input, textarea`);
        const errorContainer = formGroup.querySelector(`.error`);
        const errorIcon = formGroup.querySelector(`.error-icon`);
        const successIcon = formGroup.querySelector(`.success-icon`);

        //check each input, create validations rules, loop through each rule, send message error depending on error
        let formGroupError = false;
        for (const option of validationOptions) {
            if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
                errorContainer.textContent = option.errorMessage(input, label);
                input.classList.add(`error-red`);
                input.classList.remove(`success-green`);
                successIcon.setAttribute(`hidden`, ``);
                errorIcon.removeAttribute(`hidden`);
                formGroupError = true;
            }
        }

        //clear out and reset message
        if (!formGroupError) {
            // console.log(formGroup.querySelector(`.error`));
            errorContainer.textContent = ``;
            input.classList.add(`success-green`);
            input.classList.remove(`error-red`);
            errorIcon.setAttribute(`hidden`, ``);
            successIcon.removeAttribute(`hidden`);
        }


    };

    //disables html validation, so js validation works
    formElement.setAttribute(`novalidate`, ``);


    formElement.addEventListener(`submit`, (event) => {
        //doesn't submit form
        event.preventDefault();
        validateAllFormGroups(formElement)
    });

    //where all inputs
    const validateAllFormGroups = (formToValidate) => {
        //makes an  array out of all .formGroup node-list
        const formGroups = Array.from(formToValidate.querySelectorAll(`.formGroup`))

        formGroups.forEach((formGroup) => {
            validateSingleFormGroup(formGroup);
        });
    }
};

validateForm(`#add-book-form`);








//will go into the array, just sprucing it, things like capitalizing/ spacing or removing tags
function formSanitization(formDataObj) {
    const title = () => { return formDataObj.get(`title`); }
    const author = () => {
        let str = formDataObj.get(`author`);
        let regEx = /\d/;
        if (regEx.test(str)) {
            return `has Number`;
        }
        else {
            return str;
        }
    }

    formDataObj.set("title", title());
    formDataObj.set("author", author());
    formDataObj.set("pages", formDataObj.get("pages"));
    formDataObj.set("read", formDataObj.get("read"));
}

// modifies the add_book_form data
// add_book_form.addEventListener(`formdata`, (e) => {
//     console.log("formdata fired");

//     //making an object from constructor is not necessary,
//     //since its made through the formdata event
//     // const formData = e.formData;
//     // console.log(formData);

//     /**
//      * TODO: (validating????)
//      */
//     // formdata gets modified by the formdata event
//     // formData.set("title", formData.get("title").toLowerCase());
//     // formData.set("author", formData.get("author").toLowerCase());


//     // formSanitization(formData);

// });


// const theHobbit = new Book(`The Hobbit`, `J.R.R. Tolkien`, `295`, `not read yet`);

// addBookToLibrary(theHobbit);

// console.log(myLibrary[0].info());