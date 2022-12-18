import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { constants } from "http2";
import { IVideo } from "./@types";

export const app = express();
const port = 5002;

// Middleware

app.use(cors());
app.use(bodyParser.json());

let videos: IVideo[] = [
  {
    id: 1,
    title: "User 1",
    author: "1.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
  {
    id: 2,
    title: "User 2",
    author: "2.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
  {
    id: 3,
    title: "User 3",
    author: "3.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
  {
    id: 4,
    title: "User 4",
    author: "4.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
];

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/videos", (_: Request, res: Response) => {
  res.send(videos);
});

app.get("/videos/:videoId", (req: Request, res: Response) => {
  const id = req.params.videoId;
  const video = videos.find((v) => v.id.toString() === id);

  if (video) {
    res.send(video);
  } else {
    res.sendStatus(404);
  }
});

app.post("/videos", (req: Request, res: Response) => {
  const newVideo = {
    id: new Date().valueOf(),
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions ?? null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    canBeDownloaded: false,
    minAgeRestriction: null,
  };

  if (!req.body.title?.trim("")) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Title is required",
          field: "title",
        },
      ],
    });

    return;
  }

  if (req.body.title?.length > 40) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Title should be less then 40 symbols",
          field: "title",
        },
      ],
    });

    return;
  }

  if (!req.body.author?.trim("")) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Author is required",
          field: "author",
        },
      ],
    });

    return;
  }

  if (req.body.author?.length > 20) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Author should be less then 20 symbols",
          field: "author",
        },
      ],
    });

    return;
  }

  videos.push(newVideo);
  res.status(201).send(newVideo);
});

app.put("/videos/:id", (req: Request, res: Response) => {
  const video = videos.find((v) => v.id.toString() === req.params.id);

  if (!req.body.title || !req.body.title.trim("")) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Title is required",
          field: "title",
        },
      ],
    });

    return;
  }

  if (req.body.title.length > 40) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Title should be less then 40 symbols",
          field: "title",
        },
      ],
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

app.delete("/videos/:id", (req: Request, res: Response) => {
  const index = videos.findIndex((v) => v.id.toString() === req.params.id);

  if (index > -1) {
    videos.splice(index, 1);
    res.status(204).send(videos);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/testing/all-data", (_: Request, res: Response) => {
  videos = [];
  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
