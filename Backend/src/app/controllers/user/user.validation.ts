import { z } from 'zod';

export const userValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must not exceed 100 characters' }),
  
  email: z
    .string()
    .email({ message: 'Invalid email address format' }),
  
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(255, { message: 'Password must not exceed 255 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)' }),

  shortBio: z
    .string()
    .max(160, { message: 'Short bio must not exceed 160 characters' })
    .optional(),

  avatar: z
    .string()
    .url({ message: 'Avatar must be a valid URL' })
    .optional(),
});
