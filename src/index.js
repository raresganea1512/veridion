const InsuranceCompanyClassifier = require("./classifier");
const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvParser = require("csv-parser");

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function main() {
  try {
    // Load taxonomy from CSV
    const taxonomyRows = await readCSV(
      path.join(__dirname, "../data/insurance_taxonomy.csv")
    );
    const taxonomy = taxonomyRows.map(
      (row) => row.label || row[Object.keys(row)[0]]
    );

    // Initialize classifier
    const classifier = new InsuranceCompanyClassifier();
    await classifier.initialize(taxonomy);

    // Load company data from CSV
    console.log("Loading company data...");
    const companies = await readCSV(
      path.join(__dirname, "../data/company_list.csv")
    );

    // Classify companies
    console.log(`Classifying ${companies.length} companies...`);
    const results = await classifier.classifyCompanies(companies);

    // Write results to CSV
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, "../output/classified_companies.csv"),
      header: [
        { id: "description", title: "Description" },
        { id: "business_tags", title: "Business Tags" },
        { id: "sector", title: "Sector" },
        { id: "category", title: "Category" },
        { id: "niche", title: "Niche" },
        { id: "insurance_labels", title: "Insurance Labels" },
      ],
    });

    // Format results for CSV
    const csvResults = results.map((row) => ({
      ...row,
      insurance_labels: Array.isArray(row.insurance_labels)
        ? row.insurance_labels.join(", ")
        : row.insurance_labels,
    }));

    await csvWriter.writeRecords(csvResults);
    console.log(
      "Classification complete! Results written to output/classified_companies.csv"
    );

    // Print statistics
    const labelCounts = {};
    let companiesWithLabels = 0;
    results.forEach((company) => {
      if (company.insurance_labels && company.insurance_labels.length > 0) {
        companiesWithLabels++;
        company.insurance_labels.forEach((label) => {
          labelCounts[label] = (labelCounts[label] || 0) + 1;
        });
      }
    });

    console.log("\nClassification Statistics:");
    console.log(`Total companies processed: ${results.length}`);
    console.log(`Companies with insurance labels: ${companiesWithLabels}`);
    console.log(
      `Coverage rate: ${((companiesWithLabels / results.length) * 100).toFixed(
        2
      )}%`
    );

    console.log("\nTop Insurance Categories:");
    Object.entries(labelCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([label, count]) => {
        const percentage = ((count / results.length) * 100).toFixed(2);
        console.log(`${label}: ${count} companies (${percentage}%)`);
      });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
