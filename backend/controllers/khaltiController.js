import axios from "axios";

const khaltiConfig = {
  secretKey: process.env.KHALTI_SECRET_KEY,
};

export const initializeKhaltiPayment = async (req, res) => {
  try {
    const { amount, returnUrl } = req.body;

    const response = await axios.post(
      "https://khalti.com/api/v2/payment/initiate/",
      { amount, return_url: returnUrl },
      { headers: { Authorization: `Key ${khaltiConfig.secretKey}` } }
    );

    res
      .status(200)
      .json({ success: true, paymentUrl: response.data.payment_url });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment initiation failed" });
  }
};

export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { token, amount } = req.body;

    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      { token, amount },
      { headers: { Authorization: `Key ${khaltiConfig.secretKey}` } }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};
