# 🎯 Insurance Company Classifier: Your AI-Powered Business Categorizer

Ever wondered how to automatically categorize companies into insurance sectors? Look no further! This project brings the power of natural language processing to automatically analyze and classify companies into their relevant insurance categories. Think of it as a smart business analyst that never sleeps!

## 🏗️ What's Inside?

```
.
├── data/                  # Your data playground
│   ├── company_list.csv   # The company database
│   └── insurance_taxonomy.csv # The insurance category dictionary
├── output/               # Where the magic happens
│   └── classified_companies.csv # Your classified results
├── src/                  # The brains of the operation
│   ├── classifier.js     # The classification engine
│   ├── index.js         # The command center
│   └── utils.js         # The helper functions
└── README.md            # This file!
```

## ✨ Key Features

- 🧠 Smart classification that understands company descriptions like a human would
- 🏷️ Multi-label classification - because companies can wear many hats
- 🔍 Deep analysis of company descriptions, tags, sectors, and niches
- 📊 TF-IDF powered similarity matching for accurate categorization
- 🎯 Direct keyword matching for precise results
- ⚙️ Fully customizable thresholds and matching criteria

## 📥 What Goes In?

The system expects two CSV files:

1. `company_list.csv` - Your company database with:

   - Description: What the company does
   - Business Tags: Company's specialties
   - Sector: Industry sector
   - Category: Business category
   - Niche: Specific market focus

2. `insurance_taxonomy.csv` - Your insurance category dictionary with:
   - Category: Insurance category name
   - Description: What this category means

## 📤 What Comes Out?

The system generates `classified_companies.csv` with all your original data plus:

- Insurance Labels: A smart list of relevant insurance categories for each company

## 🔄 How It Works

1. **Data Loading** 📚

   - Reads your company data and insurance categories
   - Prepares everything for analysis

2. **Preprocessing** 🧹

   - Cleans and standardizes text
   - Prepares data for analysis
   - Removes noise and irrelevant information

3. **Classification** 🎯

   - Direct keyword matching
   - Smart similarity analysis
   - Context-aware categorization

4. **Validation** ✅
   - Quality checks
   - Relevance verification
   - Multi-label assignment

## 🚀 Getting Started

1. Drop your files in the `data` directory:

   - `company_list.csv`
   - `insurance_taxonomy.csv`

2. Run the magic:

   ```bash
   node src/index.js
   ```

3. Find your results in `output/classified_companies.csv`

## 🎯 Classification Magic

The system uses three powerful methods to categorize companies:

1. **Direct Matching** 🎯

   - Spots insurance keywords in descriptions
   - Analyzes business tags
   - Checks sector and category context

2. **Similarity Matching** 🔍

   - Uses TF-IDF vectors for smart comparison
   - Calculates semantic similarity
   - Matches like a human would

3. **Context Validation** ✅
   - Ensures relevance
   - Verifies insurance context
   - Picks the most relevant categories

## ⚡ Performance

Built for speed and accuracy:

- Handles large datasets with ease
- Provides precise category assignments
- Supports multiple labels per company
- Maintains high accuracy

## 🛠️ Tech Stack

- Node.js
- Natural language processing libraries
- CSV processing tools

## 📝 Example Output

```csv
Description,Business Tags,Sector,Category,Niche,Insurance Labels
"Company description...","['tag1', 'tag2']",Services,Category,Niche,"Auto Insurance, Health Insurance"
```

## 💡 Pro Tips

- The system is optimized for insurance categorization
- Companies can have multiple insurance labels
- Results are sorted by relevance
- Both exact matches and semantic similarity are used

## 🤝 Contributing

Feel free to contribute to make this project even better! Whether it's bug fixes, new features, or documentation improvements, every contribution counts.

## 📄 License

This project is open source and available under the MIT License.
