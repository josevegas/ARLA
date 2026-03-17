"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        req.body = parsed.body;
        req.params = parsed.params;
        req.query = parsed.query;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ errors: error.errors });
        }
        else {
            next(error);
        }
    }
};
exports.validate = validate;
//# sourceMappingURL=validation.js.map