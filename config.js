"use strict";
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/my_design_book";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost/my_design_book";
exports.PORT = process.env.PORT || 8080;