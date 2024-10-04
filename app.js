const { connectToDatabase } = require("./connection.js");
const { fetchCourses } = require("./services/scraper.js");


async function main() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch and crawl courses
    const url='https://www.studywithnewzealand.govt.nz/en/study-options/course/results'
    const selectedArea='div.en-1472uo9'
    const selectedDiv='div.en-essd7v'
    await fetchCourses(url, selectedArea, selectedDiv);
  } catch (error) {
    console.error('Error running the application:', error);
  }
}

main();
