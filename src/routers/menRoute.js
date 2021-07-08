const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MensRanking = require("../models/mensModel");
const UserData = require("../models/userModel");


/**
 * @swagger
 * components:
 *   schemas:
 *     AuthSignup:
 *       type: object
 *       required:
 *         - useremail
 *         - name
 *         - password
 *         - confirmpassword 
 *     
 *       properties:
 *         useremail:
 *           type: string
 *           description: The email of user
 *         name:
 *           type: string
 *           description: The name of user
 *         password:
 *           type: string
 *           description: The password of user
 *         confirmpassword:
 *           type: string
 *           description: The confirmpassword of user
 *       example:
 *         useremail:apitest@gmail.com
 *         name:Christen COLEMAN
 *         password:alfa+number+signs
 *         confirmpassword:alfa+number+signs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthSignin:
 *       type: object
 *       required:
 *         - useremail
 *         - password 
 *       properties:
 *         useremail:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 *       example:
 *         useremail:apitest@gmail.com
 *         password:alfa+number+signs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     mens:
 *       type: object
 *       required:
 *         - ranking
 *         - name
 *         - dob
 *         - country
 *         - score
 *         - event
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the player
 *         name:
 *           type: string
 *           description: The name of player
 *         dob:
 *           type: string
 *           description: The dob of player
 *         coutry:
 *           type: string
 *           description: The country of player
 *         score:
 *           type: number
 *           description: The score of player
 *         event:
 *           type: string
 *           description: The event of player
 *       example:
 *         ranking:1
 *         name:Christen COLEMAN
 *         dob:1996-03-05
 *         country:USA
 *         score:1477
 */


//Verify Token Function-------------->
function verifyToken(req, res, next)
{
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader != 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else
    {
        res.sendStatus(403);
    }
}

/**
* @swagger
* tags:
*   name: Authentication
*   description: The Olympic Player managing API Authentication
*/

/**
* @swagger
* /user:
*   get:
*     summary: Returns the list of all the Users
*     tags: [Authentication]
*     responses:
*       201:
*         description: The list of the Users
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/AuthSignup'
*/


router.get("/user", verifyToken, async (req, res) =>
{
    try
    {
        const verify = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!verify)
        {
            res.status.json({ error: "Not valide Token" });
        } else
        {
            const getUser = await UserData.find({}).sort({ ranking: 1 });
            res.status(201).send(getUser);
        }
    } catch (error)
    {
        res.status(400).send(error);
    }


});

/**
* @swagger
* /signin:
*   post:
*     summary: Create a new Auth for Access
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/AuthSignin'
*     responses:
*       201:
*         description: The Player was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/AuthSignin'
*       500:
*         description: Some server error
*/

router.post("/signin", async (req, res) =>
{

    try
    {
        const { useremail, password, } = req.body;

        if (!useremail || !password)
        {
            return res.status(400).json({ error: "plz filled the field properly" });
        }

        const userLogin = await UserData.findOne({ useremail: useremail });

        if (userLogin)
        {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            res.status(201).json({ message: `${token}` });
            if (!isMatch)
            {
                return res.status(400).json({ error: "Invalid Credientials" });
            } else
            {
                return res.json({ message: "user Signin Successfully" });
            }
        } else
        {
            return res.status(400).json({ error: "Invalid Credientials" });

        }

    } catch (error)
    {
        res.status(500).send(error);
    }
});

/**
* @swagger
* /signup:
*   post:
*     summary: Create a new Auth for Access
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/AuthSignup'
*     responses:
*       201:
*         description: The Player was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/AuthSignup'
*       500:
*         description: Some server error
*/

router.post("/signup", async (req, res) =>
{
    const { useremail, name, password, confirmpassword } = req.body;

    if (!useremail || !name || !password || !confirmpassword)
    {
        return res.status(422).json({ error: "plz filled the field properly" });
    }

    try
    {

        const userExist = await UserData.findOne({ useremail: useremail });
        if (userExist)
        {
            return res.status(422).json({ error: "Email already Exist" });
        } else if (password != confirmpassword)
        {
            return res.status(422).json({ error: "Password Not Match" })
        }
        const user = new UserData({ useremail, name, password, confirmpassword });

        const userRegister = await user.save();

        if (userRegister)
        {
            res.status(201).json({ message: "user registerd successfully" });
        } else
        {
            res.status(500).json({ message: "failed to register" });

        }
    } catch (error)
    {
        res.status(500).send(error);
    }
});

