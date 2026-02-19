const fs = require('fs');
const readline = require('readline');
const path = require('path');

class VCFParser {
  constructor() {
    this.metadata = {};
    this.variants = [];
    this.headers = [];
  }

  /**
   * Parse VCF file and extract variants
   * @param {string} filePath - Path to VCF file
   * @returns {Promise<Object>} Parsed VCF data
   */
  async parseVCF(filePath) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
      });

      let lineNumber = 0;

      rl.on('line', (line) => {
        lineNumber++;

        // Skip empty lines
        if (!line.trim()) return;

        // Parse metadata lines
        if (line.startsWith('##')) {
          this.parseMetaLine(line);
          return;
        }

        // Parse header line
        if (line.startsWith('#CHROM')) {
          this.parseHeaderLine(line);
          return;
        }

        // Parse variant lines
        if (!line.startsWith('#')) {
          try {
            const variant = this.parseVariantLine(line);
            if (variant) {
              this.variants.push(variant);
            }
          } catch (error) {
            console.warn(`Error parsing line ${lineNumber}: ${error.message}`);
          }
        }
      });

      rl.on('close', () => {
        resolve({
          metadata: this.metadata,
          headers: this.headers,
          variants: this.variants,
          stats: {
            total_variants: this.variants.length,
            pharmacogenomic_variants: this.countPharmacogenomicVariants(),
            chromosomes: this.getUniqueChroms()
          }
        });
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }

  parseMetaLine(line) {
    // Extract metadata like ##fileformat, ##reference, etc.
    const match = line.match(/^##([\w-]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      if (!this.metadata[key]) {
        this.metadata[key] = [];
      }
      this.metadata[key].push(value);
    }
  }

  parseHeaderLine(line) {
    this.headers = line.split('\t');
  }

  parseVariantLine(line) {
    const fields = line.split('\t');

    if (fields.length < 8) {
      throw new Error('Insufficient fields in VCF variant line');
    }

    const [chrom, pos, rawId, ref, alt, qual, filter, info, ...rest] = fields;
    const id = rawId === '.' ? null : rawId;

    // Parse INFO field (comma-separated key=value pairs)
    const infoObj = this.parseINFO(info);

    return {
      chrom: chrom,
      pos: parseInt(pos),
      id: id || null,
      ref: ref,
      alt: alt,
      qual: qual === '.' ? null : parseFloat(qual),
      filter: filter,
      info: infoObj,
      genotype: rest.length > 0 ? this.parseGenotypes(rest) : null,
      raw_line: line
    };
  }

  parseINFO(infoString) {
    const infoObj = {};
    if (!infoString || infoString === '.') return infoObj;

    const pairs = infoString.split(';');
    pairs.forEach(pair => {
      if (!pair) return;
      const eq = pair.indexOf('=');
      if (eq === -1) {
        // Flag field without value
        infoObj[pair] = true;
      } else {
        const key = pair.substring(0, eq);
        const value = pair.substring(eq + 1);
        infoObj[key] = value;
      }
    });

    return infoObj;
  }

  parseGenotypes(genotypeFields) {
    // Parse genotype information if FORMAT field exists
    // Simple extraction for now, can be extended
    return {
      raw: genotypeFields
    };
  }

  countPharmacogenomicVariants() {
    const pharmacogenomicGenes = ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'];
    return this.variants.filter(v => {
      const gene = v.info.GENE || '';
      return pharmacogenomicGenes.some(pg => gene.includes(pg));
    }).length;
  }

  getUniqueChroms() {
    return [...new Set(this.variants.map(v => v.chrom))];
  }

  /**
   * Filter variants by pharmacogenomic genes
   * @param {Array} variants - All variants
   * @returns {Array} Filtered pharmacogenomic variants
   */
  filterPharmacogenomicVariants(variants) {
    const pharmacogenomicGenes = ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'];
    return variants.filter(variant => {
      // Support both raw parsed variant objects (variant.info.GENE)
      // and processed variant objects (variant.gene)
      const geneField = (variant && (variant.info && variant.info.GENE)) || variant.gene || '';
      try {
        return pharmacogenomicGenes.some(pg => geneField && geneField.toString().toUpperCase().includes(pg));
      } catch (e) {
        return false;
      }
    });
  }

  /**
   * Extract RSID and variant information
   * @param {Object} variant - Single variant
   * @returns {Object} Processed variant
   */
  processVariant(variant) {
    return {
      rsid: variant.id || `${variant.chrom}:${variant.pos}:${variant.ref}:${variant.alt}`,
      chromosome: variant.chrom,
      position: variant.pos,
      reference_allele: variant.ref,
      alternate_allele: variant.alt,
      quality: variant.qual,
      filter_status: variant.filter,
      gene: variant.info.GENE || 'Unknown',
      star_allele: variant.info.STAR || null,
      impact: variant.info.IMPACT || 'Unknown'
    };
  }
}

module.exports = VCFParser;
