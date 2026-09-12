/**
 * promptBuilder.js
 * Turns a scraped-site analysis into 6 slides of carousel copy following
 * Hook -> Problem -> Agitation -> Solution -> Feature -> CTA. Pure text
 * logic — no AI model call, so it's free and instant. If you want an LLM
 * to write punchier copy later, this is the one function to swap out.
 */

function buildSlides(analysis, state) {
  const { name, tagline, description, valueProps, features } = analysis;
  const learned = state?.bestPerforming;

  const hook = learned
    ? `Still doing ${genericPain(name)} the hard way?`
    : `Everyone's talking about ${name}. Here's why.`;

  const slides = [
    {
      slideNumber: 1,
      role: 'Hook',
      headline: hook,
      body: tagline,
    },
    {
      slideNumber: 2,
      role: 'Problem',
      headline: `The problem`,
      body: genericPain(name),
    },
    {
      slideNumber: 3,
      role: 'Agitation',
      headline: `It adds up`,
      body: `Every day you wait, you're leaving results on the table.`,
    },
    {
      slideNumber: 4,
      role: 'Solution',
      headline: `Meet ${name}`,
      body: description || valueProps[0] || tagline,
    },
    {
      slideNumber: 5,
      role: 'Feature',
      headline: `What makes it work`,
      body: features[0] || valueProps[1] || 'A comprehensive, flexible toolset.',
    },
    {
      slideNumber: 6,
      role: 'CTA',
      headline: `Try it today`,
      body: `Link in bio → ${analysis.url}`,
    },
  ];

  return slides.map((s) => ({ ...s, imagePrompt: `${s.headline} — ${s.body}` }));
}

function genericPain(name) {
  return `Manual work, scattered tools, and no clear system holding ${name.toLowerCase()}-style growth back.`;
}

module.exports = { buildSlides };
