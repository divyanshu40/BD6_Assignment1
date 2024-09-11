let express = require("express");
let cors = require("cors");
let app = express();
app.use(cors());
app.use(express.json());

let theatres = [
  { theatreId: 1, name: 'Regal Cinemas', location: 'Downtown' },
  { theatreId: 2, name: 'AMC Theatres', location: 'Midtown' },
  { theatreId: 3, name: 'Cinemark', location: 'Uptown' },
];

let shows = [
  { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
  { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
  { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
  { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
];
// function to get all shows
async function getAllShows() {
  return shows;
}
// function to get show by id
 async function getShowById(id) {
  return shows.find((show) => show.showId === id);
}
// function to add new show
 async function addShow(newShowData) {
  let addedShow = { showId: shows.length + 1, ...newShowData};
  shows.push(addedShow);
  return addedShow;
}
// validation function to add show
 function validateShow(show) {
  if (! show.title || typeof show.title !== "string") {
    return "Show title should be present and should be string";
  } else if (! show.theatreId || typeof show.theatreId !== "number") {
    return "Theatre id should be present and should be a number";
  } else if (! show.time || typeof show.time !== "string") {
    return "Show time should be present and should be string";
  } else {
    return null;
  }
}

// Exercise 1: Get All Shows
app.get("/shows", async (req, res) => {
  try {
    let result = await getAllShows();
    if (result.length === 0) {
      return res.status(404).json({ error: "No shows found"});
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error"});
  }
});
// Exercise 2: Get Show by ID
app.get("/shows/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await getShowById(id);
    if (! result) {
      return res.status(404).json({ error: "Show not found"});
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error"});
  }
});
// Exercise 3: Add a New Show
app.post("/shows", async (req, res) => {
  let newShowData = req.body;
  try {
    let error = validateShow(newShowData);
    if (error) {
      return res.status(400).send(error);
    }
    let result = await addShow(newShowData);
    return res.status(201).json(result); 
  } catch (error) {
    res.status(500).json({ error: "Internal server error"});
  }
});
module.exports = { app, getAllShows, getShowById, addShow, validateShow };