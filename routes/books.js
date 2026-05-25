const express = require("express");
const book= require("../data/books.json")
const user = require("../data/user.json")

const router = express.Router();

// ************************************************************************
// in all URl we have to adding one extra /books  because of  in  index.js  we add one 

/**
 * Route (API endpoint )- "/books"
 * method - GET
 * description - get the books from the system 
 * Access - public 
 * parameters - none
 */

router.get("/books",(req,res)=>{
    res.status(200).json({
        success: true,
        data : book
    })
})


/**
 * Route (API endpoint )- "/books/id"
 * method - GET
 * description - Get a bokk by their ID 
 * Access - public 
 * parameters - id
 */

router.get("/books/:id",(req,res)=>{
    const {id} = req.params;

    const foundBook =book.books.find((each)=> each.id == id)

    if (!foundBook){
        return res.status(404).json({
            success: false,
            message : `Book not found for this id ${id}`
        })
    }

    res.status(200).json({
        success : true,
        data : foundBook

    })

})


/**
 * Route (API endpoint )- "/books"
 * method - POST
 * description - Create/Register a new book
 * Access - public 
 * parameters - id
 */


router.post("/books",(req,res)=>{
    const {id,name,author,genre,price,publisher} = req.body;

    if (!id || !name || !author || !genre || !price || !publisher){
       return  res.status(404).json({
            success : false,
            message : " please provide all required details"

        })
    }

    const exitbook =book.books.find((each)=> each.id == id)

    if (exitbook){
        return res.status(409).json({
            success : false,
            message : ` book already exits with id ${id}`
        })
    }

    book.books.push({id,name,author,genre,price,publisher})

    res.status(202).json({
        success : true,
        message : "book added succesfully"
    })
})

/**
 * Route (API endpoint )- "/books/:id"
 * method - PUT
 * description - Updating a book by their ID
 * Access - public 
 * parameters - id
 */

router.put("/books/:id", (req, res) => {

    const { id } = req.params;
    const { data } = req.body;

    // check if user exists
    const getbook = book.books.find(
        (each) => each.id == id
    );

    if (!getbook) {

        return res.status(404).json({
            success: false,
            message: `user not found for the id ${id}`
        });

    }

    // update user
    const updatebook = book.books.map((each) => {

        if (each.id == id) {

            return {
                ...each,
                ...data,
            };

        }

        return each;

    });

    res.status(200).json({
        success: true,
        data: updatebook,
        message: "successfully updated"
    });

});


/**
 * Route (API endpoint )- "/books/:id"
 * method - DELETE
 * description -  Delating a book by their ID
 * Access - public 
 * parameters - id
 */

router.delete("/books/:id",(req,res)=>{
    const {id} = req.params;

    // check if the user exist

    const existbook = book.books.find((each)=> each.id == id)
    if (!existbook) {
        return res.status(404).json({
            success : false,
            message :`book not found at id ${id}`
        })
    }

    // if user exist filterout that user 

    const updatedbook= book.books.filter((each)=> each.id !=id)

    res.status(200).json({
        success :true,
        data : updatedbook,
        message :"succesfully deleted the book"
    })
})


/**
 * Route (API endpoint )- "/books/issued/for-user"
 * method - GET
 * description - GET all issued book
 * Access - public 
 * parameters - NONE
 */

router.get("/books/issued/for-user",(req,res)=>{

    // get the users who have issued book

    const userWithIssuedbook = user.users.filter((each)=>{
        if(each.issuedBook){
            return each;
        }
    })

    const issuedBooks =[];

    userWithIssuedbook.forEach((each)=>{
        const  findbook = book.books.find((book)=> book.id == each.issuedBook);
        
        book.issuedby= each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(findbook);
    })

    if (!issuedBooks){
        return res.status(404).json({
            success:false,
            message :"no issued book found"
        })
    }

    res.status(200).json({
        success:true,
        data :issuedBooks
    })
})


module.exports = router;