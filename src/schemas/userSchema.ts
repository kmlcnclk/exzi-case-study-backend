import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const signInSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email({ message: "This is not an email" }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
  }),
});

export const changePasswordSchema = object({
  body: object({
    oldPassword: string({
      required_error: "Old Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    newPassword: string({
      required_error: "New Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    newPasswordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
  }).refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match",
    path: ["newPasswordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
  }),
});

export const resetPasswordSchema = object({
  query: object({
    hash: string({
      required_error: "Hash is required",
    }),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export type generateJwtTokenInput = Omit<
  TypeOf<typeof signInSchema>,
  "body.email" | "body.password"
>;
