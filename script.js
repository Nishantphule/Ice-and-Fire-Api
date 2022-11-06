"use strict";

// pagination page number
var pageNo = 1


// creating div for heading and icon
const headerRow = document.createElement("div")
headerRow.classList += "row"
headerRow.id = "firstRow"
headerRow.style.margin = "20px 0"
document.body.append(headerRow)

// creating a element for header and icon 
const headerDiv = document.createElement("div")

let header = document.createElement("h1")
headerDiv.classList += "col-md-10"
header.id = "header"
header.innerHTML = '<span id="ice">ICE</span> AND <span id="fire">FIRE</span> BOOKS API'

const iconDiv = document.createElement("div")
iconDiv.classList += "col-md-2"

let icon = document.createElement("img")
icon.src = "/img/iconbook.jpg"

headerDiv.append(header)
iconDiv.append(icon)
headerRow.append(iconDiv, headerDiv)


// creating main div
const mainDiv = document.createElement("div")
mainDiv.classList += "container"
document.body.appendChild(mainDiv)


// creating div element for search and page number
let navBar = document.createElement('div')
navBar.classList += "row"
navBar.id = "navBar"
navBar.style.margin = "20px 0"
mainDiv.append(navBar)

// creating an input element for search
// 1. to search book by their names
const searchDiv = document.createElement("div")
searchDiv.classList += "col-6"
let searchbar = document.createElement('input')
searchbar.type = "text"
searchbar.id = "searchbar"
searchbar.classList += "form-control"
searchbar.placeholder = "Filter book Name"
searchbar.setAttribute("onkeyup", "searchFun()")
searchDiv.appendChild(searchbar)

// 2 . displaying page number
const pageDiv = document.createElement("div")
pageDiv.classList += "col-6"
pageDiv.id = "pageNumDiv"
let paginationNo = document.createElement('h4')
pageDiv.appendChild(paginationNo)
paginationNo.innerHTML = `Page   <span id="pageNum">${pageNo}</span>`
navBar.append(searchDiv, pageDiv)


// creating a function for search input element to get the books in the table when you type the name in input by using onkeyup attributte
const searchFun = () => {
    var input, filter, h2, title, i, txtValue, books, card;
    
    input = document.getElementById("searchbar");
    filter = input.value.toUpperCase();
    h2 = document.getElementsByTagName("h2");
    books = document.getElementById("booksDiv")
    card = books.getElementsByClassName("bookCard")
    for (i = 0; i < h2.length; i++) {
        title = h2[i].innerHTML
        if (title) {
            txtValue = title.toUpperCase();
            let re = new RegExp(filter, 'i');
            if (txtValue.includes(filter)) {
                card[i].style.display = "";
            } else {
                card[i].style.display = "none";
            }
        }
    }
}




// creating a div to display books
const displayBookDiv = document.createElement("div")
displayBookDiv.classList += "container bookList"
displayBookDiv.id = "booksDiv"
displayBookDiv.style.height = 'min-content'
displayBookDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1621944193575-816edc981878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTV8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60')"


// creating a card function to display all the book details in a card.
async function createCard(name, pages, isbn, author, publisher, relDate, characters) {
    // main div for card
    const bookCard = document.createElement("div")
    bookCard.classList += "bookCard"

    // book name element
    const bookName = document.createElement("h2")
    bookName.innerHTML = name
    bookName.id = 'bookName'

    // no of pages of book element
    const pagesNo = document.createElement("h5")
    pagesNo.innerHTML = `<b>No. of Pages</b> - ${pages}`

    // book isbn number element
    const isbnNo = document.createElement("h5")
    isbnNo.innerHTML = `<b>Isbn</b> - ${isbn}`

    // book author name element
    const authorName = document.createElement("h5")
    authorName.innerHTML = `<b>Authors Name</b> - ${author}`

    // book publisher name element
    const publisherName = document.createElement("h5")
    publisherName.innerHTML = `<b>Publishers Name</b> - ${publisher}`

    // book release date element
    const releasedDate = document.createElement("h5")
    releasedDate.innerHTML = `<b>Released Date</b> - ${relDate}`

    // displaying 5 characters of each book as a list
    const charTitle = document.createElement("h5")
    charTitle.innerHTML = "<b>Five characters</b> -"

    // creating ordered list
    const charactersList = document.createElement("ol")
    charactersList.id = "charList"
    charactersList.style.fontWeight = "bold"

    // creating list element for each character
    characters.forEach(async (character) => {
        const fetchCharApi = await fetch(character)
        const res = await fetchCharApi.json()
        const characterName = document.createElement("li")
        if (!res.name) {
            characterName.innerHTML = "Data Unavailable"
        }
        else {
            characterName.innerHTML = res.name
        }
        charactersList.append(characterName)
    })

    bookCard.append(bookName, pagesNo, isbnNo, authorName, publisherName, releasedDate, charTitle, charactersList)

    displayBookDiv.append(bookCard)
}


