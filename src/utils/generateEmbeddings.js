const { BadRequest } = require("../response/error");

async function generateEmbeddingsFromText(text) {
  try {
    const res = await fetch(process.env.NLP_TEXT_EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.NLP_CLOUD_API}`,
      },
      body: JSON.stringify({ sentences: [text] }),
    });
    const data = await res.json();

    return data.embeddings[0];
  } catch (error) {
    console.log(error);
    throw new BadRequest("The API is not available. Please try again later.");
  }
}

async function generateEmbeddingsFromTextV2(text) {
  try {
    const res = await fetch(
      `${process.env.EMBEDDING_SERVICE_URL}/api/embeddings/text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );
    const data = await res.json();

    return data.embeddings;
  } catch (error) {
    console.log(error);
    throw new BadRequest("The API is not available. Please try again later.");
  }
}

async function generateEmbeddingsFromImageUrl(imageUrl) {
  try {
    const res = await fetch(
      `${process.env.EMBEDDING_SERVICE_URL}/api/embeddings/image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      }
    );
    const data = await res.json();

    return data.embeddings;
  } catch (error) {
    console.log(error);
    throw new BadRequest("The API is not available. Please try again later.");
  }
}

module.exports = {
  generateEmbeddingsFromText,
  generateEmbeddingsFromTextV2,
  generateEmbeddingsFromImageUrl,
};
