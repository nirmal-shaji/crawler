# Web Crawler Assignment

## Overview

This project is a web crawler designed to scrape course data from [Study with New Zealand](https://www.studywithnewzealand.govt.nz/en/study-options/course/results). The crawler fetches course details from the specified page, detects changes, and can be extended to handle additional paginated course pages.

## Features

- Scrapes course information including title, link, institution, and description.
- Detects changes by generating a hash of the scraped HTML content.
- Outputs the scraped data to the console.
- Can be easily extended to include pagination for crawling multiple pages.

## Prerequisites

To run this project, you will need:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [MongoDB](https://www.mongodb.com/) (local setup)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nirmal-shaji/crawler.git
   npm install
   node app.js
