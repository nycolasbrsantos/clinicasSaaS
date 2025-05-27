import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// table users

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

// Users relations

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  clinics: many(usersToClinicsTable),
}));

// table clinics

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Users to clinic table

export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id)
    .notNull(),
});

// Users to clinic table relations

export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

// table Clinics relations

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  pacients: many(pacientsTable),
  appoinments: many(appoinmentsTable),
  usersToClinics: many(usersToClinicsTable),
}));

// table doctors

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),

  // 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 0: Sunday

  availableFromWeekday: integer("available_from_weekday").notNull(), // 1
  availableToWeekday: integer("available_to_weekday").notNull(), // 5
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("spciality").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorsTableRelations = relations(doctorsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

// enum pacient gender

export const genderEnum = pgEnum("pacient_gender", ["male", "female", "other"]);

// table pacients

export const pacientsTable = pgTable("pacients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  gender: genderEnum("gender").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const pacientsTableRelations = relations(pacientsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [pacientsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

// enum appointment status

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

// table appoinments

export const appoinmentsTable = pgTable("appoinments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  pacientId: uuid("pacient_id")
    .references(() => pacientsTable.id, { onDelete: "cascade" })
    .notNull(),
  doctorId: uuid("doctor_id")
    .references(() => doctorsTable.id, { onDelete: "cascade" })
    .notNull(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  status: appointmentStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appoinmentsTableRelations = relations(
  appoinmentsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [appoinmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
    pacient: one(pacientsTable, {
      fields: [appoinmentsTable.pacientId],
      references: [pacientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appoinmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
  }),
);
