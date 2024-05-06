const Payment = require("../Db/models/paymentschema");
const razorpay = require("razorpay");
const crypto = require("crypto");

const id = "rzp_test_MjMLkuKBGG0DXf";
const key = "Emg2wmOAFjLUjNpNP5gxjknF";
const instance = new razorpay({
  key_id: id,
  key_secret: key,
});

// checkout api
const Checkout = async (req, res) => {
  try {
    //console.log(req.body);
    //console.log(req.body.price);
    const options = {
      amount: Number(req.body.price * 100), //as razorpay takes least denominationo of a currency, and for INR least is paisa, hence *100
      currency: "INR",
    };

    // console.log(options);
    const order = await instance.orders.create(options);
    // console.log(order);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);
  }
};

// payemnt verification

const verifypay = async (req, res) => {
  try {
    //console.log(req.body.data);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body.data;

    const data = razorpay_order_id + "|" + razorpay_payment_id;

    //crypto is inbuilt in razorpay
    const expectedsignature = crypto
      .createHmac("sha256", key)
      .update(data.toString())
      .digest("hex");

    // console.log("exp", expectedsignature);
    //console.log("giv", req.body.data.razorpay_signature );
    const isauth = expectedsignature === razorpay_signature;
    //console.log(isauth);

    if (isauth) {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      res.status(200).json({ json: "payment successful" });
    } else {
      res.status(400).json({ json: "payment failed" });
    }
  } catch (err) {
    console.log(err);
  }
};

const Getkey = async (req, res) => {
  return res.status(200).json({ key: id });
};

module.exports = { Checkout, verifypay, Getkey };
