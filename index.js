const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.set('view engine', 'ejs');
// publicディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));

const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}

let visitCount = 0;
let clickCount = 0;


const startTime = Date.now();

app.get('/user/:id', logMiddleware, (req, res) => {
  // :idをreq.params.idとして受け取る
  res.status(200).send(req.params.id);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

async function main() {
  await client.connect();
  const db = client.db('my-app');
  
  
  
  app.get('/', logMiddleware, async (req, res) => {
    visitCount++;
    const users = await db.collection('user').find().toArray();
    const names = users.map((user) => user.name);

    const uptime = Math.floor((Date.now() - startTime) / 1000); // サーバーの稼働時間を計算

    // uptime をテンプレートに渡す
    res.render(path.resolve(__dirname, 'views/index.ejs'), { users: names, count: visitCount, uptime });
});



  app.post('/api/user', express.json(), async (req, res) => {
    const name = req.body.name;
    if (!name) {
      res.status(400).send('Bad Request');
      return;
    }
    await db.collection('user').insertOne({ name: name });
    res.status(200).send('Created');
  });

  app.get('/counter-value', (req, res) => {
    res.json({ count: clickCount });
  });

  app.get('/increment', (req, res) => {
    clickCount++;
    res.status(204).send(); // 204 No Content
  });



  // ポート: 3000でサーバーを起動
  app.listen(3000, () => {
    // サーバー起動後に呼び出されるCallback
    console.log('start listening');
  });
}
main();