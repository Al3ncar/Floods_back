import dotenv from 'dotenv'
dotenv.config()

import { app } from './src/app.js'

const portLocal = process.env.PORT_LOCAL || 3000
app.listen(portLocal, () => {
  console.log(`Rodando na porta: http://localhost:${portLocal}`)
})