import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.log("Usage: node src/utils/hashGenerator.js <your_password>");
  process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
    process.exit(1);
  }
  console.log("\n==================================================");
  console.log("Password Hash Generated Successfully!");
  console.log("==================================================");
  console.log(`Password: ${password}`);
  console.log(`Hash:     ${hash}`);
  console.log("==================================================");
  console.log("\nCopy the hash above and paste it into your .env as:");
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
});
