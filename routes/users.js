const express = require("express");
const user  = require("../data/user.json")


const router  = express.Router();

// in all URl we have to adding one extra /users  because of  in  index.js  we

/**
 * Route (API endpoint )- "/users"
 * method - GET
 * description - get the user from the system 
 * Access - public 
 * parameters - none
 */

router.get("/users",(req,res)=>{
    res.status(200).json({
        success: true,
        data :user
    })
})

/**
 * Route (API endpoint )- "/users/id"
 * method - GET
 * description - Get a user by their ID 
 * Access - public 
 * parameters - id
 */

router.get("/users/:id",(req,res)=>{
    const {id} = req.params;

    const foundUser =user.users.find((each)=> each.id == id)

    if (!foundUser){
        return res.status(404).json({
            success: false,
            message : `User not found for this id ${id}`
        })
    }

    res.status(200).json({
        success : true,
        data : foundUser

    })

})

/**
 * Route (API endpoint )- "/users"
 * method - POST
 * description - Create/Register a new user
 * Access - public 
 * parameters - id
 */


router.post("/users",(req,res)=>{
    const {id,name,surname,email,subscriptionType,subscriptionDate} = req.body;

    if (!id || !name || !surname || !email || !subscriptionType || !subscriptionDate){
       return  res.status(404).json({
            success : false,
            message : " please provide all required details"

        })
    }

    const exituser =user.users.find((each)=> each.id == id)

    if (exituser){
        return res.status(409).json({
            success : false,
            message : ` user already exits with id ${id}`
        })
    }

    user.users.push({id,name,surname,email,subscriptionType,subscriptionDate})

    res.status(202).json({
        success : true,
        message : "user created succesfully"
    })
})


/**
 * Route (API endpoint )- "/users/:id"
 * method - PUT
 * description - Updating a user by their ID
 * Access - public 
 * parameters - id
 */

router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { data } = req.body;

    // check if user exists
    const getUser = user.users.find(
        (each) => each.id == id
    );

    if (!getUser) {

        return res.status(404).json({
            success: false,
            message: `user not found for the id ${id}`
        });

    }

    // update user
    const updateUser = user.users.map((each) => {

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
        data: updateUser,
        message: "successfully updated"
    });

});


/**
 * Route (API endpoint )- "/users/:id"
 * method - DELETE
 * description -  Delating a user by their ID
 * Access - public 
 * parameters - id
 */

router.delete("/users/:id",(req,res)=>{
    const {id} = req.params;

    // check if the user exist

    const existUser = user.users.find((each)=> each.id == id)
    if (!existUser) {
        return res.status(404).json({
            success : false,
            message :`user not found at id ${id}`
        })
    }

    // if user exist filterout that user 

    const updatedUser = user.users.filter((each)=> each.id !=id)

    res.status(200).json({
        success :true,
        data : updatedUser,
        message :"succesfully deleted the user"
    })
})



/**
 * Route (API endpoint )- "/users/subscription-details/:id"
 * method - GET
 * description - get subscription details by using user id
 * Access - public
 * parameters - id
 */

router.get("/users/subscription-details/:id", (req, res) => {

    const { id } = req.params;

    const findUser = user.users.find((each) => each.id == id);

    if (!findUser) {
        return res.status(404).json({
            success: false,
            message: `User not found at id ${id}`
        });
    }

    // Convert date into total days
    const getDateInDays = (date = "") => {

        let currentDate;

        if (date) {
            currentDate = new Date(date);
        } else {
            currentDate = new Date();
        }

        return Math.floor(currentDate.getTime() / (1000 * 60 * 60 * 24));
    };

    // Calculate subscription expiration
    const subscriptionType = (subscriptionDate) => {

        if (findUser.subscriptionType === "Basic") {
            return subscriptionDate + 90;
        }

        else if (findUser.subscriptionType === "Standard") {
            return subscriptionDate + 180;
        }

        else if (findUser.subscriptionType === "Premium") {
            return subscriptionDate + 365;
        }

        return subscriptionDate;
    };

    // Dates calculation
    let returnDate = getDateInDays(findUser.returnDate);

    let currentDate = getDateInDays();

    let subscriptionDate = getDateInDays(findUser.subscriptionDate);

    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...findUser,

        subscriptionExpired:
            subscriptionExpiration < currentDate,

        subscriptionDatesLeft:
            subscriptionExpiration - currentDate,

        daysLeftForExpiration:
            returnDate - currentDate,

        returnDate:
            returnDate < currentDate
                ? "Book is overdue"
                : returnDate,

        fine:
            returnDate < currentDate
                ? (subscriptionExpiration <= currentDate ? 200 : 100)
                : 0
    };

    res.status(200).json({
        success: true,
        data
    });

});


module.exports = router;
