import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import {makeGame, addPlayer, getGame, putGame} from './londonbridge-controller';

const https = require('https');
const fs = require('fs');
/*


// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

// Then pass these options to cors:
app.use(cors(options));

app.use(express.json());
*/

const app = express();
const allowedOrigins = ['https://aitanbachrach.github.io', 'http://localhost:3000/'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5001;
app.options('*', cors())
app.use(express.json());

const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/aitanbachrachserver.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/aitanbachrachserver.net/fullchain.pem'),
}, app);

app.post('/london-bridge/lobby/:id',async (req, res, next) =>{
  makeGame(req.params['id']).then((lbgame) => {
    res.status(200).json(lbgame)
    
  })
  .catch(err => {
    return res.status(409).json()
  })
})

app.put('/london-bridge/lobby/:id', async (req, res, next) =>{
  addPlayer(req.params['id']).then((lbgame) => {
    res.status(200).json(lbgame)
  })
  .catch(err => {
    return res.status(404).json()
  })
})

app.get('/london-bridge/:id',async (req, res, next) => {
  getGame(req.params['id']).then((lbgame) =>{
    res.status(200).json(lbgame)
  })
  .catch(err =>{
    return res.status(404).json
  })
})

app.put('/london-bridge/:id',async (req, res, next) => {
  console.log('here')
  console.log(req.body)
  putGame(req.params['id'], req.body).then((lbgame) =>{
    res.status(200).json(lbgame)
  })
  .catch(err => {
    return res.status(404).json
  })
})

app.all('/london-bridge/:id', () =>{
  console.log('perhaps a cors issue')
})

httpsServer.listen(443, () => {
  console.log(`Server running at port: 443`);
});
