export type AssessmentStatus = "good" | "improvement" | "problem";
export type AssessmentGroup = "seo" | "readability";

export interface ContentDraft {
  title: string;
  seoTitle: string;
  slug: string;
  description: string;
  content: string;
  focusKeyword: string;
  canonical: string;
  schemaType: string;
  noindex: boolean;
  nofollow: boolean;
  socialTitle: string;
  socialDescription: string;
  customFields?: Record<string, string>;
}

export interface Assessment {
  id: string;
  title: string;
  detail: string;
  status: AssessmentStatus;
  group: AssessmentGroup;
  weight: number;
}

export interface AnalysisResult {
  score: number;
  seoScore: number;
  readabilityScore: number;
  assessments: Assessment[];
  metrics: {
    words: number;
    sentences: number;
    paragraphs: number;
    readingMinutes: number;
    keywordDensity: number;
    averageSentenceLength: number;
    readability: number;
    internalLinks: number;
    externalLinks: number;
  };
}

const transitionWords = [
  "also",
  "because",
  "but",
  "consequently",
  "finally",
  "first",
  "for example",
  "however",
  "instead",
  "meanwhile",
  "moreover",
  "next",
  "therefore",
  "thus",
  "yet",
];

const cleanText = (value: string) =>
  value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const wordsOf = (value: string) => cleanText(value).match(/[\p{L}\p{N}'’-]+/gu) ?? [];

const sentencesOf = (value: string) => {
  const cleaned = cleanText(value);
  if (!cleaned) return [];
  return cleaned.split(/[.!?]+(?:\s|$)/).map((sentence) => sentence.trim()).filter(Boolean);
};

const countSyllables = (word: string) => {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, "");
  if (normalized.length <= 3) return 1;
  const trimmed = normalized.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "").replace(/^y/, "");
  return Math.max(1, trimmed.match(/[aeiouy]{1,2}/g)?.length ?? 1);
};

const includesPhrase = (value: string, phrase: string) =>
  Boolean(phrase.trim()) && value.toLocaleLowerCase().includes(phrase.trim().toLocaleLowerCase());

const assessment = (
  id: string,
  title: string,
  detail: string,
  status: AssessmentStatus,
  group: AssessmentGroup,
  weight = 1,
): Assessment => ({ id, title, detail, status, group, weight });

const scoreGroup = (items: Assessment[], group: AssessmentGroup) => {
  const selected = items.filter((item) => item.group === group);
  const total = selected.reduce((sum, item) => sum + item.weight, 0);
  const earned = selected.reduce((sum, item) => {
    const factor = item.status === "good" ? 1 : item.status === "improvement" ? 0.52 : 0.08;
    return sum + item.weight * factor;
  }, 0);
  return Math.round((earned / Math.max(total, 1)) * 100);
};

