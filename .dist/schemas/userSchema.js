"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changeDefaultWalletSchema = exports.signInUserWithGoogleSchema = exports.signUpUserWithGoogleSchema = exports.searchUserSchema = exports.getBalanceWeb3Schema = exports.editUserSchema = exports.changePasswordSchema = exports.signInSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(6, "Password too short - should be 6 chars minimum"),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "passwordConfirmation is required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
});
exports.signInSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email({ message: "This is not an email" }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(6, "Password too short - should be 6 chars minimum"),
    }),
});
exports.changePasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        oldPassword: (0, zod_1.string)({
            required_error: "Old Password is required",
        }).min(6, "Password too short - should be 6 chars minimum"),
        newPassword: (0, zod_1.string)({
            required_error: "New Password is required",
        }).min(6, "Password too short - should be 6 chars minimum"),
        newPasswordConfirmation: (0, zod_1.string)({
            required_error: "Password Confirmation is required",
        }),
    }).refine((data) => data.newPassword === data.newPasswordConfirmation, {
        message: "Passwords do not match",
        path: ["newPasswordConfirmation"],
    }),
});
exports.editUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({}).optional(),
        email: (0, zod_1.string)({}).email("Not a valid email").optional(),
    }),
});
exports.getBalanceWeb3Schema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        networkName: (0, zod_1.string)({}),
    }),
});
exports.searchUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
    }),
});
exports.signUpUserWithGoogleSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
    }),
});
exports.signInUserWithGoogleSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
    }),
});
exports.changeDefaultWalletSchema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Wallet id is required",
        }),
    }),
});
exports.forgotPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
    }),
});
exports.resetPasswordSchema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        hash: (0, zod_1.string)({
            required_error: "Hash is required",
        }),
    }),
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }),
    }),
});
