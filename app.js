const express = require("express");
const morgan = require("morgan");
const app = express();
const applist = require("./applist.js");

app.use(morgan("common"));

app.get("/apps", (req, res) => {
  const { search = "", sort, genres } = req.query;

  if (sort) {
    if (!["Rating", "App"].includes(sort)) {
      return res
        .status(400)
        .send("sort must be either rating or app, dipshit.");
    }
  }

  if (genres) {
    if (
      !["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send(
          "genre must be Action, Puzzle, Strategy, Casual, Arcade, or Card please."
        );
    }
  }

  //where does the filtering using genres occur?

  let results = applist.filter((app) =>
    app.App.toLowerCase().includes(search.toLowerCase().trim())
  );

  if (genres) {
    results = results.filter((app) => app.Genres.includes(genres));
  }

  //how to sort by app name or rating?  Does it matter that rating is a #?

  if (sort) {
    results.sort((a, b) => {
      return b[sort] - a[sort];
    });
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log("Server app is running at http://localhost:8000");
});
