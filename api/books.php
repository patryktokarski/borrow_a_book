<?php

include_once '../db.config.inc.php';
include_once 'src/book.php';

$conn = new mysqli (
        DB_HOST,
        DB_USER,
        DB_PASS,
        DB_DATABASE
        );
if ($conn->connect_errno) {
    echo "Failed to connect to MYSQL";
}

$conn->set_charset('UTF-8');

if ($_SERVER['REQUEST_METHOD'] == "GET") {

    $sql_id = "SELECT id FROM books ORDER BY author, name";

    if (@$_GET['book_id'] != '' && intval($_GET['book_id'] > 0)) {
        $safe_book_id = $conn->real_escape_string($_GET['book_id']);
        $sql_id .= "AND = $safe_book_id";
    }
    $result = $conn->query($sql_id);
    $books = [];
    while ($row = $result->fetch_assoc()) {
        $book = new Book();
        $book->loadFromDB($conn, $row['id']);
        $books[] = $book; 
    }
    echo json_encode($books);
} else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $put_vars);

    $name = $put_vars['name'];
    $author = $put_vars['author'];
    $book_desc = $put_vars['book_desc'];
    
    $book = new Book();
    if ($book->create($conn, $name, $author, $book_desc)) {
        echo json_encode(['status' => 'OK']);
    } else {
        echo json_encode(['status' => 'SAVE ERROR']);
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $delete_vars);
    $book_id = @$delete_vars['book_id'];
    
    $book = new Book();
    if ($book->loadFromDB($conn, $book_id)) {
        if ($book->deleteFromDB($conn)) {
            echo json_encode(['status' => 'OK']);
        } else {
            echo json_encode(['status' => 'DELETE ERROR']);
        }
    } else {
        echo json_encode(['status' => 'LOAD ERROR']);
    }  
    
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $author = $_POST['author'];
    $name = $_POST['name'];
    $book_desc = $_POST['book_desc'];
    $book_id = $_POST['book_id'];
    
    echo $author, $name, $book_desc, $book_id;

    $book = new Book();
    if ( $book->loadFromDB($conn, $book_id) ) {
	if ( $book->update($conn, $name, $author, $book_desc) ) {

            echo json_encode(['status' => 'OK']);
        } else {

            echo json_encode(['status' => 'UPDATE ERROR']);
	}
    } else {

	echo json_encode(['status' => 'LOAD ERROR']);
    }
}


?>
