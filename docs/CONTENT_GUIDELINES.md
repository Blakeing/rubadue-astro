# Content Guidelines

This document provides detailed guidelines for creating and maintaining high-quality content on the Rubadue Wire website.

## Knowledge Base Articles

### Writing Guidelines

#### Tone and Style
- **Professional but Accessible**: Write for technical professionals while remaining understandable
- **Authoritative**: Position Rubadue as the expert in wire and cable solutions
- **Educational**: Focus on helping readers understand concepts and make informed decisions
- **Concise**: Be thorough but avoid unnecessary complexity

#### Structure Best Practices

1. **Start with Context**
   - Begin with why the topic matters
   - Explain the problem or question being addressed
   - Set expectations for what readers will learn

2. **Use Clear Headings**
   ```markdown
   ## Main Topics (H2)
   ### Subtopics (H3)
   #### Details (H4 - use sparingly)
   ```

3. **Include Practical Information**
   - Specifications and technical data
   - Real-world applications
   - Comparison tables
   - Selection criteria

4. **End with Action Items**
   - Contact information for questions
   - Links to related products
   - Suggestions for next steps

#### Content Types

**Technical Guides**
- Step-by-step processes
- Selection criteria
- Best practices
- Troubleshooting

**Educational Articles**
- Concept explanations
- Industry insights
- Standards and regulations
- Material properties

**Application Notes**
- Use case examples
- Problem-solving approaches
- Performance comparisons
- Installation guidance

### SEO Best Practices

#### Title Optimization
- Keep titles under 60 characters
- Include primary keywords naturally
- Make titles descriptive and compelling
- Examples:
  - Good: "Wire Insulation Temperature Ratings: A Complete Guide"
  - Avoid: "Insulation Guide" or "Everything You Need to Know About Wire Temperature Ratings and How to Select the Right Material"

#### Description Guidelines
- 120-160 characters
- Include primary keyword
- Write compelling copy that encourages clicks
- Summarize the main value proposition

#### Tag Strategy
- Use 3-7 relevant tags per article
- Include:
  - Content type (e.g., "Technical Guide", "Application Note")
  - Primary topic (e.g., "Insulation", "Litz Wire")
  - Industry/application (e.g., "Automotive", "Medical")
  - Technical specs when relevant (e.g., "High Temperature")

### Markdown Guidelines

#### Tables
Use tables for technical specifications and comparisons:

```markdown
| Material | Temperature Rating | Voltage Rating | Applications |
|----------|-------------------|----------------|-------------|
| FEP      | 155°C            | 600V          | Telecom     |
| PFA      | 180°C            | 1000V         | Medical     |
```

#### Lists
- Use bullet points for features and benefits
- Use numbered lists for procedures and steps
- Keep list items parallel in structure

#### Links and Images
- Link to relevant products when mentioned
- Link to related knowledge base articles
- Use descriptive link text (avoid "click here")
- Example: `[PFA insulated wire products](/catalog/single-insulated/pfa/)`

**Image References**:
- **Optimized images** (recommended): `![Alt text](@/assets/images/filename.webp)`
- **Background/Hero images**: `@/assets/backgrounds/filename.webp`
- **Product images**: `@/assets/products/category/filename.webp`
- **Static images** (avoid unless necessary): `![Alt text](/images/filename.webp)` (public folder)

#### Code Blocks
Use code blocks for:
- Technical specifications
- Formula examples
- Configuration examples

```
Specification: AWG 24 (7/32)
Insulation: 0.002" FEP
Temperature Rating: 155°C
```

## Product Content

### Product Descriptions

#### Primary Description
- 1-2 sentences maximum
- Include key differentiators
- Mention primary applications
- Example: "FEP .002"/Layer single insulated wire for telecom and electronic applications requiring 155°C temperature rating and excellent chemical resistance."

#### Extended Content
- Use the markdown body for detailed information
- Include application examples
- Explain benefits and unique features
- Reference standards and certifications

### Technical Specifications

#### Required Information
- **Construction**: Conductor type, insulation material, layer thickness
- **Ratings**: Temperature, voltage, current capacity
- **Compliance**: Standards, certifications, approvals
- **Physical Properties**: Tensile strength, breakdown voltage
- **Applications**: Primary use cases

