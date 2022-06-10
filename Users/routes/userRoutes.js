const User = require('../model/userModel')
const express = require('express')
const auth = require('../middleware/authentication')
const router = new express.Router()

router.post('/user/register', async(req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.createToken()
        res.status(201).send({ user: user.getUserProfile(), token })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByInput(req.body.email, req.body.password)
        const token = await user.createToken()
        res.send({ user: user.getUserProfile(), token })
    } catch (e) {
        res.status(400).json({
            message: 'Please register yourself',
        })
    }
})

router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/user/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/user/update/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstname', 'lastname', 'password', 'email', "phone"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({ error:'Invalid Updates' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send({ user: req.user.getUserProfile() })
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/user/remove/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send('User deleted')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router