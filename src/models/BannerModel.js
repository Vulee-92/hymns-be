const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  link: { type: String }
});

const deviceImagesSchema = new mongoose.Schema({
  desktop: [imageSchema],
  mobile: [imageSchema]
});

const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String },
  mainImages: deviceImagesSchema,
  subImages: deviceImagesSchema,
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Đảm bảo chỉ có một banner active
bannerSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;