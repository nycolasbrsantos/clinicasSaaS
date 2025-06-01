import { z } from "zod";

export const GENDER_OPTIONS = [
  { label: "Masculino", value: "MALE" },
  { label: "Feminino", value: "FEMALE" },
] as const;

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().min(1, {
    message: "Telefone é obrigatório",
  }),
  sex: z.enum(["male", "female"]),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
