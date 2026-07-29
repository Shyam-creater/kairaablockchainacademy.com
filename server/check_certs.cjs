const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Academy:MU7gl0n5lu1U0eyR@cluster0.kxjzl.mongodb.net/academy_details?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const db = mongoose.connection.db;
  const certificates = await db.collection('certificates').find({}).limit(5).toArray();
  
  if (certificates.length === 0) {
    console.log("No certificates found in the database.");
  } else {
    for (let c of certificates) {
      console.log(`Cert Number: ${c.certificateNumber}, Status: ${c.status}`);
    }
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
