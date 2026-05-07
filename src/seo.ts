export interface SeoAnalysis {
  score: number;
  problems: string[];
}

export function analyzeSeo(title: string, description: string, tags: string[]): SeoAnalysis {
  let score = 0;
  const problems: string[] = [];

  // Title Logic
  const titleLen = title.trim().length;
  if (titleLen === 0) {
    problems.push("Title is empty.");
  } else if (titleLen < 40) {
    score += 10;
    problems.push("Title is too short. Aim for 40-70 characters.");
  } else if (titleLen > 70) {
    score += 15;
    problems.push("Title is too long. Keep it under 70 characters for best CTR.");
  } else {
    score += 25; // Perfect length
  }

  // Description Logic
  const descLen = description.trim().length;
  if (descLen === 0) {
    problems.push("Description is empty.");
  } else if (descLen < 250) {
    score += 10;
    problems.push("Description is too short. Aim for at least 250 characters.");
  } else if (descLen > 5000) {
    score += 15;
    problems.push("Description is near the YouTube maximum limits.");
  } else {
    score += 25; // Good length
  }

  // Tags Logic
  const validTags = tags.filter((t) => t.trim().length > 0);
  if (validTags.length === 0) {
    problems.push("No tags provided. Add 5-15 relevant tags.");
  } else if (validTags.length < 5) {
    score += 10;
    problems.push("Too few tags. Include 5-15 relevant tags.");
  } else if (validTags.length > 20) {
    score += 10;
    problems.push("Too many tags. Focus on highly relevant tags (under 20).");
  } else {
    score += 20; // Perfect amount
  }

  // Keyword relevance check
  if (titleLen > 0 && descLen > 0) {
    const titleWords = title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const descLower = description.toLowerCase().substring(0, 500);

    let matches = 0;
    for (const word of titleWords) {
      if (descLower.includes(word)) {
        matches++;
      }
    }

    if (titleWords.length === 0) {
       score += 15;
    } else if (matches === 0) {
      problems.push("Important keywords from your title do not appear in the first few lines of the description.");
    } else if (matches < (titleWords.length / 2)) {
      score += 15;
      problems.push("Try to include more of your title keywords in the first paragraph of your description.");
    } else {
      score += 30; // Great relevance
    }
  }

  // Normalize max 100
  if (titleLen === 0 && descLen === 0 && validTags.length === 0) {
    score = 0;
  }
  
  return { score: Math.min(Math.max(score, 0), 100), problems };
}
