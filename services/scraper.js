const puppeteer = require('puppeteer');
const { generateHash, readPreviousHash, saveCurrentHash } = require('../utils/hashUtils');
const Course = require('../models/Course');

async function processCourses(page, selectedDiv) {
  return await page.evaluate((selectedDiv) => {
    const courseElements = document.querySelectorAll(selectedDiv);
    const coursesData = [];

    courseElements.forEach(el => {
      const courseLink = el.querySelector('a')?.getAttribute('href');
      const courseTitle = el.querySelector('a')?.innerText.trim();
      const institution = el.querySelector('p')?.innerText.trim();
      const description = el.nextElementSibling?.querySelector('p')?.innerText.trim();

      // Validate the scraped data before pushing it to the array
      if (courseTitle && institution) {
        coursesData.push({
          courseTitle,
          courseLink: courseLink ? `https://www.studywithnewzealand.govt.nz${courseLink}` : '',
          institution,
          description: description || '', // Default to empty string if no description
        });
      }
    });

    return coursesData;
  }, selectedDiv);
}

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

    // Use the new processCourses function to extract and validate course data
    const courses = await processCourses(page, selectedDiv);

    if (courses.length === 0) {
      console.log('No courses found to save.');
      return;
    }

    console.log('Courses:', courses);

     // Save courses to MongoDB with duplicate check
     for (const course of courses) {
        const existingCourse = await Course.findOne({
          courseTitle: course.courseTitle,
          courseLink: course.courseLink,
        });
  
        if (!existingCourse) {
          await Course.create(course);
          console.log(`Course saved: ${course.courseTitle}`);
        } else {
          console.log(`Course already exists: ${course.courseTitle}`);
        }
      }
  
    console.log('Courses saved to MongoDB');

    saveCurrentHash(currentHash);
    process.exit(0)

  } catch (error) {
    console.error('Error fetching the data:', error);
  } finally {
    await browser.close();
  }
}

module.exports = { fetchCourses };
