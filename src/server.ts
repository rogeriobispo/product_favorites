import express from 'express'

import 'express-async-errors'

const app = express()
app.use(express.json())

app.listen(3000, `Listening on port 3000`)
