const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Updated CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dwellio-22657.web.app",
      "https://dwellio-22657.firebaseapp.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bpnbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("dwellio").collection("users");
    const propertyCollection = client.db("dwellio").collection("properties");
    const wishlistCollection = client.db("dwellio").collection("wishlist");
    const reviewCollection = client.db("dwellio").collection("reviews");
    const offerCollection = client.db("dwellio").collection("offers");
    const advertiseCollection = client.db("dwellio").collection("advertise");
    // middleware
    const verifyToken = async (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ error: "Unauthorized" });
        }
        req.decoded = decoded;
        next();
      });
    };

    const verifyAdmin = async (req, res, next) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user?.role !== "admin") {
        return res.status(403).send({ error: "Forbidden" });
      }
      next();
    };

    const verifyAgent = async (req, res, next) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user?.role !== "agent") {
        return res.status(403).send({ error: "Forbidden" });
      }
      next();
    };

    // jwt related API
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // get api for checking admin
    app.get("/admin/check/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ error: "Forbidden" });
      }
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ isAdmin });
    });

    // get api for checking agent
    app.get("/agent/check/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ error: "Forbidden" });
      }
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAgent = false;
      if (user?.role === "agent") {
        isAgent = true;
      }
      res.send({ isAgent });
    });

    // check user role
    // app.get("/user/role/:email", verifyToken, async (req, res) => {
    //   const email = req.params.email;
    //   if(email !== req.decoded.email){
    //     return res.status(403).send({ error: "Forbidden" });
    //   }
    //   const query = { email: email };
    //   const user = await userCollection.findOne(query);
    //   res.send({ role: user?.role });
    // });

    // save user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.status(400).send({ error: "User already exists" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // user

    // user profile
    app.get("/user/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // advertised properties
    app.get("/properties/advertised", async (req, res) => {
      const properties = await propertyCollection
        .find({ verificationStatus: "verified" })
        .toArray();
      res.send(properties);
    });

    // property details
    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const property = await propertyCollection.findOne(query);
      res.send(property);
    });

    // wishlist
    app.post("/wishlist", async (req, res) => {
      const wishlist = req.body;
      const result = await wishlistCollection.insertOne(wishlist);
      res.send(result);
    });

    // get wishlist
    app.get("/wishlist/:email", verifyToken, async (req, res) => {
      console.log(req.headers.authorization);
      const email = req.params.email;
      const query = { email: email };
      const wishlist = await wishlistCollection.find(query).toArray();
      res.send(wishlist);
    });

    // offers
    app.post("/offers", async (req, res) => {
      const offer = req.body;
      const result = await offerCollection.insertOne(offer);
      res.send(result);
    });

    // get offers
    app.get("/offers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const offers = await offerCollection.find(query).toArray();
      res.send(offers);
    });

    // delete from wishlist
    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishlistCollection.deleteOne(query);
      res.send(result);
    });

    // reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // get reviews
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { propertyId: id };
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });

    // get latest reviews
    app.get("/reviews/latest", async (req, res) => {
      const reviews = await reviewCollection
        .find()
        .sort({ reviewTime: -1 })
        .limit(3)
        .toArray();
      res.send(reviews);
    });

    // get all reviews
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    });

    // get all properties
    app.get("/properties", async (req, res) => {
      const properties = await propertyCollection
        .find({ verificationStatus: "verified" })
        .toArray();
      res.send(properties);
    });

    // admin

    // all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
    });

    // admin profile
    app.get("/admin/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // all properties
    app.get("/properties", async (req, res) => {
      const properties = await propertyCollection.find().toArray();
      res.send(properties);
    });

    // update property
    app.patch("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProperty = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.updateOne(query, {
        $set: updatedProperty,
      });
      res.send(result);
    });

    // update user role
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.updateOne(query, {
        $set: updatedUser,
      });
      res.send(result);
    });

    // delete user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // mark user as fraud
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.updateOne(query, {
        $set: updatedUser,
      });
      res.send(result);
    });

    // delete properties by agent email
    app.delete("/properties/agent/:email", async (req, res) => {
      const email = req.params.email;
      const query = { agentEmail: email };
      const result = await propertyCollection.deleteMany(query);
      res.send(result);
    });

    // agent

    // agent profile
    app.get("/agent/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // add property
    app.post("/properties", async (req, res) => {
      const property = req.body;
      const result = await propertyCollection.insertOne(property);
      res.send(result);
    });

    // check agent status
    app.get("/agent/status/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send({ status: user?.status });
    });

    // get properties by agent email
    app.get("/properties/agent/:email", async (req, res) => {
      const email = req.params.email;
      const query = { agentEmail: email };
      const properties = await propertyCollection.find(query).toArray();
      res.send(properties);
    });

    // update property
    app.patch("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProperty = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.updateOne(query, {
        $set: updatedProperty,
      });
      res.send(result);
    });

    // delete property
    app.delete("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.deleteOne(query);
      res.send(result);
    });

    // get all offers
    app.get("/offers", async (req, res) => {
      const offers = await offerCollection.find({}).toArray();
      res.send(offers);
    });

    // user, property and review calculaton for admin
    app.get("/admin/stats", async (req, res) => {
      const users = await userCollection.countDocuments();
      const properties = await propertyCollection.countDocuments();
      const reviews = await reviewCollection.countDocuments();
      res.send({ users, properties, reviews });
    });

    // user details
    app.get("/user/details/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // Get reviews by user email
    app.get("/reviews/user/:email", verifyToken, async (req, res) => {
      try {
        const { email } = req.params;
        const reviews = await reviewCollection
          .find({ reviewerEmail: email })
          .sort({ timestamp: -1 })
          .toArray();
        res.json(reviews);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
      }
    });

    // delete review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    // update offer status
    app.patch("/offers/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedOffer = req.body;
        const query = { _id: new ObjectId(id) };

        const result = await offerCollection.updateOne(query, {
          $set: updatedOffer,
        });

        if (updatedOffer.status === "bought") {
          // Update property status to sold
          await propertyCollection.updateOne(
            { title: updatedOffer.propertyTitle },
            { $set: { status: "sold" } }
          );
        }

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // check property status
    app.get("/properties/status/:title", async (req, res) => {
      const title = req.params.title;
      const query = { title: title };
      const property = await propertyCollection.findOne(query);
      res.send({ status: property?.status });
    });

    // advertise
    // post advertise property
    app.post("/advertise", async (req, res) => {
      try {
        const advertiseProperty = req.body;
        const result = await advertiseCollection.insertOne(advertiseProperty);

        // Update the property's advertised status
        await propertyCollection.updateOne(
          { title: advertiseProperty.propertyTitle },
          { $set: { isAdvertised: true } }
        );

        res.send(result);
      } catch (error) {
        console.error("Error adding advertise:", error);
        res.status(500).json({ error: "Failed to add advertise" });
      }
    });

    // get advertised properties
    app.get("/advertised", async (req, res) => {
      try {
        const result = await advertiseCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching advertised properties:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch advertised properties" });
      }
    });

    // Add these routes
    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { price } = req.body;
        const amount = parseInt(price * 100);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
