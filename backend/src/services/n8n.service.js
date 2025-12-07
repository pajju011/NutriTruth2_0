const axios = require("axios");
const logger = require("../utils/logger");

const n8nService = {
  async triggerOCRWorkflow(imageUrl) {
    try {
      const response = await axios.post(`${process.env.N8N_WEBHOOK_URL}/ocr`, {
        imageUrl,
      });
      return response.data;
    } catch (error) {
      logger.error("OCR workflow error:", error.message);
      throw error;
    }
  },

  async triggerClaimDetection(text) {
    try {
      const response = await axios.post(
        `${process.env.N8N_WEBHOOK_URL}/claim-detection`,
        { text }
      );
      return response.data;
    } catch (error) {
      logger.error("Claim detection workflow error:", error.message);
      throw error;
    }
  },
};

module.exports = n8nService;
