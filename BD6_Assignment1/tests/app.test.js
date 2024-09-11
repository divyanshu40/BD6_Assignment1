let request = require("supertest");
let http = require("http");
let { app, getAllShows, getShowById, addShow, validateShow } = require("../index");



jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  getAllShows: jest.fn(),
  getShowById: jest.fn(),
  addShow: jest.fn(),
  validateShow: jest.fn((show) => {
    if (! show.title || typeof show.title !== "string") {
      return "Show title should be present and should be string";
    } else if (! show.theatreId || typeof show.theatreId !== "number") {
      return "Theatre id should be present and should be a number";
    } else if (! show.time || typeof show.time !== "string") {
      return "Show time should be present and should be string";
    } else {
      return null;
    }
  })
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 1: Get All Shows
  it("GET API /shows should retrieve all shows and return status code as 200", async () => {
    let mockedShows = [
      { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
      { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
      { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
      { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
    ];
    getAllShows.mockResolvedValue(mockedShows);
    let result = await request(server).get("/shows");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockedShows);
  });
  // Test 2: Get Show by ID
  it("GET API /shows/:id should retieve a show by id and return status code as 200", async () => {
    let mockedShow = {showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM'};
    getShowById.mockResolvedValue(mockedShow);
    let result = await request(server).get("/shows/4");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockedShow);
  });
  // Test 3: Add a New Show
  it("POST API /shows should add new show and return 201 as status code", async  () => {
    let addedShow = {
      showId: 5,
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM'
    };
    addShow.mockResolvedValue(addedShow);
    let result = await request(server).post("/shows").send({
      showId: 5,
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM'
    });
      expect(result.statusCode).toEqual(201);
      expect(result.body).toEqual(addedShow);
  });
  // Test 4: Error Handling for Get Show by Invalid ID
  it("GET API /shows/:id should return 404 as status code for invalid id", async () => {
    getShowById.mockResolvedValue([]);
    let result = await request(server).get("/shows/9");
    expect(result.statusCode).toEqual(404);
    expect(result.body.error).toEqual("Show not found");
  });
  // Test 5: Input Validation for Add Show
  it("POST API /shows should return an error message for invalid input", async () => {
    let addedShow = {title: 'Phantom of the Opera', theatreId: 2};
    addShow.mockResolvedValue({
      showId: 5,
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM'
    });
    let result = await request(server).post("/shows").send(addedShow);
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("Show time should be present and should be string");
  });
});

describe("Functions Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 6: Mock getAllShows Function
  it("getAllShows function should return all shows", () => {
    let mockedShows =  [
      { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
      { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
      { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
      { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
    ];
    getAllShows.mockReturnValue(mockedShows);
    let result = getAllShows();
    expect(result).toEqual(mockedShows);
    expect(result.length).toBe(4);
  });
  // Test 7: Mock Add Show Function (Async)
  it("AddShow function should return null for valid input or return an error message for invalid input", () => {
    expect(validateShow({title: 'Phantom of the Opera', theatreId: 2,  time: '5:00 PM'})).toBeNull();
    expect(validateShow({ theatreId: 2,  time: '5:00 PM'})).toEqual("Show title should be present and should be string");
    expect(validateShow({title: 'Phantom of the Opera', time: '5:00 PM'})).toEqual("Theatre id should be present and should be a number");
    expect(validateShow({title: 'Phantom of the Opera', theatreId: 2})).toEqual("Show time should be present and should be string");
  });
});