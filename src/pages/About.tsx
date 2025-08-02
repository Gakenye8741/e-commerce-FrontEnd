import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
     <Navbar/>
     <div className="max-w-4xl mx-auto px-4 py-20 text-brandDark">
      <h1 className="text-4xl font-bold mb-6 text-center text-brandMid">About Nova Cart</h1>

      <p className="mb-4 text-lg">
        Welcome to <span className="font-semibold">Nova Cart</span> – your trusted destination for effortless online shopping.
      </p>

      <p className="mb-4">
        At Nova Cart, we believe shopping should be fast, enjoyable, and stress-free. Whether you’re after trending tech,
        home essentials, or lifestyle products, our platform is built to serve you.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">What We Offer</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Curated, quality-checked products</li>
        <li>Seamless, secure checkout</li>
        <li>Real-time order tracking</li>
        <li>Fast delivery and responsive support</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Our Mission</h2>
      <p className="mb-4">
        To simplify online shopping with technology and care — so you can focus on what matters most.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Join the Community</h2>
      <p>
        We’re more than a store. We're a community. Follow us, share your experiences, and help shape the future of e-commerce.
        Thank you for choosing Nova Cart. 🛒
      </p>
    </div>
    </>
  );
};

export default About;
