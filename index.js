import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const APIKey = "ec3fc49033e5121776449054d21409e7";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", async (req, res) => {
  const city = "London";
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`, {
      params: {
        apiKey: APIKey,
      }
    });

    const result = response.data;

    const temp = Math.round(result.main.temp); // current temperature round off
    const condition = result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1); 

    // city's time and date
    const convertTimezone = result.timezone / 3600;
    const date = new Date(result.dt * 1000);

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: `Etc/GMT${convertTimezone >= 0 ? "-":"+"}${Math.abs(convertTimezone)}`,
      hour12: true,
    }

    const sixDaysData = await getDatafor6days(city);

    res.render("index.ejs", { data: result, 
      date: date.toLocaleString("en-US", options),
      temperature: temp,
      weatherCondition: condition,
      sixDaysData: sixDaysData
     });
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
}); 



app.post("/city-temp", async (req, res) => {
  const city = req.body.city;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`, {
      params: {
        apiKey: APIKey,
      }
    });

    const result = response.data;
    // console.log(result);
    const temp = Math.round(result.main.temp); // current temperature round off
    const condition = result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1);

    // city's time and date
    const convertTimezone = result.timezone / 3600;
    const date = new Date(result.dt * 1000);

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: `Etc/GMT${convertTimezone >= 0 ? "-":"+"}${Math.abs(convertTimezone)}`,
      hour12: true,
    }
    
    const sixDaysData = await getDatafor6days(city);

    res.render("index.ejs", { data: result, 
      date: date.toLocaleString("en-US", options),
      temperature: temp,
      weatherCondition: condition,
      sixDaysData: sixDaysData
      });
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
});

const getDatafor6days = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`);
    return response.data.list;

  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
}

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});