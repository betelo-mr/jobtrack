// ── Affiliate link configuration ──
// Udemy:    https://www.udemy.com/affiliate/
// Coursera: https://www.coursera.org/affiliates/
// Zastąp YOUR_UDEMY_ID i YOUR_COURSERA_ID swoimi ID po rejestracji

const AFFILIATE_IDS = {
  udemy:    'YOUR_UDEMY_ID',
  coursera: 'YOUR_COURSERA_ID',
}

export function getAffiliateUrl(platform, courseTitle) {
  const query = encodeURIComponent(courseTitle)

  switch (platform.toLowerCase()) {
    case 'udemy':
      if (AFFILIATE_IDS.udemy === 'YOUR_UDEMY_ID') {
        return `https://www.udemy.com/courses/search/?q=${query}`
      }
      return `https://click.linksynergy.com/deeplink?id=${AFFILIATE_IDS.udemy}&mid=39197&murl=${encodeURIComponent(`https://www.udemy.com/courses/search/?q=${query}`)}`

    case 'coursera':
      if (AFFILIATE_IDS.coursera === 'YOUR_COURSERA_ID') {
        return `https://www.coursera.org/search?query=${query}`
      }
      return `https://click.linksynergy.com/deeplink?id=${AFFILIATE_IDS.coursera}&mid=40328&murl=${encodeURIComponent(`https://www.coursera.org/search?query=${query}`)}`

    case 'youtube':
      return `https://www.youtube.com/results?search_query=${query}+tutorial`

    case 'skillshare':
      return `https://www.skillshare.com/search?query=${query}`

    case 'pluralsight':
      return `https://www.pluralsight.com/search?q=${query}`

    default:
      return `https://www.google.com/search?q=${encodeURIComponent(courseTitle + ' kurs online')}`
  }
}

export function trackCourseClick(platform, courseTitle) {
  // TODO: podpięcie pod analytics (np. Google Analytics / Plausible)
  console.log(`[Affiliate] Click: ${platform} – ${courseTitle}`)
}
