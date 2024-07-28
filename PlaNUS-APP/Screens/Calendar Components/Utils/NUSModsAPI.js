const courseCache = {};

const isCacheValid = (timestamp) => {
  const now = new Date();
  const cacheDate = new Date(timestamp);
  const differenceInHours = Math.abs(now - cacheDate) / 36e5;
  return differenceInHours < 24;
};

const processSlots = (slots, lessonType) => {
  return slots
    .filter(slot => slot.lessonType === lessonType)
    .map(slot => ({
      classNo: slot.classNo,
      day: slot.day, // Keep the day as it is from the API
      startTime: slot.startTime,
      endTime: slot.endTime,
      weeks: slot.weeks,
      venue: slot.venue,
    }));
};

export const fetchCourseData = async (courseCode) => {
  if (courseCache[courseCode] && isCacheValid(courseCache[courseCode].timestamp)) {
    return [courseCache[courseCode].courseData];
  }

  const year = '2024-2025';  // Ensure this is the correct academic year
  const apiUrl = `https://api.nusmods.com/v2/${year}/modules/${courseCode}.json`;

  console.log(`Fetching course data from URL: ${apiUrl}`); // Log the URL

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Debugging: Log the received data
    console.log('Received data:', data);

    const courseData = {
      courseCode: data.moduleCode,
      courseTitle: data.title,
      lectureSlots: processSlots(data.semesterData[0]?.timetable || [], 'Lecture'),
      tutorialSlots: processSlots(data.semesterData[0]?.timetable || [], 'Tutorial'),
      labSlots: processSlots(data.semesterData[0]?.timetable || [], 'Laboratory'),
      seminarSlots: processSlots(data.semesterData[0]?.timetable || [], 'Seminar-Style Module Class'),
      recitationSlots: processSlots(data.semesterData[0]?.timetable || [], 'Recitation'),
      examDate: data.semesterData[0]?.examDate,
      examDuration: data.semesterData[0]?.examDuration
    };

    // Debugging: Log the processed course data
    console.log('Processed course data:', courseData);

    courseCache[courseCode] = {
      courseData,
      timestamp: new Date().toISOString(),
    };

    return [courseData];
  } catch (error) {
    console.error('Error fetching course data:', error);
    return [];
  }
};