#### Data Organization
- Group related specifications together
- Use consistent units and formatting
- Include ranges where applicable
- Specify test conditions when relevant

### Product Categories

#### Category Consistency
Ensure products are correctly categorized:
- **Single Insulated**: One layer of insulation
- **Double Insulated**: Two layers of insulation
- **Triple Insulated**: Three layers of insulation
- **Litz Wire**: Multi-strand constructions

#### Tags Structure
Use a simplified, clean tag structure:

```yaml
tags:
  type: ["Product Category"]      # Required: Primary categorization
  material: ["Insulation Material"] # Required: Material type
```

**Important Notes:**
- **First element in `type` becomes the primary category** (shown in page headers)
- For **Litz Wire products**: Put "Litz Wire" first, then insulation type
  - Example: `type: ["Litz Wire", "Triple Insulated"]`
- For **regular wire**: Use only the insulation type
  - Example: `type: ["Single Insulated"]`
- **Category field is no longer used** - it's automatically derived from `tags.type[0]`

**Available Types:**
- `"Single Insulated"`, `"Double Insulated"`, `"Triple Insulated"`
- `"Litz Wire"`, `"Bare"`

**Available Materials:**
- `"ETFE"`, `"FEP"`, `"PFA"`, `"TCA1"`, `"TCA2"`, `"TCA3"`

## Image Guidelines

### Technical Images
- High resolution (minimum 1200px wide)
- Clean, professional appearance
- Consistent lighting and background
- Include scale references when helpful

### Product Photography
- Multiple angles when applicable
- Show construction details
- Highlight unique features
- Maintain consistent style across products

### Diagrams and Charts
- Use clear, readable fonts
- Maintain brand color consistency
- Include legends and labels
- Export in appropriate formats (.webp preferred)

### File Naming and Location
- **Preferred locations** (Astro optimizes these automatically):
  - Hero/background images: `src/assets/backgrounds/`
  - Product images: `src/assets/products/category/`
  - General content images: `src/assets/images/`
- **Alternative location**: `public/images/` (served as-is, no optimization, use sparingly)
- Use descriptive, SEO-friendly names
- Include product/article identifiers  
- Use hyphens, not spaces
- Examples:
  - `src/assets/images/fep-002-layer-construction-diagram.webp`
  - `src/assets/images/temperature-rating-comparison-chart.webp`

**Referencing in Content**:
```markdown
<!-- Optimized images (recommended) -->
![FEP Construction Diagram](@/assets/images/fep-002-layer-construction-diagram.webp)

<!-- Direct images (no optimization) -->
![Temperature Chart](/images/temperature-rating-comparison-chart.webp)
```

## Quality Assurance

### Content Review Checklist

Before publishing any content:

- [ ] **Accuracy**: All technical information verified
- [ ] **Completeness**: All required fields populated
- [ ] **Consistency**: Follows established style and format
- [ ] **SEO**: Title, description, and tags optimized
- [ ] **Links**: All internal and external links functional
- [ ] **Images**: Properly sized and compressed
- [ ] **Grammar**: Professional writing quality
- [ ] **Mobile**: Content displays well on mobile devices

### Regular Maintenance

#### Monthly Reviews
- Check for outdated information
- Update product specifications if changed
- Refresh images if needed
- Review and update tags for SEO

#### Quarterly Audits
- Analyze content performance
- Identify gaps in coverage
- Plan new content based on customer needs
- Review and update guidelines

## Brand Voice Guidelines

### Key Messages
- **Expertise**: "50+ years of experience in wire and cable"
- **Quality**: "Precision manufacturing and testing"
- **Service**: "Engineering support and custom solutions"
- **Innovation**: "Advanced materials and construction techniques"

### Language Preferences
- Use active voice when possible
- Write in second person for instructional content
- Maintain professional terminology while remaining accessible
- Avoid jargon without explanation

### Contact Integration
Always include relevant contact information:
- Sales inquiries: sales@rubadue.com or +1(970) 351-6100
- Technical questions: Include engineering team contact
- Custom solutions: Mention consultation availability

---

These guidelines ensure consistent, high-quality content that serves both users and search engines effectively. For questions about specific content decisions, consult with the marketing and engineering teams. 