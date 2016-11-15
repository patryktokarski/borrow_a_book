$(document).ready(function() {
    console.log('DOM zaladowany');
    var endpoint = window.location + 'api/books.php';
    
    function loadBooks() {
        $('div.ajaxStatus').toggle();
        $.get(endpoint, function(json) {
            $('table#ksiazki').find('tr.book').remove();
            $('table#ksiazki .info').remove();
            var ksiazki = JSON.parse(json);
            
            for (var i = 0; i < ksiazki.length; i++) {
                var ksiazka = $('<tr class="book" data-book-id='+ ksiazki[i].id + '>\n\
                                <td class="title">'+ ksiazki[i].name +'</td>\n\
                                <td><a class="remove" href="#">Usun</a></td></tr>');
                
                $('table#ksiazki').append(ksiazka);
                
                
                var informacje = $('<div class="info" data-book-id="'+ksiazki[i].id+'" style = "display:none">\n\
                                    <p> '+ ksiazki[i].author +'</p><p>'+ ksiazki[i].book_desc +'</p>\n\
                                    <a class="edit" href="#">Edytuj</a></div>');
              
                ksiazka.after(informacje);
                
            }
            $('div.ajaxStatus').toggle();
        });
    }  

    loadBooks();
    
    $('table#ksiazki').on('click', '.title',function() {
        var bookId = $(this).parent().attr('data-book-id');
        $('div[data-book-id="' + bookId + '"]').slideToggle();
        
    });

    $('a#refresh').on('click', function() {
        loadBooks();
    });
    
    $('table#ksiazki').on('click', '.edit', function() {
        
        var name = $(this).parent().prev().find('td.title').text();        
        var author = $(this).parent().first().find('p').eq(0).text();
        var book_desc = $(this).parent().first().find('p').eq(1).text();
        
        if(!$(this).parent().next().hasClass('editForm')) {
             var editForm = $('<div class="editForm" data-book-id = "'+ $(this).parent().attr('data-book-id') +'"style="display:none">\n\
                                 <p>Formularz edycji</p>\n\
                                 <label>Tytuł:</label><input name="name" value="' + name + '">\n\
                                 <label>Autor:</label><input name="author" value="' + author + '">\n\
                                 <label>Opis ksiazki:</label><input name="book_desc" value="' + book_desc + '">\n\
                                 <a class="saveForm" href="#">Zapisz</a>\n\
                                 <a class="cancelForm" href="#">Anuluj</a>\n\
                               </div>');
             $(this).parent().after(editForm);
        }
        $(this).parent().next().slideDown();
    
    });
    
   
    $('table#ksiazki').on('click', '.cancel', function() {
        $('div.editForm').remove();
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
            console.log(json);
            
            $('table#ksiazki').find('div.editForm').remove();
            $('table#ksiazki').find('div.info').remove();

            loadBooks();
        })
	.fail(function(xhr) {
            console.log('update error', xhr);
	})
	.always(function(xhr) {
            $('div.ajaxStatus').toggle();
        });
    }
    
    $('table#ksiazki').on('click', 'a.saveForm', function(event) {
        event.preventDefault();
        var bookId = $(this).parent().data('book-id');
	var author = $(this).parents('div.editForm').find('input[name="author"]').prop('value');
	var name = $(this).parents('div.editForm').find('input[name="name"]').prop('value');
	var book_desc = $(this).parents('div.editForm').find('input[name="book_desc"]').prop('value');
	var book_id = $(this).parent().prev().prev().data('book-id');

	updateBook(author, name, book_desc, book_id);
    });    
    
    
    $('table#ksiazki').on('click', 'a.cancelForm', function() {
    $(this).parents('div').remove();
    
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

	console.log(author + name + book_desc);
	addBook(author, name, book_desc);
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
            console.log(json);
            loadBooks();
	})
	.fail(function(xhr) {
            console.log('add error', xhr);
	})
	.always(function(xhr) {
            $('div.ajaxStatus').toggle();
	})
    }
    
    $('table#ksiazki').on('click', 'a.remove', function() {
	var bookId = $(this).parents('tr.book').first().data('book-id');
	if ( confirm('Czy na pewno chcesz usunąć książkę (id:' + bookId + ')') ) {
            removeBook(bookId);
	}
    });
});

