#!/bin/bash

# Add imports and internal linking to stage recipe pages

for stage in 1 2 3 4; do
  file="src/pages/blog/stage-$stage-$([ $stage -eq 1 ] && echo 'clear' || [ $stage -eq 2 ] && echo 'full' || [ $stage -eq 3 ] && echo 'pureed' || echo 'soft')-$([ $stage -le 2 ] && echo 'liquid' || echo 'food')-recipes.astro"
  
  echo "Processing $file..."
  
  # Add imports after BlogLayout import
  sed -i '' '/^import BlogLayout/a\
import SurgeonCTA from '\''../../components/SurgeonCTA.astro'\'';\
import RelatedContent from '\''../../components/RelatedContent.astro'\'';
' "$file"
  
  # Add components before </BlogLayout>
  sed -i '' '/<\/BlogLayout>/i\
\
<!-- Related Content -->\
<RelatedContent \
  title="Related Recipe Collections"\
  links={[\
    {\
      title: "All 50+ Bariatric Recipes",\
      href: "/blog/bariatric-surgery-recipes-all-stages",\
      description: "Complete recipe collection for every stage"\
    },\
    {\
      title: "Diet Stages Guide",\
      href: "/blog/gastric-sleeve-diet-stages",\
      description: "Understand all 4 phases of post-surgery diet"\
    },\
    {\
      title: "Recovery Timeline",\
      href: "/blog/gastric-sleeve-recovery-week-by-week",\
      description: "Week-by-week recovery guide with milestones"\
    },\
    {\
      title: "Gastric Sleeve Procedure",\
      href: "/procedures/gastric-sleeve",\
      description: "Learn about the surgery and what to expect"\
    }\
  ]}\
/>\
\
<!-- Surgeon CTA -->\
<SurgeonCTA \
  headline="Find Surgeons Who Support Your Nutrition Journey"\
  description="Choose a bariatric surgeon who provides comprehensive nutrition support and dietitian access throughout your recovery."\
/>\
' "$file"
  
  echo "✓ Updated $file"
done

echo ""
echo "All stage recipe pages updated!"

