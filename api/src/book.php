<?php

class Book implements JsonSerializable {
    private $id;
    private $name;
    private $author;
    private $book_desc;
     
    public function __construct($name = '', $author = '', $book_desc = '') {
        $this->id = -1;
        $this->name = $name;
        $this->author = $author;
        $this->book_desc = $book_desc;
    }
     
    function setName($name) {
        $this->name = $name;
    }
     
    function setAuthor($author) {
        $this->author = $author;
    }
     
    function setBook_desc($book_desc) {
        $this->book_desc = $book_desc;
    }
     
    function getId() {
        return $this->id;
    }
     
    function getName() {
        return $this->name;
    }
     
    function getAuthor() {
        return $this->author;
    }
     
    function getBook_desc() {
        return $this->book_desc;
    }
     
    public function loadFromDB($conn, $id) {
        $safe_id = $conn->real_escape_string($id);
        $sql = "SELECT name, author, book_desc FROM books WHERE id = '$safe_id'";
        //$sql = "SELECT * FROM books WHERE id = '$safe_id'";
        if ($result = $conn->query($sql)) {
            $row = $result->fetch_assoc();
            $this->id = $id;
            $this->name = $row['name'];
            $this->author = $row['author'];
            $this->book_desc = $row['book_desc'];
            return true;
        } else {
            return false;
        }
    }
     
    public function create($conn, $name, $author, $book_desc) {
        $safe_name = $conn->real_escape_string($name);
        $safe_author = $conn->real_escape_string($author);
        $safe_book_desc = $conn->real_escape_string($book_desc);
        $sql = "INSERT INTO books (name, author, book_desc) "
                 . "VALUES ('$safe_name', '$safe_author', '$safe_book_desc')";
        if ($reault = $conn->query($sql)) {
            $this->id = $conn->insert_id;
            $this->name = $name;
            $this->author = $author;
            $this->book_desc = $book_desc;
            return true;
        } else {
            return false;
        }
    }
     
    public function update($conn, $name, $author, $book_desc) {
        $safe_id = $conn->real_escape_string($this->id);
        $safe_name = $conn->real_escape_string($name);
        $safe_author = $conn->real_escape_string($author);
        $safe_book_desc = $conn->real_escape_string($book_desc);
        $sql = "UPDATE books SET name = '$safe_name', author = '$safe_author', book_desc = '$safe_book_desc' WHERE id = '$safe_id'";
         
        if ($result = $conn->query($sql)) {
             $this->id = $conn->insert_id;
             $this->name = $name;
             $this->author = $author;
             $this->book_desc = $book_desc;
             return true;
        } else {
             return false;
        }
    }
     
    public function deleteFromDB($conn) {
        $safe_id = $conn->real_escape_string($this->id);
        $sql = "DELETE FROM books WHERE id = '$safe_id'";
         
        if ($result = $conn->query($sql)) {
            $this->id = -1;
            $this->name = '';
            $this->author = '';
            $this->book_desc = '';
            return true;
        } else { 
            return false;
        }
    }
    
    public function jsonSerialize() {
        return [
            'id'        =>$this->id,
            'name'      =>$this->name,
            'author'    =>$this->author,
            'book_desc' =>$this->book_desc
        ];
    }
 }
 
?>
