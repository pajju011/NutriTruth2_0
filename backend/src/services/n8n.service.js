const axios = require("axios");
const logger = require("../utils/logger");

const N8N_BASE_URL =
  process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook";

const n8nService = {
  // Trigger OCR workflow
  async triggerOCRWorkflow(imageUrl) {
    try {
      logger.info(`Triggering OCR workflow for: ${imageUrl}`);

      const response = await axios.post(
        `${N8N_BASE_URL}/ocr`,
        {
          imageUrl,
        },
        { timeout: 30000 }
      );

      return response.data;
    } catch (error) {
      logger.error(`OCR workflow error: ${error.message}`);

      // Return mock data for development
      if (process.env.NODE_ENV === "development") {
        return {
          text: "Sample extracted text from product label. Contains: Sugar, Palm Oil, Artificial Flavors. 100% Natural claim visible.",
          confidence: 0.92,
        };
      }
      throw error;
    }
  },

  // Trigger claim detection workflow
  async triggerClaimDetection(text) {
    try {
      logger.info("Triggering claim detection workflow");

      const response = await axios.post(
        `${N8N_BASE_URL}/claims`,
        {
          text,
        },
        { timeout: 30000 }
      );

      return response.data;
    } catch (error) {
      logger.error(`Claim detection error: ${error.message}`);

      // Return mock data for development
      if (process.env.NODE_ENV === "development") {
        return {
          claims: [
            {
              text: "100% Natural",
              issue: "Contains artificial ingredients",
              severity: "high",
              verified: false,
            },
            {
              text: "Sugar Free",
              issue: "Contains maltodextrin",
              severity: "medium",
              verified: false,
            },
          ],
        };
      }
      throw error;
    }
  },

  // Trigger safety score calculation
  async triggerSafetyScore(data) {
    try {
      logger.info("Triggering safety score workflow");

      const response = await axios.post(
        `${N8N_BASE_URL}/score`,
        {
          ...data,
        },
        { timeout: 30000 }
      );

      return response.data;
    } catch (error) {
      logger.error(`Safety score error: ${error.message}`);

      // Return mock data for development
      if (process.env.NODE_ENV === "development") {
        return {
          score: 65,
          contradictions: [
            "Claims natural but contains artificial ingredients",
          ],
          warnings: ["High sugar content", "Contains preservatives"],
        };
      }
      throw error;
    }
  },

  // Trigger product scan workflow
  async triggerProductScan(data) {
    try {
      logger.info(`Triggering product scan for barcode: ${data.barcode}`);

      const response = await axios.post(
        `${N8N_BASE_URL}/product-scan`,
        {
          ...data,
        },
        { timeout: 30000 }
      );

      return response.data;
    } catch (error) {
      logger.error(`Product scan error: ${error.message}`);

      // Return mock data for development
      if (process.env.NODE_ENV === "development") {
        return {
          name: "Scanned Product",
          brand: "Unknown Brand",
          category: "General",
          safetyScore: 50,
        };
      }
      throw error;
    }
  },
};

module.exports = n8nService;
