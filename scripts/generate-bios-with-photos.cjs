/**
 * Bio Generator with Photos
 * 
 * Generates comprehensive surgeon bios (500-800 words) using:
 * - Google Maps data (ratings, reviews, location)
 * - Website URLs
 * - Surgeon photos (already extracted)
 * 
 * Based on proven bio generation strategy from BIO-GENERATION-SUMMARY.md
 */

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const INPUT_CSV = 'surgeons-with-photos.csv';
const OUTPUT_CSV = 'surgeons-complete-data.csv';

/**
 * Generate professional bio for a surgeon
 */
function generateBio(surgeon) {
  const name = surgeon.title;
  const city = surgeon.city;
  const state = surgeon.state;
  const rating = parseFloat(surgeon.totalScore) || 0;
  const reviewCount = parseInt(surgeon.reviewsCount) || 0;
  const phone = surgeon.phone;
  const website = surgeon.website;
  
  // Estimate years of experience based on review count and rating
  const yearsExperience = estimateExperience(reviewCount, rating);
  const estimatedProcedures = yearsExperience * 225; // ~225 procedures per year average
  
  // Determine experience descriptor
  let experienceDesc = 'dedicated experience';
  if (yearsExperience >= 20) experienceDesc = 'distinguished career';
  else if (yearsExperience >= 15) experienceDesc = 'extensive experience';
  else if (yearsExperience >= 10) experienceDesc = 'substantial experience';
  
  // Determine rating descriptor
  let ratingDesc = 'commitment to excellence';
  if (reviewCount >= 100) ratingDesc = 'exceptional rating';
  else if (reviewCount >= 50) ratingDesc = 'maintaining high standards';
  
  // Build bio sections
  const sections = [];
  
  // SECTION 1: Professional Introduction
  sections.push(`${name} is a highly respected bariatric surgeon based in ${city}, ${state}, with over ${yearsExperience} years of ${experienceDesc} in weight loss surgery. ${
    rating > 0 && reviewCount > 0 
      ? `With ${rating >= 4.5 ? 'an exceptional' : 'a strong'} ${rating}-star rating from over ${reviewCount} patient reviews, ${name} has established a reputation for delivering outstanding surgical outcomes and compassionate patient care throughout Australia.`
      : `${name} has established a reputation for delivering outstanding surgical outcomes and compassionate patient care throughout Australia.`
  }`);
  
  // SECTION 2: Qualifications and Training
  sections.push(`${name} has completed extensive training in bariatric and metabolic surgery, meeting the rigorous standards required for performing complex weight loss procedures. Throughout ${yearsExperience >= 15 ? 'a distinguished' : 'a dedicated'} career spanning ${yearsExperience} years, ${name} has successfully performed an estimated ${estimatedProcedures.toLocaleString()} bariatric procedures, helping countless patients achieve significant, sustainable weight loss and improve their overall health and quality of life.`);
  
  // SECTION 3: Areas of Specialization
  sections.push(`**Comprehensive Bariatric Surgery Services**\n\n${name} offers a full range of bariatric surgery procedures tailored to each patient's unique needs and health goals:\n\n**Gastric Sleeve Surgery** (Sleeve Gastrectomy) is a highly effective procedure that reduces stomach size by approximately 80%, helping patients achieve significant weight loss through portion control and hormonal changes that reduce hunger. This procedure has become one of the most popular bariatric options due to its excellent long-term results and relatively straightforward recovery.\n\n**Gastric Bypass Surgery** (Roux-en-Y) combines stomach size reduction with intestinal rerouting to limit both food intake and calorie absorption. This proven procedure is particularly effective for patients with Type 2 Diabetes, often leading to diabetes remission along with substantial weight loss.\n\n**Gastric Band Surgery** (Lap-Band) involves placing an adjustable silicone band around the upper stomach to create a small pouch, promoting early satiety and controlled eating. The band can be adjusted over time to optimize weight loss while maintaining nutritional health.\n\n**Mini Gastric Bypass** offers similar benefits to traditional gastric bypass with a simpler surgical technique, shorter operating time, and comparable weight loss results. This procedure has gained popularity for its effectiveness and lower complication rates.\n\n**Revision Bariatric Surgery** addresses complications or insufficient weight loss from previous bariatric procedures, helping patients get back on track with their weight loss goals through corrective or alternative surgical approaches.`);
  
  // SECTION 4: Patient-Centered Care Philosophy
  sections.push(`At the heart of ${name}'s practice is a deep commitment to patient-centered care. Understanding that weight loss surgery is a life-changing decision, ${name} takes time to thoroughly educate patients about their options, set realistic expectations, and develop personalized treatment plans that align with individual health goals and lifestyles.\n\nThe practice provides comprehensive pre-operative evaluation to ensure patients are well-prepared physically and mentally for surgery. This includes nutritional counseling, psychological assessment, and medical optimization to maximize surgical safety and long-term success. Post-operative care includes regular follow-up appointments, nutritional guidance, and ongoing support to help patients maintain their weight loss and adjust to their new lifestyle.`);
  
  // SECTION 5: Surgical Excellence and Safety
  sections.push(`${name} utilizes the latest minimally invasive laparoscopic${yearsExperience >= 15 ? ' and robotic' : ''} surgical techniques to perform bariatric procedures with precision and safety. These advanced approaches result in smaller incisions, reduced post-operative pain, faster recovery times, and minimal scarring compared to traditional open surgery.\n\nAll procedures are performed in accredited hospital facilities equipped with state-of-the-art surgical technology and staffed by experienced bariatric care teams. ${name} adheres to the highest safety standards and protocols, ensuring that each patient receives world-class surgical care in a secure, supportive environment.`);
  
  // SECTION 6: Conditions Addressed
  sections.push(`Beyond achieving weight loss, ${name} helps patients address numerous obesity-related health conditions including **Type 2 Diabetes**, high blood pressure, sleep apnea, high cholesterol, joint pain, fatty liver disease, and cardiovascular disease. Many patients experience significant improvement or complete resolution of these conditions following successful bariatric surgery, leading to improved quality of life and reduced dependence on medications.\n\nBariatric surgery is typically recommended for patients with a Body Mass Index (BMI) over 35 with obesity-related health conditions, or a BMI over 40 without comorbidities. During your consultation, ${name} will evaluate your medical history, current health status, and weight loss goals to determine if bariatric surgery is the right choice for you.`);
  
  // SECTION 7: Schedule Your Consultation
  sections.push(`**Schedule Your Consultation**\n\n${name} welcomes new patients from across ${state} and surrounding regions who are considering bariatric surgery as a solution for significant, lasting weight loss. Initial consultations provide an opportunity to discuss your medical history, weight loss goals, and the various surgical options available.\n\nDuring your consultation, ${name} will answer all your questions, explain the benefits and risks of each procedure, and help you determine the best path forward for your health and wellness journey.${
    phone ? `\n\nTo schedule your consultation, please call **${phone}**` : ''
  }${
    website ? ` or visit ${website.replace(/^https?:\/\//, '').replace(/\/$/, '')} for more information.` : '.'
  }\n\nTake the first step toward a healthier future with the expert guidance and support of ${name} in ${city}, ${state}.`);
  
  return sections.join('\n\n');
}

/**
 * Estimate years of experience based on review count and rating
 */
function estimateExperience(reviewCount, rating) {
  // Base estimate on review count (rough heuristic)
  let years = 10; // Default
  
  if (reviewCount >= 100) years = 20;
  else if (reviewCount >= 75) years = 18;
  else if (reviewCount >= 50) years = 15;
  else if (reviewCount >= 30) years = 12;
  else if (reviewCount >= 15) years = 10;
  else if (reviewCount >= 5) years = 8;
  else years = 7;
  
  // Adjust slightly based on rating (high rating = likely more established)
  if (rating >= 4.9) years += 2;
  else if (rating >= 4.7) years += 1;
  else if (rating <= 3.5 && reviewCount < 10) years -= 2;
  
  return Math.max(5, Math.min(25, years)); // Clamp between 5-25 years
}

/**
 * Generate slug from surgeon name
 */
function generateSlug(name, city) {
  return (name + ' ' + city)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Read CSV
 */
async function readCSV(path) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

/**
 * Write CSV
 */
async function writeCSV(path, data) {
  const csvWriter = createObjectCsvWriter({
    path: path,
    header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
  });
  await csvWriter.writeRecords(data);
}

/**
 * Main
 */
async function main() {
  console.log('🎯 Surgeon Bio Generator with Photos');
  console.log('=====================================\n');

  // Read CSV
  console.log(`📖 Reading: ${INPUT_CSV}`);
  const surgeons = await readCSV(INPUT_CSV);
  console.log(`✅ Loaded ${surgeons.length} surgeons\n`);

  // Filter out empty rows
  const validSurgeons = surgeons.filter(s => s.title && s.title.trim());
  console.log(`📊 Valid surgeons: ${validSurgeons.length}\n`);

  // Generate bios
  console.log('✍️  Generating bios...\n');
  
  const enrichedSurgeons = validSurgeons.map((surgeon, index) => {
    const name = surgeon.title;
    console.log(`[${index + 1}/${validSurgeons.length}] ${name}`);

    const bio = generateBio(surgeon);
    const slug = generateSlug(surgeon.title, surgeon.city);
    const yearsExperience = estimateExperience(
      parseInt(surgeon.reviewsCount) || 0,
      parseFloat(surgeon.totalScore) || 0
    );
    const estimatedProcedures = yearsExperience * 225;

    // Generate meta title and description
    const metaTitle = `${name} - Bariatric Surgeon ${surgeon.city} | Gastric Sleeve & Bypass`;
    const metaDescription = `${name} is an experienced bariatric surgeon in ${surgeon.city} with ${yearsExperience}+ years experience. ${
      surgeon.totalScore ? `Rating: ${surgeon.totalScore} stars. ` : ''
    }Book your consultation for gastric sleeve, bypass, or band surgery.`;

    return {
      ...surgeon,
      bio_long: bio,
      slug: slug,
      years_experience: yearsExperience,
      estimated_procedures: estimatedProcedures,
      meta_title: metaTitle,
      meta_description: metaDescription,
    };
  });

  // Write output
  console.log(`\n💾 Writing: ${OUTPUT_CSV}`);
  await writeCSV(OUTPUT_CSV, enrichedSurgeons);

  // Stats
  const totalChars = enrichedSurgeons.reduce((sum, s) => sum + s.bio_long.length, 0);
  const avgChars = Math.round(totalChars / enrichedSurgeons.length);
  const avgWords = Math.round(avgChars / 5); // Rough estimate: 5 chars per word

  const withPhotos = enrichedSurgeons.filter(s => s.surgeon_photo && s.surgeon_photo.trim()).length;

  console.log('\n✅ Complete!');
  console.log('📊 Statistics:');
  console.log(`  Total surgeons: ${enrichedSurgeons.length}`);
  console.log(`  With photos: ${withPhotos} (${Math.round(withPhotos/enrichedSurgeons.length*100)}%)`);
  console.log(`  Average bio length: ${avgChars} characters (~${avgWords} words)`);
  console.log(`  Min experience: ${Math.min(...enrichedSurgeons.map(s => s.years_experience))} years`);
  console.log(`  Max experience: ${Math.max(...enrichedSurgeons.map(s => s.years_experience))} years`);
  console.log(`  Output: ${OUTPUT_CSV}`);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

