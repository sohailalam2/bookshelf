(function () {
    'use strict';

    angular.module('myApp.bookshelf', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/bookshelf', {
                templateUrl: 'bookshelf/bookshelf.html',
                controller: 'BookshelfCtrl'
            });
        }])

        .controller('BookshelfCtrl', [
            '$scope',
            bookshelfController
        ]);

    function bookshelfController($scope) {
        $scope.successMessage = '';
        $scope.errorMessage = '';
        $scope.maxBooks = 4;
        $scope.book = {title: '', author: '', isbn: ''};
        $scope.allShelves = [];
        $scope.allBooks = {};

        var myBookshelf = new Bookshelf();

        $scope.createShelf = function () {
            var shelfId = myBookshelf.createShelf($scope.maxBooks);
            $scope.allShelves.push(shelfId);
            $scope.successMessage = 'Successfully created a shelf with ID: ' + shelfId;
        };

        var bookId = 1;
        $scope.addBook = function (id) {
            $scope.errorMessage = '';
            $scope.successMessage = '';

            try {
                myBookshelf.addBooks(id, {
                    title: $scope.book.title,
                    author: $scope.book.author,
                    isbn: $scope.book.isbn,
                    $$hashKey: bookId++
                });
                $scope.allBooks[id] = myBookshelf.getAllBooks(id);
                $scope.successMessage = 'Book was added successfully';
            } catch (e) {
                $scope.errorMessage = e.message;
            }
        };

        /**
         * method to remove the book from the given book shelf
         * @param id - the id of the shelf
         * @param isbn - the isbn of the book to remove
         */
        $scope.removeBook = function (id, isbn) {
            $scope.errorMessage = '';
            $scope.successMessage = '';

            try {
                myBookshelf.removeBook(id, {isbn: isbn});
                $scope.allBooks[id] = myBookshelf.getAllBooks(id);
                $scope.successMessage = 'Book was successfully removed';
            } catch (e) {
                $scope.errorMessage = e.message;
            }
        }
    }
})();