//------------------------------------------------------------------//
//-------------------------------------------------------------------//


/**
* @swagger
* tags:
*   name: Olympic Player
*   description: The Olympic Player managing API
*/

/**
* @swagger
* /mens:
*   get:
*     summary: Returns the list of all the Olympic Player
*     tags: [Olympic Player]
*     responses:
*       201:
*         description: The list of the Olympic Player
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/mens'
*/

//we will handle get req....

router.get("/mens", verifyToken, async (req, res) =>
{
    try
    {
        const verify = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!verify)
        {
            res.status.json({ error: "Not valide Token" });

        } else
        {
            const getMens = await MensRanking.find({}).sort({ ranking: 1 });
            res.status(201).send(getMens);
        }
    } catch (error)
    {
        res.status(400).send(error);
    }


});

/**
* @swagger
* /mens/{id}:
*   get:
*     summary: Get the Player by id
*     tags: [Olympic Player]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The mens id
*     responses:
*       201:
*         description: The Player description by id
*         contens:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/mens'
*       404:
*         description: The Player was not found
*/
//we will handle get req of single user...

router.get("/mens/:id", verifyToken, async (req, res) =>
{
    try
    {
        const verify = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!verify)
        {
            res.status.json({ error: "Not valide Token" });

        } else
        {
            const _id = req.params.id;
            const getMen = await MensRanking.findById({ _id });
            res.status(201).send(getMen);
        }
    } catch (error)
    {
        res.status(400).send(error);
    }
});

/**
* @swagger
* /mens:
*   post:
*     summary: Create a new Player
*     tags: [Olympic Player]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/mens'
*     responses:
*       201:
*         description: The Player was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/mens'
*       500:
*         description: Some server error
*/
//we will handle post req....

router.post("/mens", verifyToken, async (req, res) =>
{

    try
    {
        const verify = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!verify)
        {
            res.status.json({ error: "Not valide Token" });

        } else
        {
            const addingMensRecords = new MensRanking(req.body);
            console.log(req.body);
            const insertMens = await addingMensRecords.save();
            res.status(201).send(insertMens);
        }
    } catch (error)
    {
        res.status(500).send(error);
    }
});

/**
* @swagger
* /mens/{id}:
*  patch:
*    summary: Update the Player by the id
*    tags: [Olympic Player]
*    parameters:
*      - in: path
*        name: id
*        schema:
*          type: string
*        required: true
*        description: The Player id
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/mens'
*    responses:
*      201:
*        description: The Player was updated
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/mens'
*      404:
*        description: The Player was not found
*      500:
*        description: Some error happened
*/

//we will handle patch req of single user...

router.patch("/mens/:id", verifyToken, async (req, res) =>
{
    try
    {
        const verify = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!verify)
        {
            res.status.json({ error: "Not valide Token" });

        } else
        {
            const _id = req.params.id;
            const getMen = await MensRanking.findByIdAndUpdate(_id, req.body, {
                new: true,
            });
            res.status(201).send(getMen);
        }
    } catch (error)
    {
        res.status(500).send(error);
    }
});

/**
* @swagger
* /mens/{id}:
*   delete:
*     summary: Remove the Player by id
*     tags: [Olympic Player]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The Player id
* 
*     responses:
*       201:
*         description: The Player was deleted
*       500:
*         description: The player was not found
*/

//we will handle delete req of single user...

router.delete("/mens/:id", verifyToken, async (req, res) =>
{
    try
    {
        const verify = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!verify)
        {
            res.status.json({ error: "Not valide Token" });

        } else
        {
            const _id = req.params.id;
            const getMen = await MensRanking.findByIdAndDelete(_id);
            res.status(201).send(getMen);
        }
    } catch (error)
    {
        res.status(500).send(error);
    }
});

module.exports = router;
