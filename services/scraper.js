const puppeteer = require('puppeteer');
const { generateHash, readPreviousHash, saveCurrentHash } = require('../utils/hashUtils');
const Course = require('../models/Course');


async function fetchCourses(url, selectedArea, selectedDiv) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2'
    });

    const courseSectionHtml = await page.evaluate((selectedArea) => {
      const courseSection = document.querySelector(selectedArea);
      return courseSection ? courseSection.outerHTML : '';
    }, selectedArea);

    if (!courseSectionHtml) {
      console.log('Course section not found');
      return;
    }

    const currentHash = generateHash(courseSectionHtml);
    const previousHash = readPreviousHash();

    if (previousHash && previousHash === currentHash) {
      console.log('No changes detected, skipping crawling.');
      return;
    }

    console.log('Changes detected, crawling the data...');

    const courses = await page.evaluate((selectedDiv) => {
      const courseElements = document.querySelectorAll(selectedDiv);
      const coursesData = [];

      courseElements.forEach(el => {
        const courseLink = el.querySelector('a')?.getAttribute('href');
        const courseTitle = el.querySelector('a')?.innerText.trim();
        const institution = el.querySelector('p')?.innerText.trim();
        const description = el.nextElementSibling?.querySelector('p')?.innerText.trim();

        coursesData.push({
          courseTitle,
          courseLink: courseLink ? `https://www.studywithnewzealand.govt.nz${courseLink}` : '',
          institution,
          description,
        });
      });

      return coursesData;
    }, selectedDiv);

    console.log('Courses:', courses);

    // Save courses to MongoDB
    await Course.insertMany(courses, { ordered: false }),
    console.log('Courses saved to MongoDB');

    saveCurrentHash(currentHash);

  } catch (error) {
    console.error('Error fetching the data:', error);
  } finally {
    await browser.close();
  }
}

module.exports = { fetchCourses };
