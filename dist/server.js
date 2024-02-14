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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv_1.default.config();
const port = process.env.PORT;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    process.env.NODE_ENV === 'development' ?
        yield mongoose_1.default.connect(`${process.env.MONGODB_URI}`)
            .then(() => { console.log("Local Db connected successfully!"), { useNewUrlParser: true, useUnifiedTopology: true }; })
            .catch(err => { console.log(err); })
        : yield mongoose_1.default.connect(`${process.env.MONGODB_URI_CLOUD}`)
            .then(() => { console.log("Cluster Db connected successfully!"); })
            .catch(err => { console.log(err); });
});
connect();
const app = (0, express_1.default)();
app.set('trust proxy', true);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ limit: '6mb', extended: true, parameterLimit: 6000 }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
// Home Route
app.get("/", (request, response) => {
    response.json("Welcome to VZY Assessment");
});
app.use('/user', user_route_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
