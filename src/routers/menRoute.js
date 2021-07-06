const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");

const MensRanking = require("../models/mensModel");

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

/**
* @swagger
* tags:
*   name: Olympic Player
*   description: The Olympic Player managing API
*/
/**
* @swagger
* /mens/login:
*   post:
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

router.post("/mens/login", async (req, res) =>
{
    const user = {
        id: Date.now(),
        userEmail: 'raj@gmail.com',
        password: '456789'
    }

    jwt.sign({ user }, 'secretkey', (error, token) =>
    {
        res.json({
            token
        })
    })
})
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

router.get("/mens", async (req, res) =>
{
    // jwt.verify(req.token, 'secretkey', async (error, Data) =>
    // {

    //     if (error)
    //     {
    //         res.sendStatus(403);
    //     } else
        // {
            try
            {
                const getMens = await MensRanking.find({}).sort({ ranking: 1 });
                res.status(201).send(getMens);
            } catch (error)
            {
                res.status(400).send(error);
            }
        // }
    // });

});

function verifyToken(req, res, next)
{
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined')
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

router.get("/mens/:id", async (req, res) =>
{
    try
    {
        const _id = req.params.id;
        const getMen = await MensRanking.findById({ _id });
        res.status(201).send(getMen);
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
    // jwt.verify(req.token, 'secretkey', async (error, Data) =>
    // {
    //     if (error)
    //     {
    //         res.sendStatus(403);
    //     } else
    //     {
            try
            {
                const addingMensRecords = await new MensRanking(req.body);
                console.log(req.body);
                const insertMens = addingMensRecords.save();
                res.status(201).send(insertMens);
            } catch (error)
            {
                res.status(500).send(error);
            }
    //     }
    // });
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

router.patch("/mens/:id", async (req, res) =>
{
    try
    {
        const _id = req.params.id;
        const getMen = await MensRanking.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        res.status(201).send(getMen);
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

router.delete("/mens/:id", async (req, res) =>
{
    try
    {
        const _id = req.params.id;
        const getMen = await MensRanking.findByIdAndDelete(_id);
        res.status(201).send(getMen);
    } catch (error)
    {
        res.status(500).send(error);
    }
});

module.exports = router;
