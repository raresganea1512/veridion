const natural = require("natural");
const { Matrix } = require("ml-matrix");

class InsuranceCompanyClassifier {
  constructor() {
    this.tfidf = new natural.TfIdf();
    this.tokenizer = new natural.WordTokenizer();
    this.taxonomy = [];
    this.taxonomyVectors = [];
    this.insuranceKeywords = [
      "insurance",
      "insurer",
      "policy",
      "coverage",
      "risk",
      "claim",
      "premium",
      "underwriting",
      "liability",
      "protection",
      "indemnity",
      "compensation",
      "benefits",
      "casualty",
      "loss",
      "accident",
      "damage",
      "health",
      "life",
      "property",
      "auto",
      "vehicle",
      "medical",
      "dental",
      "vision",
      "disability",
      "worker",
      "business",
      "commercial",
      "professional",
      "cyber",
      "marine",
      "aviation",
      "flood",
      "earthquake",
      "catastrophe",
      "umbrella",
      "assurance",
      "reinsurance",
      "actuary",
      "broker",
      "agent",
      "pension",
      "annuity",
      "underwriter",
      "claims adjuster",
      "risk management",
      "actuarial",
      "policyholder",
      "insured",
    ];

    // Map common terms to insurance categories
    this.categoryMappings = {
      life: ["Life Insurance"],
      health: ["Health Insurance"],
      property: ["Property Insurance"],
      casualty: ["Casualty Insurance"],
      auto: ["Auto Insurance"],
      vehicle: ["Auto Insurance"],
      travel: ["Travel Insurance"],
      pet: ["Pet Insurance"],
      cyber: ["Cyber Insurance"],
      professional: ["Professional Liability Insurance"],
      worker: ["Workers Compensation Insurance"],
      "business interruption": ["Business Interruption Insurance"],
      marine: ["Marine Insurance"],
      aviation: ["Aviation Insurance"],
      crop: ["Crop Insurance"],
      flood: ["Flood Insurance"],
      earthquake: ["Earthquake Insurance"],
      disability: ["Disability Insurance"],
      "long-term care": ["Long-term Care Insurance"],
      dental: ["Dental Insurance"],
      vision: ["Vision Insurance"],
      "general liability": ["General Liability Insurance"],
      "product liability": ["Product Liability Insurance"],
      "directors and officers": ["Directors and Officers Insurance"],
      "errors and omissions": ["Errors and Omissions Insurance"],
      "employment practices": ["Employment Practices Liability Insurance"],
      fidelity: ["Fidelity Insurance"],
      crime: ["Crime Insurance"],
      surety: ["Surety Insurance"],
      bond: ["Surety Insurance"],
      umbrella: ["Umbrella Insurance"],
      excess: ["Excess Liability Insurance"],
      reinsurance: ["Reinsurance"],
      pension: ["Pension Insurance"],
      annuity: ["Annuity Insurance"],
    };
  }

  async initialize(taxonomyArray) {
    try {
      // Accept taxonomy as an array
      this.taxonomy = taxonomyArray;

      // Initialize TF-IDF with taxonomy and keywords
      this.taxonomy.forEach((category) => {
        this.tfidf.addDocument(category.toLowerCase());
      });

      // Add insurance keywords to improve context
      this.insuranceKeywords.forEach((keyword) => {
        this.tfidf.addDocument(keyword.toLowerCase());
      });

      // Create vectors for taxonomy categories
      this.taxonomyVectors = this.taxonomy.map((category) => {
        const tokens = this.tokenizer.tokenize(category.toLowerCase());
        return this.getTfIdfVector(tokens);
      });
    } catch (error) {
      console.error("Error initializing classifier:", error);
      throw error;
    }
  }

  getTfIdfVector(tokens) {
    const vector = new Array(this.tfidf.documents.length).fill(0);
    tokens.forEach((token) => {
      this.tfidf.documents.forEach((doc, i) => {
        const score = this.tfidf.tfidf(token, i);
        vector[i] += score;
      });
    });
    return vector;
  }

  calculateSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return magnitude1 === 0 || magnitude2 === 0
      ? 0
      : dotProduct / (magnitude1 * magnitude2);
  }

  parseTags(tagsStr) {
    try {
      // Handle array-like string format: "['tag1', 'tag2']"
      if (tagsStr.startsWith("[") && tagsStr.endsWith("]")) {
        return JSON.parse(tagsStr.replace(/'/g, '"'));
      }
      // Handle comma-separated format: "tag1,tag2"
      return tagsStr.split(",").map((t) => t.trim());
    } catch (e) {
      return [];
    }
  }

  findDirectMatches(text) {
    const lowercaseText = text.toLowerCase();
    const matches = new Set();

    // Check for direct category mappings
    Object.entries(this.categoryMappings).forEach(([key, categories]) => {
      if (lowercaseText.includes(key.toLowerCase())) {
        categories.forEach((category) => matches.add(category));
      }
    });

    return Array.from(matches);
  }

  hasInsuranceContext(text) {
    const lowercaseText = text.toLowerCase();
    return this.insuranceKeywords.some((keyword) =>
      lowercaseText.includes(keyword.toLowerCase())
    );
  }

  async classifyCompany(company) {
    const description = (company.description || "").toLowerCase();
    const tags = Array.isArray(company.business_tags)
      ? company.business_tags.map((tag) => tag.toLowerCase())
      : this.parseTags(company.business_tags || "").map((tag) =>
          tag.toLowerCase()
        );
    const sector = (company.sector || "").toLowerCase();
    const category = (company.category || "").toLowerCase();
    const niche = (company.niche || "").toLowerCase();

    // First check for direct matches in all fields
    const directMatches = new Set([
      ...this.findDirectMatches(description),
      ...tags.flatMap((tag) => this.findDirectMatches(tag)),
      ...this.findDirectMatches(sector),
      ...this.findDirectMatches(category),
      ...this.findDirectMatches(niche),
    ]);

    // If we found direct matches, return them
    if (directMatches.size > 0) {
      return Array.from(directMatches);
    }

    // Check if the company has any insurance context
    const hasContext =
      this.hasInsuranceContext(description) ||
      tags.some((tag) => this.hasInsuranceContext(tag)) ||
      this.hasInsuranceContext(sector) ||
      this.hasInsuranceContext(category) ||
      this.hasInsuranceContext(niche);

    // If no insurance context is found, return empty array
    if (!hasContext) {
      return [];
    }

    // Combine all text fields with weights
    const allText = [
      description,
      ...tags.map((tag) => `${tag} ${tag} ${tag}`), // Give more weight to tags
      `${sector} ${sector} ${sector}`, // Give more weight to sector
      `${category} ${category} ${category}`, // Give more weight to category
      `${niche} ${niche} ${niche}`, // Give more weight to niche
    ].join(" ");

    const tokens = this.tokenizer.tokenize(allText);

    // Get TF-IDF vector for the company
    const companyVector = this.getTfIdfVector(tokens);

    // Calculate similarities with all taxonomy categories
    const similarities = this.taxonomy.map((category, index) => ({
      category,
      similarity: this.calculateSimilarity(
        companyVector,
        this.taxonomyVectors[index]
      ),
    }));

    // Sort by similarity and get top matches
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Return top matches with similarity above threshold
    const threshold = 0.3; // Increased threshold for better precision
    const maxLabels = 3; // Limit to top 3 most relevant insurance types

    // Additional validation for similarity matches
    const validMatches = similarities
      .filter((match) => match.similarity > threshold)
      .filter((match) => {
        // Additional validation to ensure the match is relevant
        const categoryLower = match.category.toLowerCase();
        return (
          // Check if any insurance keyword is present in the category
          this.insuranceKeywords.some((keyword) =>
            categoryLower.includes(keyword)
          ) ||
          // Check if the category contains common insurance terms
          categoryLower.includes("insurance") ||
          categoryLower.includes("coverage") ||
          categoryLower.includes("liability") ||
          categoryLower.includes("protection")
        );
      })
      .slice(0, maxLabels)
      .map((match) => match.category);

    return validMatches;
  }

  async classifyCompanies(companies) {
    const results = [];
    let processed = 0;
    const total = companies.length;

    for (const company of companies) {
      const labels = await this.classifyCompany(company);
      results.push({
        ...company,
        insurance_labels: labels,
      });

      processed++;
      if (processed % 1000 === 0) {
        console.log(
          `Processed ${processed}/${total} companies (${(
            (processed / total) *
            100
          ).toFixed(1)}%)`
        );
      }
    }
    return results;
  }
}

module.exports = InsuranceCompanyClassifier;
