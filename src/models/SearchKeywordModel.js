const mongoose = require('mongoose');

const searchKeywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const SearchKeyword = mongoose.model('SearchKeyword', searchKeywordSchema);

module.exports = SearchKeyword;