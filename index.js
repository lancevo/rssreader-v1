/*
 * Copyright (C) 2017, Sencha Inc.
 */

const Feed = require('./lib/Feed'),
  express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const getUnixTime = dt => Math.floor(new Date(dt).getTime() / 1000);

app.post('/rssreader', async function(req, res) {
  const url = req.body.url;
  try {
    const data = await new Feed(url).fetch();
    res.send({
      total: data.length,
      feed: {
        entries: data.map(r => {
          return {
            title: r.title,
            author: r.author,
            permalinkUrl: r.link,
            categories: r.categories,
            url: url,
            published: getUnixTime(r.pubDate),
            content: r.description,
            summary: r.summary
          };
        })
      }
    });
  } catch (e) {
    console.dir(e);
    res.send(JSON.stringify(e));
  }
});

const port = 5678;
app.listen(port, () => {
  console.log('rssreader on port', port);
});
