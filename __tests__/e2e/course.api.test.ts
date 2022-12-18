import request from "supertest";
import { app } from "../../src";
import { constants } from "http2";

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("should return 204 and empty array", () => {
    request(app).get("/videos").expect(204, []);
  });

  it("should return 404 for not existing course", async () => {
    await request(app).get("/videos/20").expect(404);
  });

  it("shouldn't create video with incorrect input data", async () => {
    await request(app)
      .post("/videos")
      .send({
        author: "Author",
      })
      .expect(constants.HTTP_STATUS_BAD_REQUEST, {
        errorsMessages: [
          {
            message: "Title is required",
            field: "title",
          },
        ],
      });
  });

  let createdVideo: any = null;

  it("should create video with correct input data", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .send({ title: "Video title", author: "it-incubator.eu", availableResolutions: ["P144", "P143"] })
      .expect(constants.HTTP_STATUS_CREATED);

    createdVideo = createResponse.body;

    expect(createdVideo).toEqual({
      id: expect.any(Number),
      title: "Video title",
      author: "it-incubator.eu",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: ["P144", "P143"],
    });

    await request(app).get("/videos").expect(constants.HTTP_STATUS_OK, [createdVideo]);
  });

  // it("shouldn't update video with incorrect input data", async () => {
  //   await request(app)
  //     .put(`/videos/${createdVideo.id}`)
  //     .send({
  //       title: "",
  //     })
  //     .expect(constants.HTTP_STATUS_BAD_REQUEST, {
  //       errorsMessages: [
  //         {
  //           message: "Title is required",
  //           field: "title",
  //         },
  //       ],
  //     });
  //
  //   await request(app).get(`/videos`).expect(constants.HTTP_STATUS_OK, [createdVideo]);
  // });
  //
  // it("should update video with correct input data", async () => {
  //   await request(app)
  //     .put(`/videos/${createdVideo.id}`)
  //     .send({
  //       title: "Video title update",
  //     })
  //     .expect(constants.HTTP_STATUS_NO_CONTENT);
  //
  //   await request(app)
  //     .get(`/videos/${createdVideo.id}`)
  //     .expect(constants.HTTP_STATUS_OK, { ...createdVideo, title: "Video title update" });
  // });

  it("should delete video", async () => {
    await request(app).delete(`/videos/${createdVideo.id}`).expect(constants.HTTP_STATUS_NO_CONTENT);

    await request(app).get("/videos").expect(constants.HTTP_STATUS_OK, []);
  });
});
