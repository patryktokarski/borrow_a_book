$(document).ready(function() {

    var endpoint = window.location + "api/books.php";
    
    function loadBooks() {

        $('div.ajaxStatus').toggle();
        $.get(endpoint, function(json) {
            $('div#books').find('.book').remove();
            $('div#books .info').remove();
            $('div#books .editForm').remove();
            var books = JSON.parse(json);
            
            for (var i = 0; i < books.length; i++) {
                var book = $('<div class="book" data-book-id='+ books[i].id + '><span class="titleSpan">Title: \n\
                              <span class="title">'+ books[i].name +'</span></span>\n\
                              <div class="deleteBtn btn"><a class="removeBtn btn" href="#">DELETE</a></div></div>');
                
                $('div#books').append(book);
                
                var informations = $('<div class="info" style = "display:none">\n\
                                    <div class="author"><span class = "author">' + books[i].author +'</span></div>\n\
                                    <div class="description"><span class = "desc">' + books[i].book_desc + '</span></div>\n\
                                    <div class="editBtn"><a class="edit btn" href="#">EDIT</a></div></div>');
              
                book.append(informations);

                var editForm = $('<div class = "editForm" style = "display: none">\n\
                                  <p>Edit</p><hr>\n\
                                  <label>Title:</label><input name = "name" value ="' + books[i].name + '">\n\
                                  <label>Author:</label><input name = "author" value ="' + books[i].author + '">\n\
                                  <label>Description:</label><input name = "book_desc" value ="' + books[i].book_desc + '">\n\
                                  <div class = "optionBtn"><a class = "saveForm btn" href = "#">SAVE</a>\n\
                                  <a class = "cancelForm btn" href = "#">CANCEL</a></div>\n\
                                  </div>');

                informations.append(editForm);
            }

            $('div.ajaxStatus').toggle();
        });
    }  

    loadBooks();
    
    $('div#books').on('click', '.titleSpan',function() {

        var bookId = $(this).parent().data('book-id');
        $('[data-book-id=' + bookId + ']').find('div.info').slideToggle();
        if ($('[data-book-id=' + bookId + ']').find('.editForm').val('display') != 'none') {
            $('[data-book-id=' + bookId + ']').find('.editForm').slideUp();
            var title = $('[data-book-id=' + bookId + ']').find('.title').text();
            var author = $('[data-book-id=' + bookId + ']').find('span.author').text();
            var book_desc = $('[data-book-id=' + bookId + ']').find('span.desc').text();

            $('[data-book-id =' + bookId + ']').find('input[name="author"]').val(author);
            $('[data-book-id =' + bookId + ']').find('input[name="name"]').val(title);
            $('[data-book-id =' + bookId + ']').find('input[name="book_desc"]').val(book_desc);
        }
    });

    $('div#books').on('click', '.edit', function(e) {

        e.preventDefault();
        var bookId = $(this).parents('div.book').data('book-id');
        $('[data-book-id=' + bookId + ']').find('.editForm').slideDown();
    });
    
    function updateBook(authorVal, nameVal, book_descVal, book_idVal) {

        $('div.ajaxStatus').toggle();

	$.post(endpoint, {
            author: authorVal, 
            name: nameVal, 
            book_desc: book_descVal, 
            book_id: book_idVal
        })
        .done(function(json) {
            
            $('div#books').find('div.editForm').remove();
            $('div#books').find('div.info').remove();

            loadBooks();
        })
        .fail(function(xhr) {
                console.log('update error', xhr);
        })
        .always(function(xhr) {
                $('div.ajaxStatus').toggle();
        });
    }
    
    $('div#books').on('click', 'a.saveForm', function(event) {

        event.preventDefault();
        var bookId = $(this).parents('div.book').data('book-id');
        var author = $('[data-book-id =' + bookId + ']').find('input[name="author"]').prop('value');
        var title = $('[data-book-id =' + bookId + ']').find('input[name="name"]').prop('value');
        var book_desc = $('[data-book-id =' + bookId + ']').find('input[name="book_desc"]').prop('value');

	    updateBook(author, title, book_desc, bookId);

        var message = $('<span>Book updated</span>').fadeOut(5000);
        $('div.AddBookCont').find('div.message').append(message);
    });

    $('div#books').on('keypress', '.editForm', function(event) {

        if (event.which == 13) {

            event.preventDefault();
            var bookId = $(this).parents('div.book').data('book-id');
            var author = $('[data-book-id =' + bookId + ']').find('input[name="author"]').prop('value');
            var title = $('[data-book-id =' + bookId + ']').find('input[name="name"]').prop('value');
            var book_desc = $('[data-book-id =' + bookId + ']').find('input[name="book_desc"]').prop('value');

            updateBook(author, title, book_desc, bookId);

            var message = $('<span>Book updated</span>').fadeOut(5000);
            $('div.AddBookCont').find('div.message').append(message);
        }
    });
    
    
    $('div#books').on('click', 'a.cancelForm', function(e) {

        e.preventDefault();
        var bookId = $(this).parents('div.book').data('book-id');
        $('[data-book-id = ' + bookId + ']').find('.editForm').slideUp();

        var title = $('[data-book-id=' + bookId + ']').find('.title').text();
        var author = $('[data-book-id=' + bookId + ']').find('span.author').text();
        var book_desc = $('[data-book-id=' + bookId + ']').find('span.desc').text();

        $('[data-book-id =' + bookId + ']').find('input[name="author"]').val(author);
        $('[data-book-id =' + bookId + ']').find('input[name="name"]').val(title);
        $('[data-book-id =' + bookId + ']').find('input[name="book_desc"]').val(book_desc);
    });

    function addBook(authorVal, nameVal, book_descVal) {

        $('div.ajaxStatus').toggle();
        
        $.ajax({
            url: endpoint,
            data: {author: authorVal, name: nameVal, book_desc: book_descVal},
            type:'PUT',
            dataType: 'json'
        })
        .done(function(json) {
            console.log(json);
            $('form#addbook').find('input[type="text"]').prop('value', '');
            loadBooks();
        })
        .fail(function(xhr) {
            console.log('add.error', xhr);
        })
        .always(function(xhr) {
            $('div.ajaxStatus').toggle();
        })
    }
    
    $('form#addbook').find('input[type="submit"]').click(function() {

        event.preventDefault();
        var author = $(this).parent().find('input[name="author"]').prop('value');
        var name = $(this).parent().find('input[name="name"]').prop('value');
        var book_desc = $(this).parent().find('input[name="book_desc"]').prop('value');

	    addBook(author, name, book_desc);
        var message = $('<span>Book added</span>').fadeOut(5000);
        $('div.AddBookCont').find('div.message').append(message);
    });
    
    function removeBook(bookId) {

        $('div.ajaxStatus').toggle();

        $.ajax({
                url: endpoint,
                data: {book_id: bookId},
                type: 'DELETE',
                dataType: 'json'
        })
        .done(function(json) {
                loadBooks();
        })
        .fail(function(xhr) {
                console.log('add error', xhr);
        })
        .always(function(xhr) {
                $('div.ajaxStatus').toggle();
        })
    }
    
    $('div#books').on('click', 'a.removeBtn', function() {
        var bookId = $(this).parent().parent().data('book-id');
        if (confirm('Do you really want to delete this book: (id:' + bookId + ')')) {
                removeBook(bookId);
                var message = $('<span>Book deleted</span>').fadeOut(5000);
                $('div.AddBookCont').find('div.message').append(message);
        }
    });
});

