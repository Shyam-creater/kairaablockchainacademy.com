const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Academy:MU7gl0n5lu1U0eyR@cluster0.kxjzl.mongodb.net/academy_details?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('certificates').deleteMany({});
  console.log(`Deleted ${result.deletedCount} certificates.`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
