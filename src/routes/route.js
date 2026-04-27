import express from "express"
import { Router } from "express"

const router = Router()

router.get('/get', (req, res) => {
  res.send('Teste de api')
})
 
export {router}