// fetching book api data using page number
const getBooks = async (pgNo) => {
    try {
        // clearing previous data
        displayBookDiv.innerHTML = ""

        // creating loading logo
        const loading = document.createElement("span")
        loading.id = "loadingBtn"
        loading.innerHTML = '<div class="spinner-border"></div>'
        displayBookDiv.appendChild(loading)

        // fetching pagination ice and fire api 
        const fetchPageApi = await fetch(`https://www.anapioficeandfire.com/api/characters?page=${pgNo}&pageSize=10`)

        const page = await fetchPageApi.json()

        // removing loading logo
        displayBookDiv.removeChild(loading)

        // fetching 1 book from each data from current page
        page.forEach(async (data) => {
            try {
                const fetchBookApi = await fetch(`${data.books[0]}`)
                const book = await fetchBookApi.json()
                createCard(book.name, book.numberOfPages, book.isbn, book.authors, book.publisher, book.released, book.characters.slice(0, 5))
            }
            catch (err) {
                console.log(err)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}
getBooks(pageNo)


// pagination

// creating div for action buttons
const actionBtnDiv = document.createElement("div")
actionBtnDiv.id = "actionDiv"
actionBtnDiv.classList += "row"
mainDiv.append(actionBtnDiv, displayBookDiv)

// first Page
const firstBtn = document.createElement("button")
firstBtn.innerHTML = "First Page"
firstBtn.classList += "col-2 mr-auto btn btn-danger"

// previous btn
const prevBtn = document.createElement("button")
prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
prevBtn.classList += "col-2 m-auto btn btn-primary"

// next btn
const nextBtn = document.createElement("button")
nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
nextBtn.classList += "col-2 m-auto btn btn-primary"

// Last Page
const lastBtn = document.createElement("button")
lastBtn.innerHTML = "Last Page"
lastBtn.classList += "col-2 ml-auto btn btn-danger"

actionBtnDiv.append(firstBtn, prevBtn, nextBtn, lastBtn)


// event listeners for action buttons
prevBtn.addEventListener("click", () => {
    if (pageNo === 1) {
        alert("First Page Reached")
    }
    else {
        pageNo--
        getBooks(pageNo)
        paginationNo.innerHTML = `Page<span id="pageNum">${pageNo}</span>`
    }
})

nextBtn.addEventListener("click", () => {
    if (pageNo === 5) {
        alert("Last Page Reached")
    }
    else {
        pageNo++
        getBooks(pageNo)
        paginationNo.innerHTML = `Page<span id="pageNum">${pageNo}</span>`
    }
})

firstBtn.addEventListener("click", () => {
    if (pageNo === 1) {
        alert("First Page Reached")
    }
    else {
        pageNo = 1
        getBooks(pageNo)
        paginationNo.innerHTML = `Page<span id="pageNum">${pageNo}</span>`
    }
})

lastBtn.addEventListener("click", () => {
    if (pageNo === 5) {
        alert("Last Page Reached")
    }
    else {
        pageNo = 5
        getBooks(pageNo)
        paginationNo.innerHTML = `Page<span id="pageNum">${pageNo}</span>`
    }
})