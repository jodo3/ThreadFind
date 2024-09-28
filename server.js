import express from 'express';
import { searchComments } from './search.js'

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async(req, res) => {
  res.render("index");
})

app.get('/search', async (req, res) => {
  const { threads, pages, errors } = await searchComments(req.query.video, req.query.user || undefined);
  if (errors) {
    res.render("searchError", {
      vidurl: req.query.video,
      errors
    })
  }
  else {
    res.render("results", {
      vidurl: req.query.video,
      user: req.query.user || "OP channel",
      threads,
      pages,
    });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})