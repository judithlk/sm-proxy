"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('BACKEND_URL:', process.env.BACKEND_URL);
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Replaces body-parser
// Environment-based backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://smart-waste-backend-wsmj.onrender.com';
// Root route for health check
app.get('/', (req, res) => {
    res.send('Smart Waste Proxy is running ✅');
});
// Forward PUT requests to backend
app.put('/bins/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield axios_1.default.put(`${BACKEND_URL}/api/bins/${req.params.id}`, req.body, {
            headers: {
                Authorization: req.headers.authorization || '',
                'Content-Type': 'application/json',
            },
        });
        res.status(response.status).send(response.data);
    }
    catch (error) {
        console.error('Proxy error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).send({
            error: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || 'Failed to forward request',
        });
    }
}));
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on port ${PORT}`);
});
