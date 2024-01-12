import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  termsAndConditions: { type: String },
  termsAndConditionsLastUpdated: { type: Date },
  privacyPolicy: { type: String },
  privacyPolicyLastUpdated: { type: Date },
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
});

settingsSchema.pre("findOneAndUpdate", async function (next) {
  const currentData = await this.model.findOne(this.getQuery());
  const newData = this.getUpdate().$set;
  const updates = {
    ...newData,
  };

  if (newData.termsAndConditions !== currentData.termsAndConditions) {
    updates.termsAndConditionsLastUpdated = new Date();
  }

  if (newData.privacyPolicy !== currentData.privacyPolicy) {
    updates.privacyPolicyLastUpdated = new Date();
  }

  this.set(updates);

  next();
});

export const SettingsModel = mongoose.model("System", settingsSchema);
