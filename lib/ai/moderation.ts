import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface ModerationResult {
  isToxic: boolean;
  score: number;
  label: string;
}

/**
 * Moderates text content using Hugging Face text classification models.
 * It classifies the text for toxicity/hate speech.
 * Falls back gracefully to allow the operation if the API fails or key is missing.
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  if (!text || !text.trim()) {
    return { isToxic: false, score: 0, label: "none" };
  }

  if (!process.env.HUGGINGFACE_API_KEY) {
    console.warn("HUGGINGFACE_API_KEY is not defined. Skipping moderation checks.");
    return { isToxic: false, score: 0, label: "none" };
  }

  try {
    const classification = await hf.textClassification({
      model: "martin-ha/toxic-comment-model",
      inputs: text,
    });

    if (Array.isArray(classification) && classification.length > 0) {
      // The model returns array of { label: 'toxic' | 'non-toxic', score: number }
      const toxicClass = classification.find(
        (c) => c.label.toLowerCase() === "toxic" || c.label.toLowerCase() === "severe_toxic"
      );

      if (toxicClass && toxicClass.score > 0.7) {
        console.log(`Moderation Alert: Text flagged as toxic (score: ${toxicClass.score}): "${text}"`);
        return { isToxic: true, score: toxicClass.score, label: toxicClass.label };
      }
    }

    return { isToxic: false, score: 0, label: "clean" };
  } catch (error) {
    console.error("Hugging Face moderation API error:", error);
    // Graceful fallback: do not block the user if the external API has an issue
    return { isToxic: false, score: 0, label: "error_fallback" };
  }
}
