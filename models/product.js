const mongooes = require("mongoose");

const productsSchema = mongooes.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
    },
    brand: { type: String, require: true },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    attrs: [
      {
        size: { type: String, require: true },
        stock: { type: Number, default: 1 },
        price: { type: Number, require: true, default: 0 },
        locale: { type: String, require: true },
      },
    ],
    discountPrice: {
      type: Number,
      require: true,
      default: 0,
    },
    productImages: [
      {
        img: { type: String },
      },
    ],
    mainImage: {
      type: String,
    },
    reviews: [
      {
        userId: { type: mongooes.Schema.Types.ObjectId, ref: "Users" },
        review: String,
        rating: Number,
      },
    ],
    category: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "Categories",
      require: true,
    },
    createdBy: { type: mongooes.Schema.Types.ObjectId, ref: "Users" },
    createdDate: Date,
    updateBy: { type: mongooes.Schema.Types.ObjectId, ref: "Users" },
    updateAt: Date,
  },
  { timestamps: true }
);

module.exports = mongooes.model("Products", productsSchema);
