import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(bodyParser.json());

const videos = [
  { id: 1, title: 'About JS - 01', author: '1.eu' },
  { id: 2, title: 'About JS - 02', author: '2.eu' },
  { id: 3, title: 'About JS - 03', author: '3.eu' },
  { id: 4, title: 'About JS - 04', author: '4.eu' },
  { id: 5, title: 'About JS - 05', author: '5.eu' },
];

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/videos', (req: Request, res: Response) => {
  res.send(videos);
});

app.get('/videos/:videoId', (req: Request, res: Response) => {
  const id = req.params.videoId;
  const video = videos.find((v) => v.id.toString() === id);

  if (video) {
    res.send(video);
  } else {
    res.sendStatus(404);
  }
});

app.post('/videos', (req: Request, res: Response) => {
  const newVideo = {
    id: new Date().valueOf(),
    title: req.body.title,
    author: 'it-incubator.eu',
  };

  videos.push(newVideo);
  res.status(201).send(newVideo);
});

app.put('/videos/:id', (req: Request, res: Response) => {
  const video = videos.find((v) => v.id.toString() === req.params.id);

  if (!req.body.title || !req.body.title.trim('')) {
    res.sendStatus(400).json({
      errorsMessages: [
        {
          message: 'Title is required',
          field: 'title',
        },
      ],
      resultCode: 1,
    });

    return;
  }

  if (req.body.title.length > 40) {
    res.sendStatus(400).json({
      errorsMessages: [
        {
          message: 'Title should be less then 40 symbols',
          field: 'title',
        },
      ],
      resultCode: 1,
    });

    return;
  }

  if (video) {
    video.title = req.body.title;

    res.status(204).send(videos);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/videos/:id', (req: Request, res: Response) => {
  const index = videos.findIndex((v) => v.id.toString() === req.params.id);

  if (index > 0) {
    const newVideos = videos.filter((_, i) => index !== i);

    console.log(newVideos);

    res.status(204).send(newVideos);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
