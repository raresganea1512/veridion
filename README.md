# Insurance Company Classifier

This project implements an intelligent classifier that analyzes company descriptions and metadata to identify and categorize companies into relevant insurance categories. The classifier uses natural language processing techniques to understand company descriptions and match them with appropriate insurance categories.

## Project Structure

```
.
├── data/
│   ├── company_list.csv       # Input file containing company descriptions and metadata
│   └── insurance_taxonomy.csv # Insurance categories and their descriptions
├── output/
│   └── classified_companies.csv # Output file with classified companies
├── src/
│   ├── classifier.js         # Main classifier implementation
│   ├── index.js             # Entry point and data processing
│   └── utils.js             # Utility functions
└── README.md
```

## Features

- Intelligent classification of companies into insurance categories
- Support for multiple insurance labels per company
- Analysis of company descriptions, business tags, sector, category, and niche
- TF-IDF based similarity matching
- Direct keyword matching for precise categorization
- Configurable similarity thresholds and matching criteria

## Input Data Format

The classifier expects two CSV files:

1. `company_list.csv` with the following columns:

   - Description: Company description
   - Business Tags: Array of business-related tags
   - Sector: Company's business sector
   - Category: Business category
   - Niche: Specific business niche

2. `insurance_taxonomy.csv` with the following columns:
   - Category: Insurance category name
   - Description: Detailed description of the insurance category

## Output

The classifier generates `classified_companies.csv` in the output directory with the following columns:

- All original columns from the input file
- Insurance Labels: Comma-separated list of relevant insurance categories

## Classification Process

1. **Data Loading**: Reads company data and insurance taxonomy
2. **Preprocessing**:
   - Tokenizes text
   - Converts to lowercase
   - Removes special characters
3. **Classification**:
   - Direct matching using insurance keywords
   - TF-IDF vector similarity matching
   - Category mapping based on business context
4. **Validation**:
   - Threshold-based filtering
   - Insurance context verification
   - Multiple label assignment

## Usage

1. Place your input files in the `data` directory:

   - `company_list.csv`: Your company data
   - `insurance_taxonomy.csv`: Insurance categories

2. Run the classifier:

   ```bash
   node src/index.js
   ```

3. Find the results in `output/classified_companies.csv`

## Classification Criteria

The classifier uses multiple methods to determine insurance categories:

1. **Direct Matching**:

   - Matches insurance-related keywords in company descriptions
   - Checks business tags for insurance terms
   - Analyzes sector and category for insurance context

2. **Similarity Matching**:

   - Calculates TF-IDF vectors for company descriptions
   - Compares with insurance category vectors
   - Uses cosine similarity for matching

3. **Context Validation**:
   - Verifies insurance-related context
   - Ensures relevance of matched categories
   - Limits to most relevant categories

## Performance

The classifier is designed to:

- Process large datasets efficiently
- Provide accurate insurance category assignments
- Handle multiple insurance labels per company
- Maintain high precision in classification

## Dependencies

- Node.js
- Natural language processing libraries
- CSV parsing utilities

## Output Example

```csv
Description,Business Tags,Sector,Category,Niche,Insurance Labels
"Company description...","['tag1', 'tag2']",Services,Category,Niche,"Auto Insurance, Health Insurance"
```

## Notes

- The classifier is optimized for insurance-related categorization
- Multiple insurance labels may be assigned based on company activities
- Classification is based on both exact matches and semantic similarity
- Results are sorted by relevance within each company's classifications
