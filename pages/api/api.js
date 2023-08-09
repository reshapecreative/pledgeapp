import axios from "axios";

export default async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/campaign?id=1"
    );
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
