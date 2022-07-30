
const fs = require('fs');
const glob = require('glob');
const express = require('express');
const cors = require("cors");
const path = require('path');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.post('/saveDiaryEntry', (req, res) => {
  if (!req.body) {
    console.error("empty body");
    res.sendStatus(500);
    return;
  }
  let dateTimeUTC = new Date().toLocaleString().split(",")[0].replaceAll("/", "_");
  console.log(dateTimeUTC);
  fs.writeFile(`./entries/${dateTimeUTC}.json`, JSON.stringify(req.body), (err) => {
    if (err) {
      console.error(err)
      res.status(500).send(err)
    }
    else {
      res.sendStatus(200)
    }
  });
})

app.get('/getDiaryEntries', (req, res) => {
  glob('./entries/*.json', async (error, filepaths) => {
    if (error) res.status(500).render('error', { error })
    const json = filepaths.map(filepath => ({
      name: path.basename(filepath).split(".json")[0],
      ...JSON.parse(fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' }))
    }));
    res.json(json)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