export function analyzeContent(draft: ContentDraft): AnalysisResult {
  const analysisContent = `${draft.content}\n\n${Object.values(draft.customFields ?? {}).join("\n")}`.trim();
  const keyword = draft.focusKeyword.trim();
  const words = wordsOf(analysisContent);
  const sentences = sentencesOf(analysisContent);
  const paragraphs = analysisContent.split(/\n\s*\n/).filter((part) => cleanText(part)).length;
  const normalizedWords = words.map((word) => word.toLocaleLowerCase());
  const keywordWords = wordsOf(keyword).map((word) => word.toLocaleLowerCase());
  const keywordOccurrences = keywordWords.length
    ? normalizedWords.reduce((count, _, index) => {
        const matches = keywordWords.every((word, offset) => normalizedWords[index + offset] === word);
        return matches ? count + 1 : count;
      }, 0)
    : 0;
  const keywordDensity = words.length ? (keywordOccurrences * Math.max(keywordWords.length, 1) * 100) / words.length : 0;
  const averageSentenceLength = sentences.length ? words.length / sentences.length : 0;
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const readability = sentences.length && words.length
    ? Math.max(0, Math.min(100, 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length)))
    : 0;
  const firstTenth = cleanText(analysisContent).slice(0, Math.max(180, Math.floor(cleanText(analysisContent).length * 0.1)));
  const headings = analysisContent.match(/^#{1,6}\s+.+$/gm) ?? [];
  const hasKeywordHeading = headings.some((heading) => includesPhrase(heading, keyword));
  const internalLinks = (analysisContent.match(/\[[^\]]+\]\(\/(?!\/)[^)]+\)/g) ?? []).length;
  const externalLinks = (analysisContent.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) ?? []).length;
  const images = [...analysisContent.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)];
  const imagesWithAlt = images.filter((match) => match[1]?.trim()).length;
  const longSentences = sentences.filter((sentence) => wordsOf(sentence).length > 25).length;
  const transitionSentences = sentences.filter((sentence) =>
    transitionWords.some((word) => sentence.toLowerCase().includes(word)),
  ).length;

  const assessments: Assessment[] = [];

  assessments.push(
    assessment(
      "keyword-title",
      "Focus keyphrase in SEO title",
      keyword
        ? includesPhrase(draft.seoTitle || draft.title, keyword)
          ? "Your keyphrase appears in the search title."
          : "Use the exact keyphrase naturally in the search title."
        : "Add a focus keyphrase to begin the analysis.",
      keyword ? (includesPhrase(draft.seoTitle || draft.title, keyword) ? "good" : "problem") : "problem",
      "seo",
      1.4,
    ),
    assessment(
      "title-length",
      "Search title length",
      `${(draft.seoTitle || draft.title).length} of roughly 30–60 recommended characters.`,
      (draft.seoTitle || draft.title).length >= 30 && (draft.seoTitle || draft.title).length <= 60
        ? "good"
        : (draft.seoTitle || draft.title).length >= 20 && (draft.seoTitle || draft.title).length <= 70
          ? "improvement"
          : "problem",
      "seo",
    ),
    assessment(
      "keyword-description",
      "Keyphrase in meta description",
      includesPhrase(draft.description, keyword)
        ? "The description reinforces the page topic."
        : "Add the keyphrase to the meta description without forcing it.",
      keyword && includesPhrase(draft.description, keyword) ? "good" : "improvement",
      "seo",
      1.2,
    ),
    assessment(
      "description-length",
      "Meta description length",
      `${draft.description.length} of roughly 120–160 recommended characters.`,
      draft.description.length >= 120 && draft.description.length <= 160
        ? "good"
        : draft.description.length >= 80 && draft.description.length <= 175
          ? "improvement"
          : "problem",
      "seo",
    ),
    assessment(
      "keyword-url",
      "Keyphrase in URL",
      includesPhrase(draft.slug.replace(/-/g, " "), keyword)
        ? "The URL clearly describes the topic."
        : "Shorten the URL and include the keyphrase.",
      keyword && includesPhrase(draft.slug.replace(/-/g, " "), keyword) ? "good" : "improvement",
      "seo",
    ),
    assessment(
      "keyword-introduction",
      "Keyphrase in the introduction",
      includesPhrase(firstTenth, keyword)
        ? "Readers and crawlers see the topic early."
        : "Mention the keyphrase in the opening paragraph.",
      keyword && includesPhrase(firstTenth, keyword) ? "good" : "problem",
      "seo",
      1.2,
    ),
    assessment(
      "keyword-density",
      "Keyphrase distribution",
      keywordDensity
        ? `${keywordOccurrences} use${keywordOccurrences === 1 ? "" : "s"}, a ${keywordDensity.toFixed(1)}% density.`
        : "The keyphrase does not appear in the body copy.",
      keywordDensity >= 0.5 && keywordDensity <= 2.5
        ? "good"
        : keywordDensity > 0 && keywordDensity < 3.5
          ? "improvement"
          : "problem",
      "seo",
      1.2,
    ),
    assessment(
      "keyword-heading",
      "Keyphrase in a subheading",
      hasKeywordHeading ? "A subheading supports the target topic." : "Use the keyphrase in at least one useful subheading.",
      keyword && hasKeywordHeading ? "good" : "improvement",
      "seo",
    ),
    assessment(
      "links",
      "Useful internal and external links",
      `${internalLinks} internal and ${externalLinks} external contextual links found.`,
      internalLinks > 0 && externalLinks > 0 ? "good" : internalLinks + externalLinks > 0 ? "improvement" : "problem",
      "seo",
      0.8,
    ),
    assessment(
      "image-alt",
      "Image alternative text",
      images.length ? `${imagesWithAlt} of ${images.length} images have descriptive alt text.` : "No content images found; add one if it helps the reader.",
      images.length === 0 ? "improvement" : imagesWithAlt === images.length ? "good" : "problem",
      "seo",
      0.7,
    ),
  );

  assessments.push(
    assessment(
      "word-count",
      "Content depth",
      `${words.length.toLocaleString()} words · about ${Math.max(1, Math.ceil(words.length / 220))} min read.`,
      words.length >= 600 ? "good" : words.length >= 300 ? "improvement" : "problem",
      "readability",
      1.2,
    ),
    assessment(
      "sentence-length",
      "Sentence length",
      `Average ${averageSentenceLength.toFixed(1)} words; ${longSentences} sentence${longSentences === 1 ? "" : "s"} run over 25 words.`,
      averageSentenceLength > 0 && averageSentenceLength <= 20 && longSentences / Math.max(sentences.length, 1) <= 0.25
        ? "good"
        : averageSentenceLength <= 25
          ? "improvement"
          : "problem",
      "readability",
      1.2,
    ),
    assessment(
      "paragraphs",
      "Paragraph rhythm",
      paragraphs >= 3 ? `${paragraphs} scannable paragraphs found.` : "Break the copy into shorter, focused paragraphs.",
      paragraphs >= 3 ? "good" : paragraphs === 2 ? "improvement" : "problem",
      "readability",
    ),
    assessment(
      "subheadings",
      "Subheading distribution",
      headings.length ? `${headings.length} descriptive subheading${headings.length === 1 ? "" : "s"} found.` : "Add subheadings to help readers scan the page.",
      headings.length >= Math.max(1, Math.floor(words.length / 350)) ? "good" : headings.length ? "improvement" : "problem",
      "readability",
    ),
    assessment(
      "transitions",
      "Transition words",
      sentences.length ? `${Math.round((transitionSentences / sentences.length) * 100)}% of sentences use a transition.` : "Add content to analyze transitions.",
      transitionSentences / Math.max(sentences.length, 1) >= 0.25
        ? "good"
        : transitionSentences > 0
          ? "improvement"
          : "problem",
      "readability",
      0.8,
    ),
    assessment(
      "reading-ease",
      "Reading ease",
      `Estimated Flesch-style score: ${Math.round(readability)} / 100.`,
      readability >= 60 ? "good" : readability >= 40 ? "improvement" : "problem",
      "readability",
      1.2,
    ),
  );

  const seoScore = scoreGroup(assessments, "seo");
  const readabilityScore = scoreGroup(assessments, "readability");

  return {
    score: Math.round(seoScore * 0.68 + readabilityScore * 0.32),
    seoScore,
    readabilityScore,
    assessments,
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs,
      readingMinutes: Math.max(1, Math.ceil(words.length / 220)),
      keywordDensity: Number(keywordDensity.toFixed(2)),
      averageSentenceLength: Number(averageSentenceLength.toFixed(1)),
      readability: Math.round(readability),
      internalLinks,
      externalLinks,
    },
  };
}
