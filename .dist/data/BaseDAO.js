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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseDAO {
    constructor(model) {
        this.model = model;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findById(id).exec();
            return result ? result.toObject() : null;
        });
    }
    findOne(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne(where).exec();
            return result ? result.toObject() : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.find().exec();
            return result.map((r) => r.toObject());
        });
    }
    remove(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.deleteOne(where).exec();
            return result.deletedCount === 1;
        });
    }
    findByIdAndUpdate(id_1, update_1) {
        return __awaiter(this, arguments, void 0, function* (id, update, options = { new: false }) {
            const result = yield this.model
                .findByIdAndUpdate(id, update, options)
                .exec();
            return result ? result.toObject() : null;
        });
    }
    updateMany(query_1, update_1) {
        return __awaiter(this, arguments, void 0, function* (query, update, options = { new: false }) {
            const result = yield this.model
                // @ts-ignore
                .updateMany(query, update, options)
                .exec();
            return { result };
        });
    }
    exist(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.exists(where);
            return result;
        });
    }
}
exports.default = BaseDAO;
