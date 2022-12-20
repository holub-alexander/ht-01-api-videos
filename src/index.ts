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
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
  {
    id: 2,
    title: "User 2",
    author: "2.eu",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
  {
    id: 3,
    title: "User 3",
    author: "3.eu",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2022-12-18T12:42:19.528Z",
    publicationDate: "2022-12-18T12:42:19.528Z",
    availableResolutions: ["P144"],
  },
];

const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

const getErrorsMessages = (arr: { message: string; field: string }[], field: string, message: string) => {
  arr.push({
    message,
    field,
  });
};

const requestBodyValidation = (req: Request, errors: any) => {
  try {
    if (!req.body.title?.trim("")) {
      getErrorsMessages(errors.errorsMessages, "title", "Title is required");
    }

    if (req.body.title?.length > 40) {
      getErrorsMessages(errors.errorsMessages, "title", "Title should be less then 40 symbols");
    }

    if (!req.body.author?.trim("")) {
      getErrorsMessages(errors.errorsMessages, "author", "Author is required");
    }

    if (req.body.author?.length > 20) {
      getErrorsMessages(errors.errorsMessages, "author", "Author field cannot be more than 20 characters");
    }

    if (req.body.publicationDate && typeof req.body.publicationDate !== "string") {
      getErrorsMessages(errors.errorsMessages, "publicationDate", "The publicationDate field must be a string");
    }

    if (req.body.availableResolutions) {
      if (typeof req.body.availableResolutions !== "object") {
        getErrorsMessages(
          errors.errorsMessages,
          "availableResolutions",
          "The availableResolutions field must contain a array values"
        );
      }

      if (!req.body.availableResolutions.every((v: any) => availableResolutions.includes(v))) {
        getErrorsMessages(
          errors.errorsMessages,
          "availableResolutions",
          "The given availableResolutions does not exist"
        );
      }
    }

    if (req.body.canBeDownloaded && typeof req.body.canBeDownloaded !== "boolean") {
      getErrorsMessages(
        errors.errorsMessages,
        "canBeDownloaded",
        "The canBeDownloaded field must contain a boolean value"
      );
    }

    if (typeof req.body.minAgeRestriction === "number") {
      if (req.body.minAgeRestriction < 1) {
        getErrorsMessages(
          errors.errorsMessages,
          "minAgeRestriction",
          "The minAgeRestriction field cannot be less than 1"
        );
      }

      if (req.body.minAgeRestriction > 18) {
        getErrorsMessages(
          errors.errorsMessages,
          "minAgeRestriction",
          "The minAgeRestriction field cannot be greater than 18"
        );
      }
    }
  } catch (err) {
    console.log("err", err);
  }
};

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
  const errors = { errorsMessages: [] };

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

  requestBodyValidation(req, errors);

  if (errors.errorsMessages.length > 0) {
    res.status(400).send(errors);
    return;
  }

  videos.push(newVideo);
  res.status(201).send(newVideo);
});

app.put("/videos/:id", (req: Request, res: Response) => {
  const errors = { errorsMessages: [] };
  const video = videos.find((v) => v.id.toString() === req.params.id);

  const newPublicationDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();

  requestBodyValidation(req, errors);

  if (errors.errorsMessages.length > 0) {
    res.status(400).send(errors);
    return;
  }

  if (video) {
    video.title = req.body.title;
    video.author = req.body.author;
    video.availableResolutions = req.body.availableResolutions ?? null;
    video.minAgeRestriction = req.body.minAgeRestriction ?? null;
    video.publicationDate = req.body.publicationDate ?? newPublicationDate;

    if (req.body.canBeDownloaded) {
      video.canBeDownloaded = req.body.canBeDownloaded;
    }

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
