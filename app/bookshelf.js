/**
 * The Book Shelf module
 *
 * Created by Sohail Alam on 24-07-2016.
 */
var Bookshelf = (function () {
    'use strict';

    // The local variable for holding all bookshelves and all the books in it
    // Schema: { shelfId: { max: Number, books: Array } }
    var BOOKSHELVES = {};
    var bookId = 1;

    /**
     * Constructor function to create the bookshelf
     * @constructor
     */
    function Bookshelf() {
    }

    /**
     * Method to create a shelf on the bookshelf with pre specified maximum books limit
     * @param maxBooks Number - Defaults to 10
     * @returns {string} Shelf ID - Auto generated, alpha numeric id to identify the shelf
     */
    Bookshelf.prototype.createShelf = function (maxBooks) {
        var shelfId = Math.random().toString(36).slice(2);
        BOOKSHELVES[shelfId] = {
            max: maxBooks || 10,
            books: []
        };
        return shelfId;
    };

    /**
     * Returns the current count of books on the given shelf
     * @param shelfId - the shelf id whose books count needs to be found out
     * @returns {*} Number - the number of books occupying the shelf
     */
    Bookshelf.prototype.booksCount = function (shelfId) {
        if (shelfId && BOOKSHELVES[shelfId]) {
            return BOOKSHELVES[shelfId].books.length;
        }
        return -1;
    };

    /**
     * Returns the remaining count of books that can be put on the shelf
     * @param shelfId - the shelf id whose books count needs to be found out
     * @returns {*} Number - the number of books remaining
     */
    Bookshelf.prototype.booksRemaining = function (shelfId) {
        if (shelfId && BOOKSHELVES[shelfId]) {
            return (BOOKSHELVES[shelfId].max - BOOKSHELVES[shelfId].books.length);
        }
        return -1;
    };

    /**
     * Adds one or more books on the given shelf
     * The book MUST follow the given schema
     * { title: String, author: String, isbn: String }
     *
     *  NOTE: Only unique book (by isbn) can be added to a given shelf
     *
     * @param shelfId - the shelf id where the book needs to be added
     * @param books - the book object or the array of books to be added
     */
    Bookshelf.prototype.addBooks = function (shelfId, books) {
        if (!shelfId) throw new Error('Shelf ID must be specified while adding new books');
        if (!BOOKSHELVES[shelfId]) throw new Error('Book Shelf with Shelf ID ' + shelfId + ' does not exist');

        function add(book) {
            if (this.booksRemaining(shelfId) > 0) {
                if (!book.title) throw new Error('Book must have a title');
                if (!book.author) throw new Error('Book must have an author');
                if (!book.isbn) throw new Error('Book must have an isbn');

                var books = BOOKSHELVES[shelfId].books;
                // search for existing book with given isbn
                var exists = books.filter(function (b) {
                    return b.isbn === book.isbn;
                });
                // if book is not already added, then add it
                if (exists.length === 0) {
                    // the book's parameters MUST be fixed and not allowed to change after being added
                    Object.freeze(book);
                    books.push(book);
                }
            } else {
                throw new Error('Shelf ' + shelfId + ' is full. Can not add any more books');
            }
        }

        // check whether one or more books needs to be added
        if (Array.isArray(books)) {
            books.forEach(function (book) {
                add.call(this, book);
            }, this);
        } else {
            add.call(this, books);
        }
    };

    /**
     * Get all the books from a given shelf or from all shelf
     *
     * @param shelfId - optional - the shelf id whose books are to be returned
     * @returns {*} - array (if shelfId is mentioned), else object
     */
    Bookshelf.prototype.getAllBooks = function (shelfId) {
        if (shelfId && BOOKSHELVES[shelfId]) {
            return BOOKSHELVES[shelfId].books.slice();
        } else {
            return new Object(BOOKSHELVES);
        }
    };

    /**
     * Remove a given book from the given book shelf
     *
     * @param shelfId - the shelf id from where the book needs to be removed
     * @param book - the book that needs to be removed
     */
    Bookshelf.prototype.removeBook = function (shelfId, book) {
        if (!shelfId) throw new Error('Shelf ID must be specified while removing a book');
        if (BOOKSHELVES[shelfId]) {
            var books = BOOKSHELVES[shelfId].books;
            books.filter(function (b, i) {
                if (b.isbn === book.isbn || b.title === book.title) {
                    books.splice(i, 1);
                }
            });
        }
    };

    /**
     * Search for a given book in a given shelf or in the entire bookshelf
     * This search will include the book if the searched text is present somewhere (partially) in the title,
     * or the author name or the isbn
     *
     * @param searchText - the partial text that needs to be searched
     * @param shelfId - optional - the shelf where to search
     * @returns {Array} - an array of found books
     */
    Bookshelf.prototype.search = function (searchText, shelfId) {
        var foundBooks = [];

        function findBooks(shelfId) {
            var books = BOOKSHELVES[shelfId].books.slice();
            for (var i = 0; i < books.length; i++) {
                var book = books[i];
                if (book.title.indexOf(searchText) > -1) foundBooks.push(book);
                else if (book.author.indexOf(searchText) > -1) foundBooks.push(book);
                else if (book.isbn.indexOf(searchText) > -1) foundBooks.push(book);
            }
        }

        if (shelfId && BOOKSHELVES[shelfId]) {
            findBooks.call(this, shelfId);
        } else {
            for (shelfId in BOOKSHELVES) {
                findBooks.call(this, shelfId);
            }
        }
        return foundBooks;
    };
    return Bookshelf;
})();


/*******************************************************************************************
 *                                       TESTS
 *******************************************************************************************/
//console.log('\n\n>> Initializing My Bookshelves');
//var myBookshelf = new Bookshelf();
//var shelfId = myBookshelf.createShelf(3);
//console.log('Book Shelf ID: ' + shelfId);
//console.log('Books Count: ' + myBookshelf.booksCount(shelfId));
//console.log('Books Remaining: ' + myBookshelf.booksRemaining(shelfId));
//console.log('All Books: ', myBookshelf.getAllBooks(shelfId));
//
//
//console.log('\n\n>> Adding a book');
//myBookshelf.addBooks(shelfId, {title: 'One', author: 'Sohail', isbn: '123asf'});
//console.log('Books Count: ' + myBookshelf.booksCount(shelfId));
//console.log('Books Remaining: ' + myBookshelf.booksRemaining(shelfId));
//console.log('All Books: ', myBookshelf.getAllBooks(shelfId));
//
//console.log('\n\n>> Adding two books');
//myBookshelf.addBooks(shelfId, [{title: 'Two', author: 'Sohail', isbn: '123863asf'}, {
//    title: 'Three',
//    author: 'Alam',
//    isbn: 'r217iba8'
//}]);
//console.log('Books Count: ' + myBookshelf.booksCount(shelfId));
//console.log('Books Remaining: ' + myBookshelf.booksRemaining(shelfId));
//console.log('All Books: ', myBookshelf.getAllBooks(shelfId));
//
//console.log('\n\n>> Searching for Books');
//console.log('Search Result :: ', myBookshelf.search('123'));
//
//console.log('\n\n>> Removing Books');
//myBookshelf.removeBook(shelfId, {isbn: '123863asf'});
//console.log('Books Count: ' + myBookshelf.booksCount(shelfId));
//console.log('Books Remaining: ' + myBookshelf.booksRemaining(shelfId));
//console.log('All Books: ', myBookshelf.getAllBooks(shelfId));
//
//console.log('\n\n>> Searching for Books');
//console.log('Search Result :: ', myBookshelf.search('123'));
//
//console.log('\n\n>> Trying to change the parameter of a book');
//var foundBook = myBookshelf.search('123')[0];
//console.log('The Found Book (before change): ', foundBook);
//foundBook.isbn = 'NEW ISBN';
//console.log('The Found Book (after change): ', foundBook);
